#!/usr/bin/env bash

##
## Script benchmark VPS đơn giản (v1 – local only, chưa gửi API)
## - Đo ping tới một số host cố định
## - Đo tốc độ download HTTP từ một file public
## - In kết quả dạng summary bằng tiếng Anh
##

set -euo pipefail

###
### Cấu hình mặc định
### Có thể đổi lại host/file sau này cho phù hợp với hạ tầng thật
###

PING_TARGETS=(
  "google.com"
  "cloudflare.com"
)

# URL API mặc định để gửi báo cáo
DEFAULT_REPORT_URL="https://www.tocdovps.dev/api/benchmark/report"

# Token mặc định để xác thực với API (server phải dùng cùng giá trị trong REPORT_TOKEN)
DEFAULT_REPORT_TOKEN="dit-con-me-may-luon"

# URL file dùng để đo tốc độ download (có thể thay bằng endpoint CDN của bạn)
DOWNLOAD_URL_DEFAULT="https://speed.hetzner.de/100MB.bin"

###
### Hàm in heading
### @param $1 - Chuỗi tiêu đề cần in
###
print_heading() {
  local title="$1"
  echo
  echo "============================================================"
  echo "  $title"
  echo "============================================================"
}

###
### Hàm kiểm tra command có tồn tại hay không
### @param $1 - Tên command cần kiểm tra
### @returns 0 nếu tồn tại, 1 nếu không
###
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

###
### Hàm đo ping tới một host
### @param $1 - Hostname hoặc IP
### @returns In ra một dòng "host avg_ms" hoặc "host error"
###
run_ping_test() {
  local host="$1"

  # -c 5: gửi 5 gói, -q: output ngắn gọn
  if ! ping_output=$(ping -c 5 -q "$host" 2>/dev/null); then
    echo "$host error"
    return 0
  fi

  # Dòng cuối thường có dạng: rtt min/avg/max/mdev = 10.123/20.456/...
  local avg_ms
  avg_ms=$(echo "$ping_output" | awk -F'/' '/rtt|round-trip/ {print $5}')

  if [[ -z "${avg_ms:-}" ]]; then
    echo "$host error"
  else
    echo "$host $avg_ms"
  fi
}

###
### Hàm đo tốc độ download HTTP bằng curl
### @param $1 - URL file cần tải
### @returns In ra "time_total_sec speed_Mbps"
###
run_download_test() {
  local url="$1"

  if ! command_exists curl; then
    echo "0 0"
    return 0
  fi

  # -o /dev/null: bỏ dữ liệu, -s: silent, -w: format kết quả
  local result
  result=$(curl -o /dev/null -s -w "%{time_total} %{speed_download}" "$url" || echo "0 0")

  local time_total speed_bytes_per_sec
  time_total=$(echo "$result" | awk '{print $1}')
  speed_bytes_per_sec=$(echo "$result" | awk '{print $2}')

  # Chuyển bytes/s -> Mbps: speed_bytes_per_sec * 8 / 1_000_000
  local speed_mbps
  speed_mbps=$(awk -v bps="$speed_bytes_per_sec" 'BEGIN { printf "%.2f", (bps * 8 / 1000000) }')

  echo "$time_total $speed_mbps"
}

###
### Hàm tính "score" đơn giản dựa trên ping trung bình & download
### @param $1 - avg_ping_ms (float)
### @param $2 - download_mbps (float)
### @returns In ra score ở range tương đối (0-10)
###
compute_score() {
  local avg_ping_ms="$1"
  local download_mbps="$2"

  # Logic rất đơn giản (placeholder):
  # - ping tốt: < 20ms -> bonus
  # - download cao -> score cao
  # Công thức: score = (download_mbps / 100) * 7 + max(0, (50 - avg_ping_ms) / 50 * 3)

  awk -v ping="$avg_ping_ms" -v down="$download_mbps" 'BEGIN {
    ping_factor = (50 - ping) / 50;
    if (ping_factor < 0) ping_factor = 0;
    if (ping_factor > 1) ping_factor = 1;

    score = (down / 100.0) * 7.0 + ping_factor * 3.0;
    if (score < 0) score = 0;
    if (score > 10) score = 10;

    printf "%.2f", score;
  }'
}

###
### Gửi JSON report tới API nếu cấu hình REPORT_URL và REPORT_TOKEN
### @param $1 - JSON string của payload
###
send_report_if_configured() {
  local json_payload="$1"

  # Ưu tiên REPORT_URL từ env (dev / override), nếu không thì dùng DEFAULT_REPORT_URL
  local report_url="${REPORT_URL:-$DEFAULT_REPORT_URL}"
  # Ưu tiên REPORT_TOKEN từ env (dev / override), nếu không thì dùng DEFAULT_REPORT_TOKEN
  local report_token="${REPORT_TOKEN:-$DEFAULT_REPORT_TOKEN}"

  if [[ -z "$report_token" ]]; then
    echo
    echo "[i] REPORT_TOKEN is not set. Skipping remote report."
    return 0
  fi

  if ! command_exists curl; then
    echo
    echo "[i] curl is not available. Skipping remote report."
    return 0
  fi

  echo
  echo "[i] Sending benchmark report to API..."

  # Gửi JSON payload kèm header X-REPORT-TOKEN và in response (debug)
  curl -v -X POST "$report_url" \
    -H "Content-Type: application/json" \
    -H "X-REPORT-TOKEN: $report_token" \
    -d "$json_payload" || {
      echo
      echo "[!] Failed to send report. This does not affect local output."
    }
}

###
### Hàm main: chạy toàn bộ benchmark local và (nếu cấu hình) gửi report tới API
### @returns 0 luôn, để tránh làm fail CI nếu dùng sau này
###
main() {
  print_heading "vps-benchmark-hophamlam (local benchmark v1)"
  echo "This script runs a very simple, local benchmark."
  echo "Optionally, it can POST a JSON report to vps-benchmark-hophamlam if configured."
  echo

  # Kiểm tra command cần thiết
  if ! command_exists ping; then
    echo "[!] 'ping' command is required but not found."
    echo "    Please install 'iputils-ping' or equivalent and run again."
    return 0
  fi

  if ! command_exists curl; then
    echo "[!] 'curl' command is recommended for download test but not found."
    echo "    Download speed test will be skipped."
  fi

  echo "OS info:"
  uname -a || true
  echo

  print_heading "1. Network latency (ping)"
  echo "Host                Avg latency (ms)"
  echo "-------------------------------------"

  local sum_ping=0
  local valid_ping_count=0

  for host in "${PING_TARGETS[@]}"; do
    line=$(run_ping_test "$host")
    host_name=$(echo "$line" | awk '{print $1}')
    host_value=$(echo "$line" | awk '{print $2}')

    if [[ "$host_value" == "error" ]]; then
      printf "%-18s %s\n" "$host_name" "error"
    else
      printf "%-18s %s\n" "$host_name" "$host_value"
      sum_ping=$(awk -v a="$sum_ping" -v b="$host_value" 'BEGIN { printf "%.4f", a + b }')
      valid_ping_count=$((valid_ping_count + 1))
    fi
  done

  local avg_ping_overall="0"
  if [[ $valid_ping_count -gt 0 ]]; then
    avg_ping_overall=$(awk -v s="$sum_ping" -v c="$valid_ping_count" 'BEGIN { printf "%.2f", s / c }')
  fi

  print_heading "2. HTTP download test"
  local download_url="${DOWNLOAD_URL_DEFAULT}"
  echo "Download URL: $download_url"

  local time_total speed_mbps
  read -r time_total speed_mbps <<<"$(run_download_test "$download_url")"

  printf "Total time   : %s s\n" "$time_total"
  printf "Avg speed    : %s Mbps\n" "$speed_mbps"

  print_heading "3. Simple combined score (temporary)"

  local score
  score=$(compute_score "$avg_ping_overall" "$speed_mbps")

  printf "Avg ping (all hosts): %s ms\n" "$avg_ping_overall"
  printf "Download speed      : %s Mbps\n" "$speed_mbps"
  printf "Overall score (0-10): %s\n" "$score"

  echo
  echo "Note: This is a very early benchmark script."
  echo "      You can choose to share this result with vps-benchmark-hophamlam."

  # Chuẩn bị JSON payload để gửi lên API (đơn giản, không cần jq)
  # Lưu ý: không escape đặc biệt vì các field hiện tại đều là số/chuỗi đơn giản.
  local json_payload
  json_payload=$(cat <<EOF
{
  "serverLabel": null,
  "avgPingMs": ${avg_ping_overall:-0},
  "downloadMbps": ${speed_mbps:-0},
  "score": ${score:-0},
  "payload": {
    "pingTargets": ["google.com", "cloudflare.com"],
    "avgPingMs": ${avg_ping_overall:-0},
    "download": {
      "url": "${DOWNLOAD_URL_DEFAULT}",
      "timeSeconds": ${time_total:-0},
      "speedMbps": ${speed_mbps:-0}
    }
  }
}
EOF
)

  echo
  read -r -p "Share this result with vps-benchmark-hophamlam (y/N)? " answer
  case "$answer" in
    [Yy]*)
      send_report_if_configured "$json_payload"
      ;;
    *)
      echo "[i] Result kept local only. No data was sent."
      ;;
  esac
}

main "$@" || true


