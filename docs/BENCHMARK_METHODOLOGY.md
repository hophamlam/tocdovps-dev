# Disk I/O Benchmark Methodology

## Vấn đề với file 100MB

### Hiện trạng
Script hiện tại sử dụng **100MB** cho disk I/O test với các đặc điểm:
- ✅ Sử dụng `oflag=direct` và `iflag=direct` để bypass page cache
- ✅ Chạy 3 rounds và tính average để giảm variance
- ⚠️ File size 100MB có thể nhỏ hơn cache của hệ thống

### Vấn đề tiềm ẩn

1. **Cache ảnh hưởng:**
   - RAM cache (page cache) thường vài GB
   - Disk controller cache có thể vài trăm MB đến vài GB
   - File 100MB có thể bị cache hoàn toàn → kết quả không phản ánh disk thực tế

2. **Thin provisioning optimization:**
   - Sử dụng `/dev/zero` có thể bị optimize bởi thin provisioning
   - Một số storage system có thể skip write zeros → kết quả không chính xác

3. **Variance cao:**
   - File nhỏ → thời gian test ngắn → dễ bị ảnh hưởng bởi system load
   - Cần nhiều rounds hơn để có kết quả ổn định

## Best Practices

### 1. File Size
- **Khuyến nghị**: 1GB - 10GB (tùy vào RAM và disk size)
- **Lý do**: Đảm bảo lớn hơn cache của hệ thống
- **Trade-off**: Test lâu hơn, tốn disk space

### 2. Direct I/O
- ✅ **Đã implement**: `oflag=direct` và `iflag=direct`
- **Lý do**: Bypass page cache để test disk thực tế

### 3. Random Data
- **Khuyến nghị**: Sử dụng `/dev/urandom` thay vì `/dev/zero`
- **Lý do**: Tránh thin provisioning optimization
- **Trade-off**: Chậm hơn (generate random data)

### 4. Multiple Rounds
- ✅ **Đã implement**: 3 rounds và tính average
- **Lý do**: Giảm variance và ảnh hưởng của system load

### 5. Block Size
- **Khuyến nghị**: Test với nhiều block sizes (1MB, 4KB, 64KB)
- **Lý do**: Ứng dụng khác nhau có I/O pattern khác nhau
- **Note**: FIO test đã cover điều này

## So sánh với các công cụ khác

### Bench.sh (bench.sh)
- File size: **1GB**
- Direct I/O: ✅
- Random data: ❌ (dùng /dev/zero)

### Tocdo.io
- File size: **100MB** (tương tự script hiện tại)
- Direct I/O: ✅
- Random data: ❌

### FIO (industry standard)
- File size: Configurable (thường 1GB+)
- Direct I/O: ✅ (`direct=1`)
- Random data: ✅ (có thể config)
- Multiple block sizes: ✅

## Đề xuất cải thiện

### Option 1: Tăng file size lên 1GB (Recommended)
**Ưu điểm:**
- Kết quả chính xác hơn
- Vẫn nhanh (1-2 phút)
- Phù hợp với best practices

**Nhược điểm:**
- Test lâu hơn (~10-20 giây thay vì 1-2 giây)
- Tốn disk space hơn

### Option 2: Giữ 100MB nhưng thêm option configurable
**Ưu điểm:**
- Linh hoạt, user có thể tùy chỉnh
- Default nhanh cho quick test
- Advanced user có thể tăng lên

**Nhược điểm:**
- Phức tạp hơn
- Default vẫn có vấn đề với cache

### Option 3: Dùng random data thay vì /dev/zero
**Ưu điểm:**
- Tránh thin provisioning optimization
- Kết quả chính xác hơn

**Nhược điểm:**
- Chậm hơn đáng kể (generate random data)
- Có thể không cần thiết nếu đã dùng direct I/O

### Option 4: Hybrid approach
- Quick test: 100MB với /dev/zero (nhanh, cho quick check)
- Full test: 1GB với /dev/urandom (chính xác, cho detailed benchmark)
- User có thể chọn mode

## Khuyến nghị

### Cho quick benchmark (hiện tại)
- **Giữ 100MB** với direct I/O là hợp lý
- Nhanh, đủ để so sánh tương đối giữa các VPS
- FIO test đã cover detailed benchmark

### Cho production-ready benchmark
- **Tăng lên 1GB** với direct I/O
- Có thể thêm option để user chọn file size
- Vẫn dùng /dev/zero để giữ tốc độ (direct I/O đã bypass cache)

## Kết luận

**100MB với direct I/O là compromise tốt cho:**
- ✅ Quick benchmark
- ✅ So sánh tương đối
- ✅ User experience (nhanh)

**Nhưng không phải best practice cho:**
- ❌ Production-grade benchmark
- ❌ Systems với cache lớn
- ❌ Detailed performance analysis

**Khuyến nghị:** Tăng lên **1GB** để cân bằng giữa accuracy và speed.


