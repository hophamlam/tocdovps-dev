# Hướng dẫn Testing API

## 1. Test nhanh với Sample Data (Khuyến nghị)

Thay vì chờ 15 phút để chạy benchmark thật, dùng script test với sample data:

### Cách 1: Tải script từ server và chạy (Khuyến nghị)

```bash
# Test trên production
bash <(curl -fsSL https://tocdovps.dev/scripts/test-api-sample.sh)

# Test trên staging (cần bypass token)
VERCEL_BYPASS="your-token-here" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/scripts/test-api-sample.sh?x-vercel-protection-bypass=$VERCEL_BYPASS")

# Hoặc set REPORT_URL để test API khác
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
VERCEL_BYPASS="your-token-here" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/scripts/test-api-sample.sh?x-vercel-protection-bypass=$VERCEL_BYPASS")
```

### Cách 2: Chạy từ local (nếu có codebase)

```bash
# Test trên production
bash scripts/test-api-sample.sh

# Test trên staging (cần bypass token)
VERCEL_BYPASS="your-token-here" bash scripts/test-api-sample.sh

# Hoặc set REPORT_URL
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
VERCEL_BYPASS="your-token-here" \
bash scripts/test-api-sample.sh
```

**Lợi ích:**

- ✅ Test nhanh (< 5 giây)
- ✅ Verify API hoạt động đúng format
- ✅ Không cần chạy benchmark thật
- ✅ Có thể test nhiều lần để debug

## 2. Test với Script Thật (Sau khi verify API OK)

Sau khi test API với sample data thành công, mới test với script thật:

```bash
# Production
bash <(curl -fsSL https://tocdovps.dev/install)

# Staging (cần bypass token)
VERCEL_BYPASS="your-token-here" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS")
```

**Lưu ý:**

- ⏱️ Mất ~15 phút để chạy xong
- ✅ Chỉ test khi đã verify API với sample data
- ✅ Dùng để test end-to-end flow

## 3. Troubleshooting

### Lỗi 401 khi tải script

Nếu gặp lỗi 401 khi tải script từ staging:

```bash
# ❌ Sai - thiếu bypass header
curl -fsSL https://staging.tocdovps.dev/scripts/vps-benchmark.sh

# ✅ Đúng - có bypass header
VERCEL_BYPASS="your-token-here"
curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/scripts/vps-benchmark.sh"
```

### Lỗi 400 khi gửi report

Nếu gặp lỗi 400 "Invalid payload":

1. **Kiểm tra script đã được deploy chưa:**

   ```bash
   curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
     "https://staging.tocdovps.dev/scripts/vps-benchmark.sh" | \
     grep -A 5 '"payload"'
   ```

   Nếu không thấy `"payload"` field → script chưa được deploy, cần redeploy.

2. **Test với sample data trước:**

   ```bash
   VERCEL_BYPASS="your-token-here" bash scripts/test-api-sample.sh
   ```

   Nếu sample data thành công nhưng script thật fail → vấn đề ở script, không phải API.

## 4. Workflow Testing Khuyến nghị

```
1. Sửa code API
   ↓
2. Deploy lên staging
   ↓
3. Test với sample data (scripts/test-api-sample.sh)
   ↓
4. Nếu OK → Test với script thật
   ↓
5. Nếu OK → Deploy production
```

## 5. Environment Variables

### Production

- `REPORT_URL`: `https://www.tocdovps.dev/api/benchmark/report`
- Không cần `VERCEL_BYPASS`

### Staging

- `REPORT_URL`: `https://staging.tocdovps.dev/api/benchmark/report`
- `VERCEL_BYPASS`: Token để bypass Vercel deployment protection
- Token được set trong Vercel dashboard → Environment Variables

## 6. Sample Data Format

Script `test-api-sample.sh` sử dụng format giống hệt script thật:

```json
{
  "payload": {
    "systemInfo": { ... },
    "diskIo": { ... },
    "fio": { ... },
    "netSpeed": [ ... ]
  },
  "systemInfo": { ... },
  "diskIo": { ... },
  "fio": { ... },
  "netSpeed": [ ... ]
}
```

Format này đảm bảo test chính xác như production.
