# ✅ Verify Staging Setup - Checklist

## 🎉 Đã Hoàn Thành

- ✅ Staging branch đã có trên GitHub
- ✅ Domain `staging.tocdovps.dev` đã được setup trên Vercel
- ✅ Preview environment đã được configure

## 📋 Các Bước Verify và Hoàn Thiện

### 1. Verify Staging Deployment

#### A. Check Vercel Dashboard:

1. Vào **Vercel Dashboard** → Project `tocdovps.dev`
2. Vào **Deployments** tab
3. Kiểm tra:
   - Có deployment cho `staging` branch chưa?
   - Deployment status là "Ready" hay "Building"?
   - Domain `staging.tocdovps.dev` đã được assign chưa?

#### B. Nếu chưa có deployment:

Có thể staging branch chưa được trigger deploy. Cách trigger:

```bash
# Option 1: Push một commit mới (nếu có thay đổi)
git checkout staging
git commit --allow-empty -m "chore: trigger staging deployment"
git push origin staging

# Option 2: Hoặc chỉ cần push lại
git push origin staging
```

### 2. Verify Environment Variables

1. Vào **Settings** → **Environment Variables**
2. Kiểm tra các variables sau đã được set cho **Preview** environment:
   - ✅ `DATABASE_URL` → Set cho Preview
   - ✅ `REPORT_TOKEN` → Set cho Preview
   - Các variables khác nếu có

**Lưu ý**: Preview environment sẽ áp dụng cho staging và tất cả feature branches.

### 3. Test Staging Domain

#### A. Test Domain Access:

```bash
# Test domain có hoạt động không
curl -I https://staging.tocdovps.dev

# Hoặc mở browser:
# https://staging.tocdovps.dev
```

#### B. Test API Endpoint:

```bash
# Test API trên staging
npm run test:api -- https://staging.tocdovps.dev

# Hoặc test thủ công
curl -X POST https://staging.tocdovps.dev/api/benchmark/report \
  -H "Content-Type: application/json" \
  -d '{
    "serverLabel": "test-staging",
    "payload": {
      "pingTargets": ["8.8.8.8"],
      "avgPingMs": 10,
      "download": {
        "url": "https://example.com/test",
        "timeSeconds": 5,
        "speedMbps": 100
      }
    }
  }'
```

### 4. Verify Branch Tracking Settings

Từ hình ảnh bạn đã gửi, tôi thấy:

- ✅ Preview environment đã enable "Branch Tracking"
- ✅ Setting: "All unassigned branches" → Đúng rồi!

Điều này có nghĩa:

- `main` branch → Production environment
- `staging` branch → Preview environment (với domain `staging.tocdovps.dev`)
- `feature/*` branches → Preview environment (auto preview URLs)

### 5. Test Workflow End-to-End

#### A. Tạo Feature Branch và Test:

```bash
# 1. Tạo feature branch
npm run git:new-feature test-api-endpoint

# Hoặc
git checkout main
git pull origin main
git checkout -b feature/test-api-endpoint

# 2. Make một thay đổi nhỏ (ví dụ: thêm comment)
# Edit file nào đó...

# 3. Commit và push
git add .
git commit -m "test: verify preview deployment"
git push origin feature/test-api-endpoint

# 4. Vercel sẽ tự động deploy preview
# Copy preview URL từ Vercel Dashboard
# Test API trên preview URL
```

#### B. Merge vào Staging:

```bash
# 1. Merge feature vào staging
git checkout staging
git pull origin staging
git merge feature/test-api-endpoint
git push origin staging

# 2. Vercel sẽ tự động deploy staging
# Test trên staging.tocdovps.dev
npm run test:api -- https://staging.tocdovps.dev
```

#### C. Merge vào Production:

```bash
# 1. Tạo PR trên GitHub: staging → main
# 2. Review và merge
# 3. Vercel tự động deploy production
# 4. Test trên tocdovps.dev
```

## ✅ Final Checklist

- [ ] Verify staging deployment đã được tạo trên Vercel
- [ ] Verify domain `staging.tocdovps.dev` hoạt động
- [ ] Verify environment variables đã được set cho Preview
- [ ] Test API trên staging domain
- [ ] Test workflow: feature → staging → main

## 🔍 Troubleshooting

### Issue: Staging domain không hoạt động

**Check:**

1. DNS đã propagate chưa? (có thể mất 5-15 phút)
2. Domain đã được verify trong Vercel chưa?
3. Deployment status là gì?

**Solution:**

```bash
# Check DNS
dig staging.tocdovps.dev

# Hoặc
nslookup staging.tocdovps.dev
```

### Issue: Environment variables không work trên staging

**Check:**

1. Variables đã được set cho **Preview** environment chưa?
2. Đã redeploy staging sau khi thêm variables chưa?

**Solution:**

- Vào Settings → Environment Variables
- Verify variables có tag "Preview"
- Redeploy staging branch nếu cần

### Issue: Staging không auto-deploy khi push

**Check:**

1. Branch tracking đã enable chưa?
2. Staging branch đã được push lên GitHub chưa?

**Solution:**

- Verify trong Settings → Environments → Preview
- Branch Tracking phải là "Enabled"
- Push lại staging branch nếu cần

## 📊 Workflow Summary

```
┌─────────────────┐
│  feature/*      │ → Preview URLs (auto)
└────────┬────────┘
         │ merge
         ▼
┌─────────────────┐
│  staging        │ → staging.tocdovps.dev
└────────┬────────┘
         │ merge (PR)
         ▼
┌─────────────────┐
│  main           │ → tocdovps.dev (production)
└─────────────────┘
```

## 🎯 Next Steps

1. **Verify staging deployment** trên Vercel Dashboard
2. **Test API** trên `staging.tocdovps.dev`
3. **Verify environment variables** đã được set
4. **Test workflow** với một feature branch nhỏ
5. **Bắt đầu develop** trên feature branches!

---

**Lưu ý**: Nếu staging chưa có deployment, chỉ cần push lại staging branch hoặc tạo một commit mới để trigger deployment! 🚀
