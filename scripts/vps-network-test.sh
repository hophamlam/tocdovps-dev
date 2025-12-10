#!/usr/bin/env bash

## Network Speed Test Script (Speedtest by Ookla only)
## Usage:
##   SPEEDTEST_SERVER_IDS="17757,17756" bash scripts/vps-network-test.sh

set -euo pipefail

print_heading() {
  local title="$1"
  echo
  echo "============================================================"
  echo "  $title"
  echo "============================================================"
}

command_exists() { command -v "$1" >/dev/null 2>&1; }

# Server IDs (comma-separated) -> array
IFS=',' read -r -a SPEEDTEST_SERVER_IDS <<< "${SPEEDTEST_SERVER_IDS:-17757,2552,26853,13623,61296,50467,40733,12492,19230,40074,24281,30907}"

# Map server id -> nhãn hiển thị thân thiện (quốc gia/nhà mạng)
declare -A SPEEDTEST_LABELS=(
  [17757]="VN HN VNPT"
  [2552]="VN HN FPT"
  [26853]="VN HCM Viettel"
  [13623]="SG Singtel"
  [61296]="HK HKIX"
  [50467]="JP Tokyo Verizon"
  [40733]="IN Kolkata TataPlay"
  [12492]="AU Sydney Telstra"
  [19230]="US LA Hivelocity"
  [40074]="BR Vtal"
  [24281]="UK London Vodafone"
  [30907]="DE Berlin DeutscheTelekom"
)

numeric_or_zero() {
  local v="$1"
  # Trim spaces/newlines/carriage returns
  v="$(printf '%s' "$v" | tr -d ' \r\n')"
  # Accept plain or scientific notation
  if [[ "$v" =~ ^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?$ ]]; then
    echo "$v"
  else
    echo "0"
  fi
}

# Optional sleep between servers to avoid rate limit
SPEEDTEST_SLEEP="${SPEEDTEST_SLEEP:-3}"

# Run speedtest for one server id; prefer JSON parsing
run_speedtest_for_server() {
  local server_id="$1"
  local out ping_ms dl_mbps ul_mbps
  local parsed_with=""
  local label="${SPEEDTEST_LABELS[$server_id]:-ServerID $server_id}"

  # Capture stdout (JSON). Keep stderr in case of issues.
  out=$(speedtest --accept-license --accept-gdpr --progress=no --server-id "$server_id" --format=json 2>speedtest_err.$$ || true)
  local err; err=$(cat speedtest_err.$$ 2>/dev/null || true)
  rm -f speedtest_err.$$ || true

  if [[ -z "$out" ]]; then
    echo "[warn] speedtest returned empty output for server $server_id" >&2
    [[ -n "$err" ]] && echo "[stderr] $err" >&2
    return 1
  fi

  if command_exists python3; then
    # Đưa JSON vào stdin, script qua -c để tránh ghi đè stdin
    read -r ping_ms dl_mbps ul_mbps < <(python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
    dl = data.get("download", {}).get("bandwidth", 0)
    ul = data.get("upload", {}).get("bandwidth", 0)
    ping = data.get("ping", {}).get("latency", 0)
    dl_mbps = dl * 8 / 1_000_000
    ul_mbps = ul * 8 / 1_000_000
    # In số thô để tránh rỗng khi format lỗi
    print(ping, dl_mbps, ul_mbps)
except Exception:
    print("0 0 0")
' <<< "$out")
    parsed_with="python"
  fi

  # If python missing or zeroed, try jq
  if { [[ -z "$ping_ms" || "$ping_ms" == "0" ]] && [[ -z "$dl_mbps" || "$dl_mbps" == "0" ]] && [[ -z "$ul_mbps" || "$ul_mbps" == "0" ]]; } && command_exists jq; then
    ping_ms=$(echo "$out" | jq -r '.ping.latency //0')
    dl_mbps=$(echo "$out" | jq -r '((.download.bandwidth //0) * 8 / 1000000) //0')
    ul_mbps=$(echo "$out" | jq -r '((.upload.bandwidth //0) * 8 / 1000000) //0')
    parsed_with="jq"
  fi

  # If still empty, fallback regex
  if [[ -z "$ping_ms" || -z "$dl_mbps" || -z "$ul_mbps" ]]; then
    # Fallback: regex parse
    ping_ms=$(echo "$out" | grep -oP '"latency"\s*:\s*\K[0-9.eE+-]+' | head -1)
    dl_bw=$(echo "$out" | grep -oP '"download"\\s*:\\s*\\{[^}]*"bandwidth"\\s*:\\s*\\K[0-9]+' | head -1)
    ul_bw=$(echo "$out" | grep -oP '"upload"\\s*:\\s*\\{[^}]*"bandwidth"\\s*:\\s*\\K[0-9]+' | head -1)
    dl_mbps=$(awk -v bw="${dl_bw:-0}" 'BEGIN { printf "%.2f", (bw*8)/1000000 }')
    ul_mbps=$(awk -v bw="${ul_bw:-0}" 'BEGIN { printf "%.2f", (bw*8)/1000000 }')
    [[ -z "$parsed_with" ]] && parsed_with="regex"
  fi

  ping_ms=$(numeric_or_zero "${ping_ms:-0}")
  dl_mbps=$(numeric_or_zero "${dl_mbps:-0}")
  ul_mbps=$(numeric_or_zero "${ul_mbps:-0}")

  if [[ "$ping_ms" == "0" && "$dl_mbps" == "0" && "$ul_mbps" == "0" ]]; then
    # Báo lỗi khi parser trả về toàn giá trị 0 để script có thể exit !=0
    echo "[warn] server $server_id parsed only zeros; parser=${parsed_with:-unknown}" >&2
    echo "[warn] raw json: $out" >&2
    [[ -n "$err" ]] && echo "[stderr] $err" >&2
    return 1
  fi

  echo "$label|$ping_ms|$dl_mbps|$ul_mbps"
  return 0
}

run_speedtest_batch() {
  local results=()
  local any_success=false

  for sid in "${SPEEDTEST_SERVER_IDS[@]}"; do
    [[ -z "$sid" ]] && continue
    local line rc
    # Nếu speedtest trả về 0-0-0, coi như thất bại để tổng thể return !=0
    if line=$(run_speedtest_for_server "$sid"); then
      rc=0
    else
      rc=$?
    fi
    # Avoid hitting Ookla rate-limit too fast
    sleep "${SPEEDTEST_SLEEP}"
    if [[ "$rc" -eq 0 && -n "$line" ]]; then
      results+=("$line")
      any_success=true
    else
      echo "[info] skip server $sid due to parse failure" >&2
    fi
  done

  if [[ "$any_success" == "false" ]]; then
    echo ""
    return 1
  fi

  printf "%s\n" "${results[@]}"
}

display_speedtest_results() {
  local data="$1"
  echo
  echo "Network Speed (Speedtest by Ookla)"
  printf "%-32s | %10s | %14s | %13s\n" "Server" "Ping (ms)" "Download (Mbps)" "Upload (Mbps)"
  echo "--------------------------------------------------------------------------------"
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    IFS='|' read -r server ping dl ul <<< "$line"
    ping=$(numeric_or_zero "$ping")
    dl=$(numeric_or_zero "$dl")
    ul=$(numeric_or_zero "$ul")
    printf "%-32s | %10.2f | %14.2f | %13.2f\n" "$server" "$ping" "$dl" "$ul"
  done <<< "$data"
}

main() {
  clear
  print_heading "Network Speed (Speedtest by Ookla)"

  if ! command_exists speedtest; then
    echo "[i] speedtest CLI not found. Auto-installing (Ookla repo, Debian/Ubuntu)..."
    if ! command_exists sudo; then
      echo "[!] sudo not available; cannot install speedtest automatically." >&2
      echo "[!] Please install manually:" >&2
      echo "    curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash" >&2
      echo "    sudo apt-get install speedtest" >&2
      exit 1
    fi
    sudo apt-get update -y >/dev/null 2>&1 || true
    sudo apt-get install -y curl >/dev/null 2>&1 || true
    curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash || {
      echo "[!] Failed to add Ookla repo." >&2
      exit 1
    }
    sudo apt-get install -y speedtest || {
      echo "[!] Failed to install speedtest." >&2
      exit 1
    }
    echo "[i] speedtest installed successfully."
  fi

  local st_results
  st_results=$(run_speedtest_batch || true)
  if [[ -n "$st_results" ]]; then
    display_speedtest_results "$st_results"
  else
    echo "[i] Speedtest CLI did not return results."
  fi
}

main "$@"
