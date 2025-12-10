# Script Permissions Requirements

## Tổng quan

Script `vps-benchmark.sh` được thiết kế để **chạy được với non-root user** trong hầu hết các trường hợp. Chỉ có một số tính năng tùy chọn cần quyền root/sudo.

## Phần KHÔNG cần root (chạy được với non-root user)

### ✅ System Information
- **CPU Info**: Đọc từ `/proc/cpuinfo` - không cần root
- **RAM Info**: Đọc từ `/proc/meminfo` - không cần root
- **Swap Info**: Đọc từ `/proc/meminfo` - không cần root
- **Disk Info**: Sử dụng `df` - không cần root
- **Load Average**: Đọc từ `/proc/loadavg` - không cần root
- **Uptime**: Sử dụng `uptime` hoặc `/proc/uptime` - không cần root
- **OS Info**: Đọc từ `/etc/os-release` - không cần root
- **Virtualization**: Đọc từ `/sys/class/dmi/id/product_name` - không cần root
- **Provider Detection**: Sử dụng `curl`/`wget` để query API - không cần root

### ✅ Disk I/O Test (dd)
- Sử dụng `/tmp/tocdovps_io_test_$$` - thường không cần root
- `dd` với `oflag=direct` và `iflag=direct` có thể cần quyền đặc biệt trên một số hệ thống, nhưng thường vẫn hoạt động với non-root user

### ✅ FIO Benchmark Test
- Sử dụng `/tmp/tocdovps_fio_test_*` - thường không cần root
- FIO với `direct=1` có thể cần quyền đặc biệt, nhưng thường vẫn hoạt động
- **Lưu ý**: FIO phải được cài đặt trước (xem phần dưới)

### ✅ Ioping Latency Test
- Sử dụng `/tmp/tocdovps_ioping_test_$$` - không cần root
- **Lưu ý**: Ioping phải được cài đặt trước

## Phần CẦN root/sudo (tùy chọn)

### ⚠️ Cài đặt FIO tự động
- Script có thể tự động cài đặt FIO nếu:
  - Chạy với quyền root (`EUID -eq 0`), HOẶC
  - Có `sudo` command available
- Nếu không có quyền, script sẽ hiển thị hướng dẫn cài đặt thủ công
- **FIO test sẽ bị skip** nếu FIO chưa được cài đặt

## Kịch bản sử dụng

### 1. Non-root user (khuyến nghị)
```bash
# Chạy trực tiếp với non-root user
bash <(curl -fsSL https://tocdovps.dev/install)

# Kết quả:
# ✅ System Information: Hoạt động bình thường
# ✅ Disk I/O Test: Hoạt động bình thường
# ⚠️ FIO Test: Chỉ chạy nếu FIO đã được cài đặt trước
```

### 2. Root user
```bash
# Chạy với root
sudo bash <(curl -fsSL https://tocdovps.dev/install)

# Kết quả:
# ✅ System Information: Hoạt động bình thường
# ✅ Disk I/O Test: Hoạt động bình thường
# ✅ FIO Test: Tự động cài đặt FIO nếu chưa có
```

### 3. Non-root user với FIO đã cài đặt
```bash
# Cài đặt FIO trước (cần sudo)
sudo apt-get install -y fio  # Ubuntu/Debian
# hoặc
sudo yum install -y fio       # CentOS/RHEL
# hoặc
sudo dnf install -y fio      # Fedora
# hoặc
sudo pacman -S fio           # Arch

# Sau đó chạy script với non-root user
bash <(curl -fsSL https://tocdovps.dev/install)

# Kết quả:
# ✅ Tất cả tests đều hoạt động
```

## Xử lý lỗi permissions

### Nếu `/tmp` không writable
- Script sẽ fail khi tạo test files
- Giải pháp: Đảm bảo `/tmp` có quyền write cho user hiện tại

### Nếu `dd` với `direct` flag fail
- Script sẽ bỏ qua round đó và tiếp tục
- Kết quả có thể không chính xác nhưng script vẫn chạy được

### Nếu FIO không có và không cài được
- Script sẽ hiển thị thông báo và skip FIO test
- Các tests khác vẫn chạy bình thường

## Khuyến nghị

1. **Chạy với non-root user** để đảm bảo an toàn
2. **Cài đặt FIO trước** nếu muốn có FIO benchmark test:
   ```bash
   sudo apt-get install -y fio  # hoặc tương ứng với distro của bạn
   ```
3. **Kiểm tra quyền `/tmp`** nếu gặp lỗi khi tạo test files

## Tóm tắt

| Tính năng | Non-root | Root | Ghi chú |
|----------|----------|------|---------|
| System Information | ✅ | ✅ | Không cần root |
| Disk I/O Test (dd) | ✅ | ✅ | Thường không cần root |
| FIO Test | ⚠️ | ✅ | Cần FIO đã cài đặt |
| Auto-install FIO | ❌ | ✅ | Chỉ root/sudo mới cài được |

**Kết luận**: Script được thiết kế để chạy **an toàn với non-root user**. Chỉ cần cài đặt FIO trước nếu muốn có FIO benchmark test.


