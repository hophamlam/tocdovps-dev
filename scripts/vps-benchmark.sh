#!/usr/bin/env bash

##
## Comprehensive VPS benchmark script for tocdovps.dev
## 
## Features:
## - System information (CPU, RAM, Swap, Disk, Load, Uptime, OS, Virtualization)
## - Disk I/O speed test
## - FIO benchmark test (có thể skip bằng SKIP_FIO=1)
## - Network latency (ping) tests
## - Optional result sharing (local/private/shared)
##
## Usage:
##   bash <(curl -fsSL https://tocdovps.dev/install)
##   bash <(curl -fsSL "https://tocdovps.dev/install?mode=shared")
##   SKIP_FIO=1 bash <(curl -fsSL https://tocdovps.dev/install)  # Skip FIO test
##   NETWORK_ONLY=1 bash <(curl -fsSL https://tocdovps.dev/install)  # Chỉ test network
##

set -euo pipefail

# ============================================================================
# TEXT STRINGS (English only)
# ============================================================================

# Helper function to get text (kept for consistency, always returns English)
t() {
  local key="$1"
  case "$key" in
    "heading.title") echo "tocdovps.dev (VPS benchmark)" ;;
    "heading.description") echo "This script runs a comprehensive VPS benchmark." ;;
    "heading.share_note") echo "You can choose to share results with tocdovps.dev or keep them local." ;;
    "system.info") echo "System Information" ;;
    "system.cpu") echo "CPU" ;;
    "system.cores") echo "Cores" ;;
    "system.frequency") echo "Frequency" ;;
    "system.ram") echo "RAM" ;;
    "system.available") echo "Available" ;;
    "system.swap") echo "Swap" ;;
    "system.used") echo "Used" ;;
    "system.disk") echo "Disk" ;;
    "system.load") echo "Load average" ;;
    "system.uptime") echo "Uptime" ;;
    "system.os") echo "OS" ;;
    "system.virtualization") echo "Virtualization" ;;
    "system.provider") echo "Provider" ;;
    "system.date") echo "Date" ;;
    "disk.test") echo "Disk I/O Test" ;;
    "disk.testing") echo "Testing disk write speed (1GB test file, this may take a while)..." ;;
    "disk.write_speed") echo "Write speed" ;;
    "disk.read_speed") echo "Read speed" ;;
    "disk.time") echo "Time" ;;
    "disk.bytes") echo "Bytes written" ;;
    "fio.test") echo "FIO Benchmark Test" ;;
    "fio.testing") echo "Running FIO benchmark (this may take a while)..." ;;
    "fio.not_installed") echo "FIO is not installed. Skipping FIO test." ;;
    "fio.installing") echo "Installing FIO..." ;;
    "fio.install_failed") echo "Failed to install FIO. Skipping FIO test." ;;
    "ioping.test") echo "Ioping Latency" ;;
    "ioping.not_installed") echo "Ioping is not installed. Skipping latency test." ;;
    "share.prompt") echo "How would you like to share this result?" ;;
    "share.local") echo "local   - Keep result local only (no data sent)" ;;
    "share.private") echo "private - Share with tocdovps.dev (only people with URL can view)" ;;
    "share.shared") echo "shared  - Share publicly (everyone can find and view)" ;;
    "share.choose") echo "Choose an option (1/2/3) [default: 1]" ;;
    "share.local_result") echo "[i] Result kept local only. No data was sent." ;;
    "share.sharing") echo "Sharing result with tocdovps.dev (mode: %s)..." ;;
    "share.success") echo "Result shared successfully!" ;;
    "share.view_result") echo "View your result: %s" ;;
    "share.private_note") echo "(This link is private - only people with this URL can view)" ;;
    "share.public_note") echo "(This result is public and can be found in leaderboard)" ;;
    "error.failed_send") echo "[!] Failed to send report. This does not affect local output." ;;
    *) echo "$key" ;;
  esac
}

# ============================================================================
# CONSTANTS
# ============================================================================

DEFAULT_REPORT_URL="https://www.tocdovps.dev/api/benchmark/report"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

# In heading với format đẹp và cân bằng
print_heading() {
  local title="$1"
  echo
  echo "============================================================"
  echo "  $title"
  echo "============================================================"
}

# Kiểm tra command có tồn tại hay không
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Lấy codename Ubuntu (noble/jammy/...)
get_ubuntu_codename() {
  if [[ -r /etc/os-release ]]; then
    grep -E '^VERSION_CODENAME=' /etc/os-release | cut -d= -f2 | tr -d '"' | tr -d "\n"
  elif command_exists lsb_release; then
    lsb_release -cs 2>/dev/null | tr -d "\n"
  else
    echo ""
  fi
}

# Cài đặt speedtest CLI của Ookla với workaround cho Ubuntu 24.04 (noble)
install_speedtest_ookla() {
  if ! command_exists sudo; then
    echo "[!] sudo not available; cannot install speedtest automatically." >&2
    echo "[!] Please install manually: https://www.speedtest.net/apps/cli" >&2
    return 1
  fi

  sudo apt-get update -y >/dev/null 2>&1 || true
  sudo apt-get install -y curl >/dev/null 2>&1 || true

  local codename repo_dist
  codename=$(get_ubuntu_codename)
  repo_dist="$codename"
  # Workaround: noble chưa có repo chính thức, dùng jammy theo hướng dẫn Ookla
  [[ "$codename" == "noble" || -z "$codename" ]] && repo_dist="jammy"

  # shellcheck disable=SC2086
  curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh \
    | sudo os=ubuntu dist="$repo_dist" bash >/dev/null 2>&1 || {
      echo "[!] Failed to add Ookla repo (dist=$repo_dist)." >&2
      return 1
    }

  sudo apt-get install -y speedtest >/dev/null 2>&1 || {
    echo "[!] Failed to install speedtest." >&2
    return 1
  }

  echo "[✓] speedtest installed successfully (dist=$repo_dist)."
  return 0
}

# ============================================================================
# SYSTEM INFORMATION FUNCTIONS
# ============================================================================

# Lấy thông tin CPU
get_cpu_info() {
  local cpu_model cpu_cores cpu_freq
  
  # CPU model (lấy dòng đầu tiên từ /proc/cpuinfo)
  if [[ -r /proc/cpuinfo ]]; then
    cpu_model=$(grep -m1 "^model name" /proc/cpuinfo 2>/dev/null | sed 's/.*: //' || echo "Unknown")
    cpu_cores=$(grep -c "^processor" /proc/cpuinfo 2>/dev/null || echo "1")
    cpu_freq=$(grep -m1 "^cpu MHz" /proc/cpuinfo 2>/dev/null | sed 's/.*: //' | awk '{printf "%.2f", $1/1000}' || echo "0")
  else
    cpu_model="Unknown"
    cpu_cores="1"
    cpu_freq="0"
  fi
  
  echo "$cpu_model|$cpu_cores|$cpu_freq"
}

# Lấy thông tin RAM
get_ram_info() {
  local total_kb available_kb total_gb available_gb
  
  if command_exists free; then
    total_kb=$(free -k | awk '/^Mem:/ {print $2}')
    available_kb=$(free -k | awk '/^Mem:/ {print $7}')
    total_gb=$(awk -v kb="$total_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
    available_gb=$(awk -v kb="$available_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
  else
    total_gb="0"
    available_gb="0"
  fi
  
  echo "$total_gb|$available_gb"
}

# Lấy thông tin OS
get_os_info() {
  local os_name os_version
  
  if [[ -r /etc/os-release ]]; then
    os_name=$(grep "^NAME=" /etc/os-release 2>/dev/null | sed 's/^NAME="\(.*\)"/\1/' | head -1 || echo "Unknown")
    os_version=$(grep "^VERSION=" /etc/os-release 2>/dev/null | sed 's/^VERSION="\(.*\)"/\1/' | head -1 || echo "Unknown")
  else
    os_name=$(uname -s 2>/dev/null || echo "Unknown")
    os_version=$(uname -r 2>/dev/null || echo "Unknown")
  fi
  
  echo "$os_name|$os_version"
}

# Lấy thông tin Swap
get_swap_info() {
  local total_kb used_kb total_gb used_gb
  
  if command_exists free; then
    total_kb=$(free -k | awk '/^Swap:/ {print $2}')
    used_kb=$(free -k | awk '/^Swap:/ {print $3}')
    total_gb=$(awk -v kb="$total_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
    used_gb=$(awk -v kb="$used_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
  else
    total_gb="0"
    used_gb="0"
  fi
  
  echo "$total_gb|$used_gb"
}

# Lấy system uptime
get_uptime() {
  local uptime_seconds uptime_days uptime_hours uptime_minutes uptime_str
  
  if [[ -r /proc/uptime ]]; then
    uptime_seconds=$(awk '{print int($1)}' /proc/uptime 2>/dev/null || echo "0")
    
    if [[ "$uptime_seconds" -ge 86400 ]]; then
      uptime_days=$((uptime_seconds / 86400))
      uptime_hours=$(((uptime_seconds % 86400) / 3600))
      local day_suffix=""
      local hour_suffix=""
      [[ $uptime_days -ne 1 ]] && day_suffix="s"
      [[ $uptime_hours -ne 1 ]] && hour_suffix="s"
      uptime_str="${uptime_days} day${day_suffix}, ${uptime_hours} hour${hour_suffix}"
    elif [[ "$uptime_seconds" -ge 3600 ]]; then
      uptime_hours=$((uptime_seconds / 3600))
      uptime_minutes=$(((uptime_seconds % 3600) / 60))
      local hour_suffix=""
      local minute_suffix=""
      [[ $uptime_hours -ne 1 ]] && hour_suffix="s"
      [[ $uptime_minutes -ne 1 ]] && minute_suffix="s"
      uptime_str="${uptime_hours} hour${hour_suffix}, ${uptime_minutes} minute${minute_suffix}"
    else
      uptime_minutes=$((uptime_seconds / 60))
      local minute_suffix=""
      [[ $uptime_minutes -ne 1 ]] && minute_suffix="s"
      uptime_str="${uptime_minutes} minute${minute_suffix}"
    fi
  else
    uptime_str="Unknown"
  fi
  
  echo "$uptime_str"
}

# Lấy thông tin Disk
get_disk_info() {
  local total_kb used_kb available_kb total_gb used_gb available_gb
  
  if command_exists df; then
    # Lấy thông tin từ root filesystem (/)
    total_kb=$(df -k / 2>/dev/null | awk 'NR==2 {print $2}' || echo "0")
    used_kb=$(df -k / 2>/dev/null | awk 'NR==2 {print $3}' || echo "0")
    available_kb=$(df -k / 2>/dev/null | awk 'NR==2 {print $4}' || echo "0")
    
    total_gb=$(awk -v kb="$total_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
    used_gb=$(awk -v kb="$used_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
    available_gb=$(awk -v kb="$available_kb" 'BEGIN { printf "%.2f", kb / 1048576 }')
  else
    total_gb="0"
    used_gb="0"
    available_gb="0"
  fi
  
  echo "$total_gb|$used_gb|$available_gb"
}

# Lấy load average
get_load_average() {
  local load_1min load_5min load_15min
  
  if [[ -r /proc/loadavg ]]; then
    read -r load_1min load_5min load_15min _ < /proc/loadavg 2>/dev/null || {
      load_1min="0.00"
      load_5min="0.00"
      load_15min="0.00"
    }
  else
    load_1min="0.00"
    load_5min="0.00"
    load_15min="0.00"
  fi
  
  echo "$load_1min|$load_5min|$load_15min"
}

# Detect provider/datacenter from IP geolocation
detect_provider() {
  local provider="Unknown"
  
  # Try to get public IP
  local public_ip
  if command_exists curl; then
    public_ip=$(curl -s --max-time 3 https://api.ipify.org 2>/dev/null || echo "")
  elif command_exists wget; then
    public_ip=$(wget -qO- --timeout=3 https://api.ipify.org 2>/dev/null || echo "")
  fi
  
  if [[ -n "$public_ip" ]]; then
    # Try to get provider info from ipinfo.io
    if command_exists curl; then
      local org_info
      org_info=$(curl -s --max-time 3 "https://ipinfo.io/${public_ip}/org" 2>/dev/null || echo "")
      if [[ -n "$org_info" ]]; then
        # Extract provider name (e.g., "AS12345 Leaseweb Asia")
        provider=$(echo "$org_info" | sed 's/^AS[0-9]* //' | head -1)
        [[ -z "$provider" ]] && provider="Unknown"
        # Normalize provider name từ legal name sang brand name
        provider=$(normalize_provider_name "$provider")
      fi
    fi
  fi
  
  echo "$provider"
}

# Detect virtualization type (trả về original|normalized)
detect_virtualization() {
  local virt_original="Bare Metal"
  local virt_normalized="Bare Metal"
  
  # Ưu tiên systemd-detect-virt (chính xác nhất)
  if command_exists systemd-detect-virt; then
    local detected
    detected=$(systemd-detect-virt 2>/dev/null || echo "")
    if [[ -n "$detected" ]] && [[ "$detected" != "none" ]]; then
      virt_original=$(echo "$detected" | tr '[:lower:]' '[:upper:]')
      virt_normalized="$virt_original"
      # Normalize một số tên
      case "$virt_normalized" in
        "QEMU") virt_normalized="KVM" ;;  # QEMU thường là KVM trên VPS
        "MICROSOFT") virt_normalized="Hyper-V" ;;
      esac
      echo "${virt_original}|${virt_normalized}"
      return 0
    fi
  fi
  
  # Fallback: Kiểm tra /sys/class/dmi/id/product_name
  if [[ -r /sys/class/dmi/id/product_name ]]; then
    local product=$(cat /sys/class/dmi/id/product_name 2>/dev/null | tr '[:upper:]' '[:lower:]')
    case "$product" in
      *vmware*)
        virt_original="VMWARE"
        virt_normalized="VMWARE"
        ;;
      *virtualbox*)
        virt_original="VirtualBox"
        virt_normalized="VirtualBox"
        ;;
      *kvm*)
        virt_original="KVM"
        virt_normalized="KVM"
        ;;
      *qemu*)
        virt_original="QEMU"
        virt_normalized="KVM"  # QEMU thường là KVM trên VPS
        ;;
      *xen*)
        virt_original="XEN"
        virt_normalized="XEN"
        ;;
      *microsoft*)
        virt_original="MICROSOFT"
        virt_normalized="Hyper-V"
        ;;
    esac
  fi
  
  # Kiểm tra /proc/cpuinfo cho hypervisor flag
  if grep -q "hypervisor" /proc/cpuinfo 2>/dev/null; then
    if [[ "$virt_original" == "Bare Metal" ]]; then
      virt_original="Virtualized"
      virt_normalized="Virtualized"
    fi
  fi
  
  echo "${virt_original}|${virt_normalized}"
}

# Normalize provider name từ legal name sang brand name
normalize_provider_name() {
  local provider="$1"
  local normalized="$provider"
  
  # Map các legal names sang brand names phổ biến
  case "$provider" in
    *"Constant Company"*|*"Vultr"*)
      normalized="Vultr"
      ;;
    *"DigitalOcean"*|*"Digital Ocean"*)
      normalized="DigitalOcean"
      ;;
    *"Amazon"*|*"AWS"*)
      normalized="Amazon Web Services"
      ;;
    *"Google"*|*"GCP"*)
      normalized="Google Cloud Platform"
      ;;
    *"Microsoft"*|*"Azure"*)
      normalized="Microsoft Azure"
      ;;
    *"Linode"*|*"Akamai"*)
      normalized="Akamai (Linode)"
      ;;
    *"Hetzner"*)
      normalized="Hetzner"
      ;;
    *"OVH"*)
      normalized="OVHcloud"
      ;;
    *"Contabo"*)
      normalized="Contabo"
      ;;
    *"Oracle"*)
      normalized="Oracle Cloud"
      ;;
  esac
  
  echo "$normalized"
}

# Detect provider/datacenter và location từ IP geolocation
# Trả về: provider_original|provider_normalized|city|region|country|loc|public_ip
detect_geo() {
  local provider_original="Unknown" provider_normalized="Unknown"
  local city="Unknown" region="Unknown" country="Unknown" loc="" public_ip=""
  
  # Try to get public IP
  if command_exists curl; then
    public_ip=$(curl -s --max-time 3 https://api.ipify.org 2>/dev/null || echo "")
  elif command_exists wget; then
    public_ip=$(wget -qO- --timeout=3 https://api.ipify.org 2>/dev/null || echo "")
  fi
  
  if [[ -n "$public_ip" ]]; then
    # Try to get provider/location info from ipinfo.io
    if command_exists curl; then
      local geo_json
      geo_json=$(curl -s --max-time 3 "https://ipinfo.io/${public_ip}/json" 2>/dev/null || echo "")
      if [[ -n "$geo_json" ]]; then
        provider_original=$(echo "$geo_json" | grep -oP '"org":\s*"\K[^"]+' | sed 's/^AS[0-9]* //' | head -1 || echo "Unknown")
        city=$(echo "$geo_json" | grep -oP '"city":\s*"\K[^"]+' | head -1 || echo "Unknown")
        region=$(echo "$geo_json" | grep -oP '"region":\s*"\K[^"]+' | head -1 || echo "Unknown")
        country=$(echo "$geo_json" | grep -oP '"country":\s*"\K[^"]+' | head -1 || echo "Unknown")
        loc=$(echo "$geo_json" | grep -oP '"loc":\s*"\K[^"]+' | head -1 || echo "")
        [[ -z "$provider_original" ]] && provider_original="Unknown"
        # Normalize provider name từ legal name sang brand name
        provider_normalized=$(normalize_provider_name "$provider_original")
      fi
    fi
  fi
  
  echo "${provider_original}|${provider_normalized}|$city|$region|$country|$loc|$public_ip"
}

# Test disk I/O (write and read test with 3 rounds)
run_disk_io_test() {
  local test_file="/tmp/tocdovps_io_test_$$"
  local write_rounds=()
  local read_rounds=()
  local write_speed_mbps="0"
  local write_speed_mbs="0"
  local read_speed_mbps="0"
  local read_speed_mbs="0"
  local elapsed_time="0"
  local bytes_written="1073741824"  # 1GB (best practice: larger than cache)
  
  if ! command_exists dd; then
    echo "0|0|0|0|0|0|0|0|0|0|0|0|0|0"
    return 0
  fi
  
  # Test write speed - 3 rounds
  for round in 1 2 3; do
    local start_time end_time round_time round_speed_mbs
    start_time=$(date +%s.%N)
    
    # Thử direct I/O trước (bypass cache), nếu fail thì fallback về normal I/O
    if dd if=/dev/zero of="${test_file}_${round}" bs=1M count=1024 oflag=direct >/dev/null 2>&1; then
      end_time=$(date +%s.%N)
      round_time=$(awk -v start="$start_time" -v end="$end_time" 'BEGIN { printf "%.2f", end - start }')
      
      if (( $(echo "$round_time > 0" | bc -l 2>/dev/null || echo 0) )); then
        round_speed_mbs=$(awk -v bytes="$bytes_written" -v time="$round_time" 'BEGIN { printf "%.2f", (bytes / 1048576) / time }')
        write_rounds+=("$round_speed_mbs")
      else
        write_rounds+=("0")
      fi
    else
      # Fallback: normal I/O (không bypass cache)
      start_time=$(date +%s.%N)
      if dd if=/dev/zero of="${test_file}_${round}" bs=1M count=1024 >/dev/null 2>&1; then
        end_time=$(date +%s.%N)
        round_time=$(awk -v start="$start_time" -v end="$end_time" 'BEGIN { printf "%.2f", end - start }')
        
        if (( $(echo "$round_time > 0" | bc -l 2>/dev/null || echo 0) )); then
          round_speed_mbs=$(awk -v bytes="$bytes_written" -v time="$round_time" 'BEGIN { printf "%.2f", (bytes / 1048576) / time }')
          write_rounds+=("$round_speed_mbs")
        else
          write_rounds+=("0")
        fi
      else
        write_rounds+=("0")
      fi
    fi
    
    # Clean up test file for this round
    rm -f "${test_file}_${round}" 2>/dev/null
  done
  
  # Test read speed - 3 rounds (need to create file first)
  local read_test_file="${test_file}_read"
  # Thử tạo file với direct I/O, nếu fail thì fallback
  if ! dd if=/dev/zero of="$read_test_file" bs=1M count=1024 oflag=direct >/dev/null 2>&1; then
    # Fallback: normal I/O
    dd if=/dev/zero of="$read_test_file" bs=1M count=1024 >/dev/null 2>&1 || {
      read_rounds=("0" "0" "0")
      echo "0|0|0|0|0|0|0|0|0|0|0|0|0|0"
      return 0
    }
  fi
  
  if [[ -f "$read_test_file" ]]; then
    for round in 1 2 3; do
      local start_time end_time round_time round_speed_mbs
      start_time=$(date +%s.%N)
      
      # Thử direct I/O trước, nếu fail thì fallback
      if dd if="$read_test_file" of=/dev/null bs=1M count=1024 iflag=direct >/dev/null 2>&1; then
        end_time=$(date +%s.%N)
        round_time=$(awk -v start="$start_time" -v end="$end_time" 'BEGIN { printf "%.2f", end - start }')
        
        if (( $(echo "$round_time > 0" | bc -l 2>/dev/null || echo 0) )); then
          round_speed_mbs=$(awk -v bytes="$bytes_written" -v time="$round_time" 'BEGIN { printf "%.2f", (bytes / 1048576) / time }')
          read_rounds+=("$round_speed_mbs")
        else
          read_rounds+=("0")
        fi
      else
        # Fallback: normal I/O
        start_time=$(date +%s.%N)
        if dd if="$read_test_file" of=/dev/null bs=1M count=1024 >/dev/null 2>&1; then
          end_time=$(date +%s.%N)
          round_time=$(awk -v start="$start_time" -v end="$end_time" 'BEGIN { printf "%.2f", end - start }')
          
          if (( $(echo "$round_time > 0" | bc -l 2>/dev/null || echo 0) )); then
            round_speed_mbs=$(awk -v bytes="$bytes_written" -v time="$round_time" 'BEGIN { printf "%.2f", (bytes / 1048576) / time }')
            read_rounds+=("$round_speed_mbs")
          else
            read_rounds+=("0")
          fi
        else
          read_rounds+=("0")
        fi
      fi
    done
    
    rm -f "$read_test_file" 2>/dev/null
  else
    read_rounds=("0" "0" "0")
  fi
  
  # Calculate averages
  local write_sum=0 read_sum=0 write_count=0 read_count=0
  
  for speed in "${write_rounds[@]}"; do
    if (( $(echo "$speed > 0" | bc -l 2>/dev/null || echo 0) )); then
      write_sum=$(awk -v sum="$write_sum" -v val="$speed" 'BEGIN { printf "%.2f", sum + val }')
      write_count=$((write_count + 1))
    fi
  done
  
  for speed in "${read_rounds[@]}"; do
    if (( $(echo "$speed > 0" | bc -l 2>/dev/null || echo 0) )); then
      read_sum=$(awk -v sum="$read_sum" -v val="$speed" 'BEGIN { printf "%.2f", sum + val }')
      read_count=$((read_count + 1))
    fi
  done
  
  if [[ $write_count -gt 0 ]]; then
    write_speed_mbs=$(awk -v sum="$write_sum" -v count="$write_count" 'BEGIN { printf "%.2f", sum / count }')
    write_speed_mbps=$(awk -v mbs="$write_speed_mbs" 'BEGIN { printf "%.2f", mbs * 8 }')
  fi
  
  if [[ $read_count -gt 0 ]]; then
    read_speed_mbs=$(awk -v sum="$read_sum" -v count="$read_count" 'BEGIN { printf "%.2f", sum / count }')
    read_speed_mbps=$(awk -v mbs="$read_speed_mbs" 'BEGIN { printf "%.2f", mbs * 8 }')
  fi
  
  # Trả về: write_round1|write_round2|write_round3|write_avg|read_round1|read_round2|read_round3|read_avg|write_mbps|write_mbs|read_mbps|read_mbs|elapsed_time|bytes_written
  echo "${write_rounds[0]:-0}|${write_rounds[1]:-0}|${write_rounds[2]:-0}|${write_speed_mbs}|${read_rounds[0]:-0}|${read_rounds[1]:-0}|${read_rounds[2]:-0}|${read_speed_mbs}|${write_speed_mbps}|${write_speed_mbs}|${read_speed_mbps}|${read_speed_mbs}|0|${bytes_written}"
}

# Check và install FIO nếu cần (optional)
check_and_install_fio() {
  if command_exists fio; then
    return 0
  fi
  
  # Thử install fio nếu có quyền
  if [[ $EUID -eq 0 ]] || command_exists sudo; then
    echo "$(t 'fio.installing')"
    if command_exists apt-get; then
      (sudo apt-get update >/dev/null 2>&1 && sudo apt-get install -y fio >/dev/null 2>&1) || return 1
    elif command_exists yum; then
      (sudo yum install -y fio >/dev/null 2>&1) || return 1
    elif command_exists dnf; then
      (sudo dnf install -y fio >/dev/null 2>&1) || return 1
    elif command_exists pacman; then
      (sudo pacman -Sy --noconfirm fio >/dev/null 2>&1) || return 1
    else
      return 1
    fi
    return 0
  fi
  
  return 1
}

# Check và install các packages cần thiết ngay từ đầu
check_and_install_required_packages() {
  local packages_to_install=()
  local needs_sudo=false
  
  # Check sudo availability
  if [[ $EUID -ne 0 ]] && ! command_exists sudo; then
    echo "[!] sudo not available. Some packages may not be installed automatically." >&2
    echo "[!] Please install manually: fio, speedtest (Ookla)" >&2
    echo "[!] See documentation: https://tocdovps.dev/docs" >&2
    return 1
  fi
  
  # Check FIO
  if ! command_exists fio; then
    packages_to_install+=("fio")
  fi
  
  # Check speedtest
  if ! command_exists speedtest; then
    packages_to_install+=("speedtest")
  fi
  
  # Nếu không có package nào cần install, return
  if [[ ${#packages_to_install[@]} -eq 0 ]]; then
    return 0
  fi
  
  # Thông báo packages sẽ được install
  echo
  echo "[i] The following packages will be installed automatically:"
  for pkg in "${packages_to_install[@]}"; do
    echo "    - $pkg"
  done
  echo "[i] For more information, see: https://tocdovps.dev/docs"
  echo
  
  # Install packages
  local install_cmd=""
  if command_exists apt-get; then
    install_cmd="apt-get"
    sudo apt-get update -y >/dev/null 2>&1 || true
  elif command_exists yum; then
    install_cmd="yum"
  elif command_exists dnf; then
    install_cmd="dnf"
  elif command_exists pacman; then
    install_cmd="pacman"
  else
    echo "[!] Unsupported package manager. Please install manually." >&2
    return 1
  fi
  
  # Install FIO
  if [[ " ${packages_to_install[*]} " =~ " fio " ]]; then
    echo "[i] Installing fio..."
    if [[ "$install_cmd" == "apt-get" ]]; then
      sudo apt-get install -y fio >/dev/null 2>&1 || {
        echo "[!] Failed to install fio." >&2
        return 1
      }
    elif [[ "$install_cmd" == "yum" ]]; then
      sudo yum install -y fio >/dev/null 2>&1 || {
        echo "[!] Failed to install fio." >&2
        return 1
      }
    elif [[ "$install_cmd" == "dnf" ]]; then
      sudo dnf install -y fio >/dev/null 2>&1 || {
        echo "[!] Failed to install fio." >&2
        return 1
      }
    elif [[ "$install_cmd" == "pacman" ]]; then
      sudo pacman -Sy --noconfirm fio >/dev/null 2>&1 || {
        echo "[!] Failed to install fio." >&2
        return 1
      }
    fi
    echo "[✓] fio installed successfully."
  fi
  
  # Install speedtest (chỉ cho Debian/Ubuntu)
  if [[ " ${packages_to_install[*]} " =~ " speedtest " ]]; then
    if [[ "$install_cmd" == "apt-get" ]]; then
      echo "[i] Installing speedtest (Ookla)..."
      if ! install_speedtest_ookla; then
        echo "[!] Failed to install speedtest." >&2
        return 1
      fi
    else
      echo "[!] speedtest auto-install only supports Debian/Ubuntu." >&2
      echo "[!] Please install manually: https://www.speedtest.net/apps/cli" >&2
    fi
  fi
  
  return 0
}

# Chạy FIO test với một block size cụ thể
run_fio_test_block() {
  local block_size="$1"  # 4k, 64k, 512k, 1M
  local test_file="/tmp/tocdovps_fio_test_${block_size}_$$"
  local fio_output
  
  # Tạo file test trước (cần cho read test)
  # Tăng file size lên 500MB để tránh cache effects (best practice)
  dd if=/dev/zero of="$test_file" bs=1M count=500 oflag=direct >/dev/null 2>&1
  
  # Tạo FIO job file cho write test
  local fio_job_write="/tmp/tocdovps_fio_job_write_${block_size}_$$.ini"
  cat > "$fio_job_write" <<EOF
[global]
ioengine=libaio
direct=1
runtime=30
time_based
group_reporting
filename=${test_file}
size=500M
iodepth=16
numjobs=1

[write]
name=write-test
rw=write
bs=${block_size}
EOF
  
  # Tạo FIO job file cho read test
  local fio_job_read="/tmp/tocdovps_fio_job_read_${block_size}_$$.ini"
  cat > "$fio_job_read" <<EOF
[global]
ioengine=libaio
direct=1
runtime=30
time_based
group_reporting
filename=${test_file}
size=500M
iodepth=16
numjobs=1

[read]
name=read-test
rw=read
bs=${block_size}
EOF
  
  # Chạy FIO write test
  local fio_output_write
  if fio --help 2>&1 | grep -q "output-format"; then
    fio_output_write=$(fio --output-format=json "$fio_job_write" 2>/dev/null || echo "")
  else
    fio_output_write=$(fio "$fio_job_write" 2>/dev/null || echo "")
  fi
  
  # Chạy FIO read test (file đã có data từ write test)
  local fio_output_read
  if fio --help 2>&1 | grep -q "output-format"; then
    fio_output_read=$(fio --output-format=json "$fio_job_read" 2>/dev/null || echo "")
  else
    fio_output_read=$(fio "$fio_job_read" 2>/dev/null || echo "")
  fi
  
  rm -f "$fio_job_write" "$fio_job_read" "$test_file" 2>/dev/null
  
  # Kiểm tra output có hợp lệ không
  if [[ -z "$fio_output_write" ]] && [[ -z "$fio_output_read" ]]; then
    echo "0|0|0|0|0|0|0"
    return 0
  fi
  
  # Parse output (hỗ trợ cả JSON và text)
  local read_bw write_bw read_iops write_iops total_bw total_iops
  
  # Parse write output
  if echo "$fio_output_write" | grep -q "^{"; then
    if command_exists jq; then
      write_bw=$(echo "$fio_output_write" | jq -r '.jobs[] | select(.jobname=="write-test") | .write.bw // 0' 2>/dev/null || echo "0")
      write_iops=$(echo "$fio_output_write" | jq -r '.jobs[] | select(.jobname=="write-test") | .write.iops // 0' 2>/dev/null || echo "0")
    else
      # Parse JSON thủ công
      write_bw=$(echo "$fio_output_write" | grep -oP '"write".*?"bw":\s*\K[0-9]+' | head -1 || echo "0")
      write_iops=$(echo "$fio_output_write" | grep -oP '"write".*?"iops":\s*\K[0-9.]+' | head -1 || echo "0")
    fi
  else
    # Parse text output
    write_bw=$(echo "$fio_output_write" | grep -i "write:" | grep -oP "bw=\K[0-9.]+" | head -1 || echo "0")
    write_iops=$(echo "$fio_output_write" | grep -i "write:" | grep -oP "iops=\K[0-9.]+" | head -1 || echo "0")
  fi
  
  # Parse read output
  if echo "$fio_output_read" | grep -q "^{"; then
    if command_exists jq; then
      read_bw=$(echo "$fio_output_read" | jq -r '.jobs[] | select(.jobname=="read-test") | .read.bw // 0' 2>/dev/null || echo "0")
      read_iops=$(echo "$fio_output_read" | jq -r '.jobs[] | select(.jobname=="read-test") | .read.iops // 0' 2>/dev/null || echo "0")
    else
      # Parse JSON thủ công
      read_bw=$(echo "$fio_output_read" | grep -oP '"read".*?"bw":\s*\K[0-9]+' | head -1 || echo "0")
      read_iops=$(echo "$fio_output_read" | grep -oP '"read".*?"iops":\s*\K[0-9.]+' | head -1 || echo "0")
    fi
  else
    # Parse text output
    read_bw=$(echo "$fio_output_read" | grep -i "read:" | grep -oP "bw=\K[0-9.]+" | head -1 || echo "0")
    read_iops=$(echo "$fio_output_read" | grep -i "read:" | grep -oP "iops=\K[0-9.]+" | head -1 || echo "0")
  fi
  
  # FIO trả về bandwidth bằng KB/s, convert sang MB/s
  read_bw=$(awk -v kb="${read_bw:-0}" 'BEGIN { printf "%.2f", kb / 1024 }')
  write_bw=$(awk -v kb="${write_bw:-0}" 'BEGIN { printf "%.2f", kb / 1024 }')
  total_bw=$(awk -v r="$read_bw" -v w="$write_bw" 'BEGIN { printf "%.2f", r + w }')
  
  # IOPS đã là số thực, chỉ cần format
  read_iops=$(awk -v iops="${read_iops:-0}" 'BEGIN { printf "%.0f", iops }')
  write_iops=$(awk -v iops="${write_iops:-0}" 'BEGIN { printf "%.0f", iops }')
  total_iops=$(awk -v r="$read_iops" -v w="$write_iops" 'BEGIN { printf "%.0f", r + w }')
  
  echo "${total_bw}|${read_bw}|${write_bw}|${total_iops}|${read_iops}|${write_iops}"
}

# Chạy FIO benchmark test với tất cả block sizes
run_fio_test() {
  if ! command_exists fio; then
    if ! check_and_install_fio; then
      echo ""
      return 1
    fi
  fi
  
  local test_file="/tmp/tocdovps_fio_test_$$"
  local block_sizes=("4k" "64k" "512k" "1M")
  local results=()
  local total_blocks=${#block_sizes[@]}
  local idx=0
  local start_time=$(date +%s)
  
  for bs in "${block_sizes[@]}"; do
    idx=$((idx + 1))
    local elapsed=$(( $(date +%s) - start_time ))
    local em=$(( elapsed / 60 ))
    local es=$(( elapsed % 60 ))
    printf "[i] FIO %d/%d: %s (elapsed: %dm %ds)\r" "$idx" "$total_blocks" "$bs" "$em" "$es" >&2
    local result
    result=$(run_fio_test_block "$bs")
    results+=("$bs|$result")
  done

  # clear progress line
  printf "\r%*s\r" 80 "" >&2
  
  # Trả về tất cả results: block_size|total_mbs|read_mbs|write_mbs|total_iops|read_iops|write_iops
  # Format: 4k|total|read|write|iops|iops_read|iops_write|64k|...|1M|...
  local output=""
  for result in "${results[@]}"; do
    [[ -n "$output" ]] && output="${output}|"
    output="${output}${result}"
  done
  
  echo "$output"
  return 0
}

# Chạy ioping latency test
run_ioping_test() {
  if ! command_exists ioping; then
    return 1
  fi
  
  local test_file="/tmp/tocdovps_ioping_test_$$"
  local latency_us
  
  # Tạo test file
  dd if=/dev/zero of="$test_file" bs=1M count=10 >/dev/null 2>&1
  
  # Chạy ioping với 10 requests
  local ioping_output
  ioping_output=$(ioping -c 10 "$test_file" 2>/dev/null | grep -i "avg" | grep -oP "[0-9.]+[a-z]+" | head -1 || echo "")
  
  rm -f "$test_file" 2>/dev/null
  
  if [[ -n "$ioping_output" ]]; then
    # Convert latency sang microseconds nếu cần
    if echo "$ioping_output" | grep -qi "ms"; then
      latency_us=$(echo "$ioping_output" | grep -oP "[0-9.]+" | head -1)
      latency_us=$(awk -v ms="$latency_us" 'BEGIN { printf "%.1f", ms * 1000 }')
    elif echo "$ioping_output" | grep -qi "us"; then
      latency_us=$(echo "$ioping_output" | grep -oP "[0-9.]+" | head -1)
    else
      latency_us="0"
    fi
    echo "$latency_us"
  else
    echo "0"
  fi
  
  return 0
}

# ============================================================================
# NETWORK SPEED TEST (Speedtest by Ookla)
# ============================================================================

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

  # Normalize values
  ping_ms=$(awk -v v="${ping_ms:-0}" 'BEGIN { printf "%.2f", v }')
  dl_mbps=$(awk -v v="${dl_mbps:-0}" 'BEGIN { printf "%.2f", v }')
  ul_mbps=$(awk -v v="${ul_mbps:-0}" 'BEGIN { printf "%.2f", v }')

  if (( $(echo "$ping_ms == 0 && $dl_mbps == 0 && $ul_mbps == 0" | bc -l 2>/dev/null || echo 1) )); then
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
  local total_servers=${#SPEEDTEST_SERVER_IDS[@]}
  local current=0
  local start_time=$(date +%s)

  for sid in "${SPEEDTEST_SERVER_IDS[@]}"; do
    [[ -z "$sid" ]] && continue
    current=$((current + 1))
    local label="${SPEEDTEST_LABELS[$sid]:-ServerID $sid}"
    
    # Hiển thị progress trên stderr để không làm lệch output chính
    local elapsed=$(( $(date +%s) - start_time ))
    local elapsed_min=$(( elapsed / 60 ))
    local elapsed_sec=$(( elapsed % 60 ))
    printf "[%d/%d] Testing: %s (elapsed: %dm %ds)\r" "$current" "$total_servers" "$label" "$elapsed_min" "$elapsed_sec" >&2
    
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

  # Clear progress line
  printf "\r%*s\r" 80 "" >&2

  if [[ "$any_success" == "false" ]]; then
    echo ""
    return 1
  fi

  printf "%s\n" "${results[@]}"
}

# Hiển thị bảng network speed test results
display_speedtest_results() {
  local data="$1"
  printf "%-32s | %10s | %14s | %13s\n" "Server" "Ping (ms)" "Download (Mbps)" "Upload (Mbps)"
  echo "--------------------------------------------------------------------------------"
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    IFS='|' read -r server ping dl ul <<< "$line"
    ping=$(awk -v v="${ping:-0}" 'BEGIN { printf "%.2f", v }')
    dl=$(awk -v v="${dl:-0}" 'BEGIN { printf "%.2f", v }')
    ul=$(awk -v v="${ul:-0}" 'BEGIN { printf "%.2f", v }')
    printf "%-32s | %10.2f | %14.2f | %13.2f\n" "$server" "$ping" "$dl" "$ul"
  done <<< "$data"
}

# Check và install speedtest nếu cần
check_and_install_speedtest() {
  if command_exists speedtest; then
    return 0
  fi
  
  echo "[i] speedtest CLI not found. Auto-installing (Ookla repo, Debian/Ubuntu)..."
  if ! install_speedtest_ookla; then
    echo "[!] Please install manually:" >&2
    echo "    curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash" >&2
    echo "    sudo apt-get install speedtest" >&2
    return 1
  fi
  
  echo "[i] speedtest installed successfully."
  return 0
}

# ============================================================================
# API REPORTING FUNCTIONS
# ============================================================================

# Gửi JSON report tới API
send_report_if_configured() {
  local json_payload="$1"
  local visibility="${2:-shared}"

  # Ưu tiên REPORT_URL từ env (dev / override), nếu không thì dùng DEFAULT_REPORT_URL
  local report_url="${REPORT_URL:-$DEFAULT_REPORT_URL}"

  if ! command_exists curl; then
    echo
    echo "[i] curl is not available. Skipping remote report."
    return 0
  fi

  echo
  echo "[i] Sending benchmark report to API..."

  # Gửi JSON payload kèm header X-VISIBILITY (không cần token nữa)
  local response http_code
  response=$(curl -s -w "\n%{http_code}" -X POST "$report_url" \
    -H "Content-Type: application/json" \
    -H "X-VISIBILITY: $visibility" \
    -d "$json_payload" 2>&1)
  
  # Tách HTTP code từ response (dòng cuối cùng)
  http_code=$(echo "$response" | tail -n1)
  response=$(echo "$response" | sed '$d')
  
  # Debug: hiển thị response nếu có lỗi
  if [[ "$http_code" -ge 200 ]] && [[ "$http_code" -lt 300 ]]; then
    # Parse response để lấy result URL nếu có
    local result_id result_url
    result_id=$(echo "$response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 || echo "")
    if [[ -n "$result_id" ]]; then
      result_url="${report_url%/api/benchmark/report}/result/$result_id"
      echo
      echo "[✓] $(t 'share.success')"
      if [[ "$visibility" == "private" ]]; then
        printf "    $(t 'share.view_result')\n" "$result_url"
        echo "    $(t 'share.private_note')"
      elif [[ "$visibility" == "shared" ]]; then
        printf "    $(t 'share.view_result')\n" "$result_url"
        echo "    $(t 'share.public_note')"
      fi
    else
      echo
      echo "[✓] $(t 'share.success')"
    fi
  else
    echo
    echo "[!] $(t 'error.failed_send')"
    echo "    HTTP Status: $http_code"
    echo "    Response: $response"
    # Debug: hiển thị payload snippet nếu có lỗi validation
    if [[ "$http_code" -eq 400 ]]; then
      echo "    [Debug] Payload preview (first 500 chars):"
      echo "$json_payload" | head -c 500
      echo ""
    fi
  fi
}

# ============================================================================
# MAIN FUNCTION
# ============================================================================

# Hàm main: chạy toàn bộ benchmark
main() {
  # Parse command line arguments và query params từ URL
  # Nếu script được tải với query params, chúng sẽ được set trong env vars
  # Hoặc có thể truyền trực tiếp: bash script.sh --mode=shared --lang=en
  
  local mode_from_arg=""
  local lang_from_arg=""
  for arg in "$@"; do
    case "$arg" in
      --mode=*)
        mode_from_arg="${arg#*=}"
        export BENCHMARK_MODE="$mode_from_arg"
        ;;
      --mode)
        echo "[!] --mode requires a value. Use --mode=local|private|shared"
        ;;
    esac
  done
  
  # Query params from URL will be set in env vars by installer script
  clear
  print_heading "$(t 'heading.title')"
  echo "[i] Estimated runtime ~15 minutes (disk, FIO, speedtest). Please wait..."
  echo "[i] By continuing, you agree to share non-sensitive machine metrics (CPU/RAM/Disk/Network benchmarks). No commercial use of your data. Proceed?"
  
  # Check and install required packages ngay từ đầu
  check_and_install_required_packages || true

  # Xác định sharing mode từ query parameter hoặc prompt (hỏi ngay từ đầu)
  local sharing_mode="${BENCHMARK_MODE:-}"
  
  if [[ -z "$sharing_mode" ]]; then
    echo
    echo "Share results? (default after 8s: private)"
    echo "  1) local   - Keep local only"
    echo "  2) private - Share with private URL"
    echo "  3) shared  - Share publicly"
    echo
    echo "Auto-selecting 'private' in 8s..."
    read -t 8 -r -p "Choose (1/2/3) [default: 2]: " answer || true
    
    case "${answer:-2}" in
      1|local)
        sharing_mode="local"
        ;;
      2|private)
        sharing_mode="private"
        ;;
      3|shared)
        sharing_mode="shared"
        ;;
      *)
        sharing_mode="local"
        ;;
    esac
  fi
  
  # Validate mode
  case "$sharing_mode" in
    local|private|shared)
      ;;
    *)
      sharing_mode="local"
      ;;
  esac

  # Kiểm tra command cần thiết cho disk I/O test
  if ! command_exists dd; then
    echo "[!] 'dd' command is required for disk I/O test but not found."
    echo "    Disk I/O test will be skipped."
  fi

  print_heading "1. $(t 'system.info')"
  
  # CPU Info
  local cpu_info cpu_model cpu_cores cpu_freq
  cpu_info=$(get_cpu_info)
  IFS='|' read -r cpu_model cpu_cores cpu_freq <<< "$cpu_info"
  printf "%-18s : %s\n" "$(t 'system.cpu')" "$cpu_model"
  printf "%-18s : %s\n" "$(t 'system.cores')" "$cpu_cores"
  printf "%-18s : %.2f GHz\n" "$(t 'system.frequency')" "$cpu_freq"
  
  # RAM Info
  local ram_info ram_total ram_available
  ram_info=$(get_ram_info)
  IFS='|' read -r ram_total ram_available <<< "$ram_info"
  printf "%-18s : %.2f GB ($(t 'system.available'): %.2f GB)\n" "$(t 'system.ram')" "$ram_total" "$ram_available"
  
  # Swap Info
  local swap_info swap_total swap_used
  swap_info=$(get_swap_info)
  IFS='|' read -r swap_total swap_used <<< "$swap_info"
  printf "%-18s : %.2f GB ($(t 'system.used'): %.2f GB)\n" "$(t 'system.swap')" "$swap_total" "$swap_used"
  
  # Disk Info
  local disk_info disk_total disk_used disk_available
  disk_info=$(get_disk_info)
  IFS='|' read -r disk_total disk_used disk_available <<< "$disk_info"
  printf "%-18s : %.2f GB ($(t 'system.used'): %.2f GB, $(t 'system.available'): %.2f GB)\n" "$(t 'system.disk')" "$disk_total" "$disk_used" "$disk_available"
  
  # Load Average
  local load_info load_1min load_5min load_15min
  load_info=$(get_load_average)
  IFS='|' read -r load_1min load_5min load_15min <<< "$load_info"
  printf "%-18s : %.2f, %.2f, %.2f (1min, 5min, 15min)\n" "$(t 'system.load')" "$load_1min" "$load_5min" "$load_15min"
  
  # Uptime
  local uptime_str uptime_seconds
  uptime_str=$(get_uptime)
  # Tính uptime_seconds từ /proc/uptime cho API
  if [[ -r /proc/uptime ]]; then
    uptime_seconds=$(awk '{print int($1)}' /proc/uptime 2>/dev/null || echo "0")
  else
    uptime_seconds="0"
  fi
  printf "%-18s : %s\n" "$(t 'system.uptime')" "$uptime_str"
  
  # OS Info
  local os_info os_name os_version
  os_info=$(get_os_info)
  IFS='|' read -r os_name os_version <<< "$os_info"
  printf "%-18s : %s - %s\n" "$(t 'system.os')" "$os_name" "$os_version"
  
  # Virtualization
  local virt_original virt_normalized virt_display
  IFS='|' read -r virt_original virt_normalized <<< "$(detect_virtualization)"
  if [[ "$virt_original" == "$virt_normalized" ]]; then
    virt_display="$virt_normalized"
  else
    virt_display="${virt_original} (${virt_normalized})"
  fi
  printf "%-18s : %s\n" "$(t 'system.virtualization')" "$virt_display"
  
  # Provider
  local provider_original provider_normalized provider_display city region country loc public_ip
  IFS='|' read -r provider_original provider_normalized city region country loc public_ip <<< "$(detect_geo)"
  if [[ "$provider_original" == "$provider_normalized" ]]; then
    provider_display="$provider_normalized"
  else
    provider_display="${provider_original} (${provider_normalized})"
  fi
  printf "%-18s : %s\n" "$(t 'system.provider')" "$provider_display"
  printf "%-18s : %s\n" "Location" "${city}, ${region}, ${country}"
  
  # Set normalized values cho JSON payload (dùng normalized cho API)
  provider="$provider_normalized"
  virt_type="$virt_normalized"
  
  # Date
  printf "%-18s : %s\n" "$(t 'system.date')" "$(date '+%d/%m/%Y %H:%M:%S')"

  print_heading "2. $(t 'disk.test')"
  local disk_io_result
  local write_r1 write_r2 write_r3 write_avg
  local read_r1 read_r2 read_r3 read_avg
  local write_speed_mbps write_speed_mbs read_speed_mbps read_speed_mbs elapsed_time bytes_written
  
  disk_io_result=$(run_disk_io_test)
  IFS='|' read -r write_r1 write_r2 write_r3 write_avg read_r1 read_r2 read_r3 read_avg write_speed_mbps write_speed_mbs read_speed_mbps read_speed_mbs elapsed_time bytes_written <<< "$disk_io_result"
  
  # Display DD Information in system information style
  echo
  echo "DD Information:"
  printf "%-18s : %.0f MB/s\n" "Round 1" "$write_r1"
  printf "%-18s : %.0f MB/s\n" "Round 2" "$write_r2"
  printf "%-18s : %.0f MB/s\n" "Round 3" "$write_r3"
  printf "%-18s : %.0f MB/s\n" "Average" "$write_avg"
  echo
  
  printf "%-18s : %.2f Mbps (%.2f MB/s)\n" "$(t 'disk.write_speed')" "$write_speed_mbps" "$write_speed_mbs"
  printf "%-18s : %.2f Mbps (%.2f MB/s)\n" "$(t 'disk.read_speed')" "$read_speed_mbps" "$read_speed_mbs"
  printf "%-18s : %s bytes (%.2f MB)\n" "$(t 'disk.bytes')" "$bytes_written" "$(awk -v bytes="$bytes_written" 'BEGIN { printf "%.2f", bytes / 1048576 }')"

  # FIO Benchmark Test (có thể skip bằng SKIP_FIO=1)
  if [[ "${SKIP_FIO:-0}" != "1" ]]; then
    print_heading "3. $(t 'fio.test')"
    
    # Kiểm tra FIO có sẵn không trước khi chạy
    if ! command_exists fio; then
      # Thử cài đặt nếu có quyền
      if ! check_and_install_fio; then
        echo "$(t 'fio.not_installed')"
        echo "    To install FIO manually:"
        echo "    - Ubuntu/Debian: sudo apt-get install -y fio"
        echo "    - CentOS/RHEL: sudo yum install -y fio"
        echo "    - Fedora: sudo dnf install -y fio"
        echo "    - Arch: sudo pacman -S fio"
        # Skip FIO test nếu không có và không cài được
        return
      fi
    fi
    
    # FIO đã có sẵn hoặc đã cài đặt, chạy test
    local fio_result ioping_latency
    fio_result=$(run_fio_test)
    ioping_latency=$(run_ioping_test)
    
    # Kiểm tra kết quả có hợp lệ không (không phải toàn số 0)
    if [[ -n "$fio_result" ]] && [[ "$fio_result" != "" ]] && [[ "$fio_result" != "4k|0|0|0|0|0|0|64k|0|0|0|0|0|0|512k|0|0|0|0|0|0|1M|0|0|0|0|0|0" ]]; then
      _display_fio_results "$fio_result" "$ioping_latency"
    else
      echo "[!] FIO test completed but no results were obtained."
      echo "    This might be due to insufficient permissions or disk I/O issues."
    fi
  else
    echo "[i] Skipping FIO test (SKIP_FIO=1)"
  fi

  # --------------------------------------------------------------------------
  # 4. Network Speed Test (Speedtest by Ookla)
  # --------------------------------------------------------------------------
  print_heading "4. Network Speed (Speedtest by Ookla)"
  if check_and_install_speedtest; then
    local st_results
    st_results=$(run_speedtest_batch || true)
    if [[ -n "$st_results" ]]; then
      display_speedtest_results "$st_results"
    else
      echo "[i] Speedtest CLI did not return results."
    fi
  else
    echo "[!] speedtest CLI not available. Skipping network speed tests."
  fi
}

# Helper function để hiển thị FIO results
_display_fio_results() {
  local fio_result="$1"
  local ioping_latency="$2"
  
  if [[ -n "$fio_result" ]] && [[ "$fio_result" != "" ]]; then
    # Parse FIO results và hiển thị table
    # Format: 4k|total|read|write|iops|iops_read|iops_write|64k|...|1M|...
    echo
    echo "FIO Information:"
    
    # Table header
    printf "%-10s | %14s | %14s | %14s | %12s | %12s | %12s\n" "Block Size" "Total" "Read" "Write" "IOPS" "IOPSRead" "IOPSWrite"
    echo "--------------------------------------------------------------------------------------------------------"
    
    # Parse và hiển thị từng block size
    # Format: 4k|total|read|write|iops|iops_read|iops_write|64k|...|1M|...
    # Split toàn bộ string bằng |
    IFS='|' read -ra parts <<< "$fio_result"
    local block_sizes=("4k" "64k" "512k" "1M")
    local bs_idx=0
    local i=0
    
    # Tìm từng block size trong array
    for bs in "${block_sizes[@]}"; do
      # Tìm vị trí của block size trong parts array
      while [[ $i -lt ${#parts[@]} ]]; do
        if [[ "${parts[$i]}" == "$bs" ]] && [[ $((i + 6)) -lt ${#parts[@]} ]]; then
          # Parse 7 fields sau block size: total|read|write|iops|iops_read|iops_write
          local total="${parts[$((i+1))]}"
          local read_val="${parts[$((i+2))]}"
          local write_val="${parts[$((i+3))]}"
          local iops="${parts[$((i+4))]}"
          local iops_read="${parts[$((i+5))]}"
          local iops_write="${parts[$((i+6))]}"
          
          # Validate values là số (tránh block size bị nhầm)
          if [[ ! "$total" =~ ^[0-9.]+$ ]] || [[ ! "$read_val" =~ ^[0-9.]+$ ]] || [[ ! "$write_val" =~ ^[0-9.]+$ ]]; then
            # Nếu không phải số, có thể parsing sai, skip
            i=$((i + 1))
            continue
          fi
          
          # Format IOPS với k suffix nếu >= 1000
          local iops_formatted iops_read_formatted iops_write_formatted
          if command_exists bc && (( $(echo "${iops:-0} >= 1000" | bc -l 2>/dev/null || echo 0) )); then
            iops_formatted=$(awk -v val="${iops:-0}" 'BEGIN { printf "%.1fk", val / 1000 }')
          else
            iops_formatted=$(awk -v val="${iops:-0}" 'BEGIN { printf "%.0f", val }')
          fi
          
          if command_exists bc && (( $(echo "${iops_read:-0} >= 1000" | bc -l 2>/dev/null || echo 0) )); then
            iops_read_formatted=$(awk -v val="${iops_read:-0}" 'BEGIN { printf "%.1fk", val / 1000 }')
          else
            iops_read_formatted=$(awk -v val="${iops_read:-0}" 'BEGIN { printf "%.0f", val }')
          fi
          
          if command_exists bc && (( $(echo "${iops_write:-0} >= 1000" | bc -l 2>/dev/null || echo 0) )); then
            iops_write_formatted=$(awk -v val="${iops_write:-0}" 'BEGIN { printf "%.1fk", val / 1000 }')
          else
            iops_write_formatted=$(awk -v val="${iops_write:-0}" 'BEGIN { printf "%.0f", val }')
          fi
          
          # Format MB/s values với đơn vị
          local total_formatted read_formatted write_formatted
          total_formatted=$(awk -v val="${total:-0}" 'BEGIN { printf "%.0f MB/s", val }')
          read_formatted=$(awk -v val="${read_val:-0}" 'BEGIN { printf "%.0f MB/s", val }')
          write_formatted=$(awk -v val="${write_val:-0}" 'BEGIN { printf "%.0f MB/s", val }')
          
          printf "%-10s | %14s | %14s | %14s | %12s | %12s | %12s\n" \
            "$bs" "$total_formatted" "$read_formatted" "$write_formatted" "$iops_formatted" "$iops_read_formatted" "$iops_write_formatted"
          
          i=$((i + 7))
          break
        else
          i=$((i + 1))
        fi
      done
    done
    
    # Ioping Latency
    if [[ -n "$ioping_latency" ]] && [[ "$ioping_latency" != "0" ]]; then
      echo
      printf "%-18s : %sus\n" "$(t 'ioping.test')" "$ioping_latency"
    fi
  else
    echo "$(t 'fio.not_installed')"
  fi

  # Chuẩn bị JSON payload để gửi lên API
  # Escape các ký tự đặc biệt trong string để đảm bảo JSON hợp lệ
  local cpu_model_escaped os_name_escaped os_version_escaped virt_type_escaped uptime_str_escaped provider_escaped
  cpu_model_escaped=$(echo "$cpu_model" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  os_name_escaped=$(echo "$os_name" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  os_version_escaped=$(echo "$os_version" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  virt_type_escaped=$(echo "$virt_type" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  uptime_str_escaped=$(echo "$uptime_str" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  provider_escaped=$(echo "$provider" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  city_escaped=$(echo "$city" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  region_escaped=$(echo "$region" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  country_escaped=$(echo "$country" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  loc_escaped=$(echo "$loc" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  public_ip_escaped=$(echo "$public_ip" | sed 's/"/\\"/g' | sed 's/\\/\\\\/g')
  
  local json_payload
  json_payload=$(cat <<EOF
{
  "serverLabel": null,
  "cpuModelText": "${cpu_model_escaped}",
  "coreAmount": ${cpu_cores:-1},
  "frequencyGhz": ${cpu_freq:-0},
  "ramGb": ${ram_total:-0},
  "ramAvailableGb": ${ram_available:-0},
  "ramInfo": "${ram_total:-0} GB (Available: ${ram_available:-0} GB)",
  "swapInfo": "${swap_total:-0} GB (Used: ${swap_used:-0} GB)",
  "diskGb": ${disk_total:-0},
  "diskInfo": "${disk_total:-0} GB (Used: ${disk_used:-0} GB, Available: ${disk_available:-0} GB)",
  "loadAverage": "${load_1min:-0}, ${load_5min:-0}, ${load_15min:-0}",
  "uptimeSeconds": ${uptime_seconds:-0},
  "osNameText": "${os_name_escaped}",
  "virtualizationText": "${virt_type_escaped}",
  "providerText": "${provider_escaped}",
  "publicIp": "${public_ip_escaped}",
  "location": {
    "city": "${city_escaped}",
    "region": "${region_escaped}",
    "country": "${country_escaped}",
    "loc": "${loc_escaped}"
  },
  "payload": {
    "cpu": {
      "model": "${cpu_model_escaped}",
      "cores": ${cpu_cores:-1},
      "frequencyGHz": ${cpu_freq:-0}
    },
    "ram": {
      "totalGB": ${ram_total:-0},
      "availableGB": ${ram_available:-0}
    },
    "swap": {
      "totalGB": ${swap_total:-0},
      "usedGB": ${swap_used:-0}
    },
    "disk": {
      "totalGB": ${disk_total:-0},
      "usedGB": ${disk_used:-0},
      "availableGB": ${disk_available:-0}
    },
    "loadAverage": {
      "1min": ${load_1min:-0},
      "5min": ${load_5min:-0},
      "15min": ${load_15min:-0}
    },
    "uptime": "${uptime_str_escaped}",
    "os": {
      "name": "${os_name_escaped}",
      "version": "${os_version_escaped}"
    },
    "virtualization": "${virt_type_escaped}",
    "provider": "${provider_escaped}",
    "diskIo": {
      "writeSpeedMbps": ${write_speed_mbps:-0},
      "writeSpeedMBs": ${write_speed_mbs:-0},
      "readSpeedMbps": ${read_speed_mbps:-0},
      "readSpeedMBs": ${read_speed_mbs:-0},
      "timeSeconds": ${elapsed_time:-0},
      "bytesWritten": ${bytes_written:-0}
    }
  }
}
EOF
)

  # Xử lý theo mode (sharing_mode đã được set ở đầu hàm)
  case "$sharing_mode" in
    local)
      # Không hiển thị gì khi local mode
      ;;
    private|shared)
      echo
      printf "[i] Sharing result (mode: %s)...\n" "$sharing_mode"
      send_report_if_configured "$json_payload" "$sharing_mode"
      ;;
  esac
}

# ============================================================================
# SCRIPT ENTRY POINT
# ============================================================================

# Parse environment variables
SKIP_FIO="${SKIP_FIO:-0}"
NETWORK_ONLY="${NETWORK_ONLY:-0}"

# Nếu NETWORK_ONLY=1, chỉ chạy network test
if [[ "$NETWORK_ONLY" == "1" ]]; then
  # Source network test script nếu có, hoặc chạy network functions trực tiếp
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [[ -f "$SCRIPT_DIR/vps-network-test.sh" ]]; then
    bash "$SCRIPT_DIR/vps-network-test.sh"
  else
    # Fallback: chạy network test functions trực tiếp
    print_heading "Network Speed (Speedtest by Ookla)"
    if check_and_install_speedtest; then
      local st_results
      st_results=$(run_speedtest_batch || true)
      if [[ -n "$st_results" ]]; then
        display_speedtest_results "$st_results"
      else
        echo "[i] Speedtest CLI did not return results."
      fi
    else
      echo "[!] speedtest CLI not available. Skipping network speed tests."
    fi
  fi
  exit 0
fi

# Chạy main benchmark function
main "$@" || true


