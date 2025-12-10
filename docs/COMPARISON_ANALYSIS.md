# So sánh Benchmark Scripts

## Server Test: AMD EPYC 7763, 2 cores, Ubuntu 24.04, KVM, HostHatch

### 1. DD Test (Disk Write Speed)

| Script | Round 1 | Round 2 | Round 3 | Average | File Size |
|--------|---------|---------|---------|---------|-----------|
| **tocdovps.dev** | 1205 MB/s | 1219 MB/s | 1191 MB/s | **1205 MB/s** | 1GB |
| tocdo.net | 939 MB/s | 908 MB/s | 923 MB/s | 923.3 MB/s | ? |
| tocdo.io | 820 MB/s | 799 MB/s | 860 MB/s | 826 MB/s | ? |

**Phân tích:**
- ✅ **tocdovps.dev thắng** với 1GB file size (best practice)
- Có thể tocdo.io và tocdo.net dùng file nhỏ hơn → kết quả thấp hơn

---

### 2. FIO Test - 4k Block Size

| Script | Total | Read | Write | IOPS | IOPS Read | IOPS Write |
|--------|-------|------|-------|------|-----------|------------|
| **tocdo.io** | **271 MB/s** | 135 MB/s | 136 MB/s | **69.3k** | 34.6k | 34.7k |
| tocdo.net | 227 MB/s | 227 MB/s | 75.9 MB/s | 55.5k | 55.5k | 18.5k |
| tocdovps.dev | 109 MB/s | 42 MB/s | 67 MB/s | 27.9k | 10.7k | 17.1k |

**Phân tích:**
- ⚠️ **tocdo.io thắng rõ ràng** - cao gấp 2.5x tocdovps.dev
- tocdovps.dev có vấn đề: IOPS quá thấp (27.9k vs 69.3k)
- Có thể do:
  - Runtime quá ngắn (10s vs có thể 30s+)
  - File size nhỏ (100MB vs có thể lớn hơn)
  - Config FIO chưa tối ưu

---

### 3. FIO Test - 64k Block Size

| Script | Total | Read | Write | IOPS |
|--------|-------|------|-------|------|
| **tocdo.io** | **2 GB/s** | 1 GB/s | 1 GB/s | **40.3k** |
| tocdovps.dev | 951 MB/s | 419 MB/s | 532 MB/s | 15.2k |

**Phân tích:**
- ⚠️ **tocdo.io thắng** - cao gấp 2x tocdovps.dev

---

### 4. FIO Test - 512k Block Size

| Script | Total | Read | Write | IOPS |
|--------|-------|------|-------|------|
| **tocdo.io** | **4 GB/s** | 2 GB/s | 2 GB/s | **8.5k** |
| tocdovps.dev | 2843 MB/s | 1438 MB/s | 1405 MB/s | 5.7k |

**Phân tích:**
- ⚠️ **tocdo.io thắng** - cao gấp 1.4x tocdovps.dev

---

### 5. FIO Test - 1M Block Size

| Script | Total | Read | Write | IOPS |
|--------|-------|------|-------|------|
| **tocdo.io** | **5 GB/s** | 2 GB/s | 2 GB/s | **4.9k** |
| tocdovps.dev | 3931 MB/s | 2001 MB/s | 1930 MB/s | 3.9k |

**Phân tích:**
- ⚠️ **tocdo.io thắng** - cao gấp 1.27x tocdovps.dev
- Sự khác biệt giảm dần ở block size lớn (sequential I/O)

---

## Nguyên nhân chênh lệch

### 1. FIO Configuration

**tocdovps.dev hiện tại:**
```ini
runtime=10          # Chỉ 10 giây - quá ngắn!
size=100M           # File 100MB - có thể bị cache
direct=1            # ✅ Đúng
ioengine=libaio     # ✅ Đúng
```

**Có thể tocdo.io dùng:**
- Runtime: 30-60 giây (ổn định hơn)
- File size: 500MB-1GB (tránh cache)
- Có thể có thêm config khác (iodepth, numjobs)

### 2. DD Test

**tocdovps.dev:**
- ✅ File size: 1GB (best practice)
- ✅ Direct I/O: `oflag=direct`
- ✅ 3 rounds + average

**tocdo.io/tocdo.net:**
- Có thể file size nhỏ hơn → kết quả thấp hơn

---

## Kết luận

### ✅ Điểm mạnh của tocdovps.dev:
1. **DD Test tốt nhất** - dùng 1GB file (best practice)
2. **Format output đẹp** - table rõ ràng
3. **Có ioping latency** (tocdo.io cũng có)

### ⚠️ Điểm yếu cần cải thiện:
1. **FIO config chưa tối ưu:**
   - Runtime 10s → nên tăng lên 30-60s
   - File size 100MB → nên tăng lên 500MB-1GB
   - Có thể thêm `iodepth` và `numjobs` để tăng performance

2. **FIO kết quả thấp hơn đáng kể:**
   - 4k IOPS: 27.9k vs 69.3k (thấp hơn 2.5x)
   - 1M Total: 3.9 GB/s vs 5 GB/s (thấp hơn 1.27x)

---

## Đề xuất cải thiện

### 1. Tăng FIO Runtime
```ini
runtime=30          # Từ 10s → 30s (hoặc 60s)
```

### 2. Tăng FIO File Size
```ini
size=500M           # Từ 100M → 500M (hoặc 1G)
```

### 3. Thêm FIO Optimization
```ini
iodepth=16          # Tăng I/O depth
numjobs=1           # Số jobs (có thể tăng nếu cần)
```

### 4. Warm-up Phase
- Chạy warm-up trước khi test thực sự
- Đảm bảo disk đã sẵn sàng

---

## Best Practice từ tocdo.io

1. ✅ FIO runtime đủ dài (có thể 30-60s)
2. ✅ FIO file size đủ lớn (có thể 500MB-1GB)
3. ✅ Có ioping latency test
4. ✅ Format output đẹp với table

---

## Action Items

- [ ] Tăng FIO runtime từ 10s → 30s
- [ ] Tăng FIO file size từ 100MB → 500MB
- [ ] Thêm iodepth và numjobs config
- [ ] Test lại và so sánh với tocdo.io
- [ ] Giữ nguyên DD test (đã tốt)

