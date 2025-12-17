# Hướng dẫn Testing API

## 0. Vercel Deployment Protection Bypass (Staging)

**Khi nào cần bypass?**

- Staging environment có Vercel Deployment Protection enabled
- Cần bypass để:
  1. **Download script** từ `/install` hoặc `/scripts/*.sh` (nếu protected)
  2. **POST report** lên `/api/benchmark/report` (nếu protected)

**Cách lấy bypass token:**

1. Vào Vercel Dashboard → Project → Settings → Deployment Protection
2. Copy **Bypass Token** (hoặc tạo mới nếu chưa có)
3. Set vào environment variable `VERCEL_BYPASS` hoặc dùng trực tiếp trong command

**Cách sử dụng:**

**Option 1: Dùng env var (khuyến nghị - tránh lộ token trong history)**

```bash
# Set token vào env var
export VERCEL_BYPASS="your-token-here"

# Sau đó chạy các commands bình thường
bash scripts/test-api-sample.sh
bash <(curl -fsSL https://staging.tocdovps.dev/install)
```

**Option 2: Inline trong command (tiện cho quick test)**

```bash
# Test full benchmark staging
VERCEL_BYPASS="your-token-here" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true")

# Test API với sample data trên staging
VERCEL_BYPASS="your-token-here" \
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/scripts/test-api-sample.sh?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true")
```

**Lưu ý quan trọng:**

- ✅ Script tự động dùng `VERCEL_BYPASS` env var khi POST lên API (nếu có)
- ✅ Nếu `/install` route có protection, cần bypass header khi download script
- ✅ Query param `x-vercel-set-bypass-cookie=true` giúp set cookie bypass (tùy chọn)
- ⚠️ **KHÔNG** hardcode token vào script hoặc commit vào git (bảo mật)
- ⚠️ Token staging có thể share trong team, nhưng production token phải bảo mật

## 1. Test nhanh với Sample Data (Khuyến nghị)

Thay vì chờ 15 phút để chạy benchmark thật, dùng script test với sample data:

### Cách 1: Chạy từ local (Khuyến nghị cho dev)

```bash
# Test trên production
bash scripts/test-api-sample.sh

# Test trên staging (cần set VERCEL_BYPASS)
export VERCEL_BYPASS="your-token-here"
export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"
bash scripts/test-api-sample.sh
```

### Cách 2: Tải script từ server và chạy (Staging)

```bash
# Test API với sample data trên staging
VERCEL_BYPASS="your-token-here" \
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/scripts/test-api-sample.sh?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true")
```

**Lưu ý:** `/scripts/test-api-sample.sh` có thể không tồn tại trên server nếu chưa deploy. Nên dùng cách 1 (local) cho staging testing.

**Lợi ích:**

- ✅ Test nhanh (< 5 giây)
- ✅ Verify API hoạt động đúng format
- ✅ Không cần chạy benchmark thật
- ✅ Có thể test nhiều lần để debug

## 2. Test với Script Thật (Sau khi verify API OK)

Sau khi test API với sample data thành công, mới test với script thật:

```bash
# Production (cho user thật)
bash <(curl -fsSL https://tocdovps.dev/install)

# Staging (cho dev test - cần bypass token)
VERCEL_BYPASS="your-token-here" \
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true")
```

**Hoặc dùng env var (nếu đã set trước đó):**

```bash
# Set token một lần
export VERCEL_BYPASS="your-token-here"
export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"

# Sau đó chạy (script tự động dùng VERCEL_BYPASS khi POST lên API)
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true")
```

**Lưu ý:**

- ⏱️ Mất ~15 phút để chạy xong
- ✅ Chỉ test khi đã verify API với sample data
- ✅ Dùng để test end-to-end flow
- ✅ Script tự động dùng `VERCEL_BYPASS` khi POST lên API (nếu env var được set)

## 3. Troubleshooting

### Lỗi 401 khi download script từ `/install` (Staging)

Nếu gặp lỗi 401 khi download script từ staging `/install`:

**Nguyên nhân:** Vercel Deployment Protection block request ở edge level, trước khi đến Next.js route.

**Giải pháp - 2-step process với cookie:**

```bash
# Step 1: Set cookie bypass (tạo cookie file)
VERCEL_BYPASS="your-token-here"
curl -c /tmp/vercel_bypass_cookie.txt -fsSL \
  -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true" \
  > /dev/null

# Step 2: Download script với cookie đã set
export VERCEL_BYPASS="your-token-here"
bash <(curl -b /tmp/vercel_bypass_cookie.txt -fsSL \
  "https://staging.tocdovps.dev/install")

# Cleanup
rm -f /tmp/vercel_bypass_cookie.txt
```

**Hoặc dùng một lệnh (inline):**

```bash
VERCEL_BYPASS="your-token-here" \
bash -c 'curl -c /tmp/vb.txt -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true" > /dev/null && \
  curl -b /tmp/vb.txt -fsSL "https://staging.tocdovps.dev/install" | bash && \
  rm -f /tmp/vb.txt'
```

### Lỗi 401/403 khi POST lên API (Staging)

Nếu gặp lỗi 401/403 khi script gửi report lên staging API:

```bash
# ❌ Sai - thiếu VERCEL_BYPASS env var
bash <(curl -fsSL https://staging.tocdovps.dev/install)

# ✅ Đúng - set VERCEL_BYPASS trước khi chạy
export VERCEL_BYPASS="your-token-here"
bash <(curl -fsSL https://staging.tocdovps.dev/install)
```

**Debug steps:**

1. Verify token đúng:

   ```bash
   export VERCEL_BYPASS="your-token-here"
   echo "[i] VERCEL_BYPASS is set: ${VERCEL_BYPASS:0:10}..."
   ```

2. Test với sample data trước (nhanh hơn):

   ```bash
   export VERCEL_BYPASS="your-token-here"
   export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"
   bash scripts/test-api-sample.sh
   ```

3. Nếu sample data thành công nhưng script thật fail → check JSON validation:
   - Script sẽ tự validate JSON trước khi gửi
   - Nếu JSON invalid, sẽ hiển thị preview + dừng lại

### Lỗi 400 "Invalid payload"

Nếu gặp lỗi 400 "Invalid payload":

1. **Kiểm tra JSON validation trong script:**

   - Script tự động validate JSON với `jq` hoặc `python3` trước khi gửi
   - Nếu invalid, sẽ hiển thị preview 500 ký tự đầu

2. **Test với sample data trước:**

   ```bash
   export VERCEL_BYPASS="your-token-here"
   export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"
   bash scripts/test-api-sample.sh
   ```

   Nếu sample data thành công nhưng script thật fail → vấn đề ở script build JSON, không phải API.

3. **Check API logs:**
   - Xem terminal `npm run dev` để thấy chi tiết validation error từ Zod
   - API sẽ log field nào bị lỗi validation

## 4. Workflow Testing Khuyến nghị

```
1. Sửa code API / Script
   ↓
2. Deploy lên staging
   ↓
3. Set VERCEL_BYPASS env var (nếu staging có protection)
   ↓
4. Test với sample data (scripts/test-api-sample.sh)
   ↓
5. Nếu OK → Test với script thật (bash <(curl ...))
   ↓
6. Nếu OK → Deploy production
```

**Quick commands cho staging:**

```bash
# 1. Set environment variables
export VERCEL_BYPASS="your-token-here"
export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"

# 2. Test với sample data (nhanh, ~5 giây)
bash scripts/test-api-sample.sh

# 3. Nếu OK, test với script thật (~15 phút)
bash <(curl -fsSL https://staging.tocdovps.dev/install)
```

## 5. Environment Variables

### Production

- `REPORT_URL`: `https://www.tocdovps.dev/api/benchmark/report` (mặc định)
- Không cần `VERCEL_BYPASS`

### Staging

- `REPORT_URL`: `https://staging.tocdovps.dev/api/benchmark/report` (set manually)
- `VERCEL_BYPASS`: Token để bypass Vercel deployment protection
  - Lấy từ: Vercel Dashboard → Project → Settings → Deployment Protection
  - **Chỉ cần cho POST request** lên API (không cần cho GET `/install`)
  - Script tự động dùng env var này khi POST (nếu được set)

**Cách set:**

```bash
# Temporary (cho session hiện tại)
export VERCEL_BYPASS="your-token-here"
export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"

# Hoặc inline trong command
VERCEL_BYPASS="your-token-here" \
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
bash scripts/test-api-sample.sh
```

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

## 7. Quick Reference - Staging Testing

**Commands thực tế cho staging (copy-paste ready):**

```bash
# Setup token
export VERCEL_BYPASS="your-token-here"

# 1. Test API với sample data (nhanh, ~5 giây)
# Nếu có script local:
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
bash scripts/test-api-sample.sh

# Hoặc download từ server (cần bypass cookie):
curl -c /tmp/vb.txt -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/scripts/test-api-sample.sh?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true" > /dev/null
REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" \
bash <(curl -b /tmp/vb.txt -fsSL "https://staging.tocdovps.dev/scripts/test-api-sample.sh")
rm -f /tmp/vb.txt

# 2. Test full benchmark (chậm, ~15 phút)
# Step 1: Set cookie bypass
curl -c /tmp/vb.txt -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true" > /dev/null

# Step 2: Download và chạy script với cookie
bash <(curl -b /tmp/vb.txt -fsSL "https://staging.tocdovps.dev/install")

# Cleanup
rm -f /tmp/vb.txt
```

**Hoặc dùng env var (nếu đã set):**

```bash
# Setup một lần
export VERCEL_BYPASS="your-token-here"
export REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report"

# Test nhanh (sample data)
bash scripts/test-api-sample.sh

# Test đầy đủ (benchmark thật)
bash <(curl -fsSL -H "x-vercel-protection-bypass:$VERCEL_BYPASS" \
  "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true")
```

**Debug JSON issues:**

- Script tự validate JSON trước khi gửi (với `jq` hoặc `python3`)
- Nếu invalid, sẽ hiển thị preview 500 ký tự đầu + dừng lại
- Check terminal `npm run dev` để xem API validation errors chi tiết
