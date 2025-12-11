# 🎯 Staging Setup - Next Steps

## ✅ Đã Hoàn Thành

- ✅ Staging branch đã có trên GitHub
- ✅ Domain `staging.tocdovps.dev` đã được setup trên Vercel
- ✅ Preview environment đã được configure với "All unassigned branches"

## 📋 Các Bước Tiếp Theo

### 1. Verify Environment Variables (Quan Trọng!)

1. Vào **Vercel Dashboard** → Project `tocdovps.dev`
2. **Settings** → **Environment Variables**
3. Kiểm tra các variables sau đã được set cho **Preview** environment:
   - ✅ `DATABASE_URL` → Phải có tag "Preview"
   - ✅ `REPORT_TOKEN` → Phải có tag "Preview"
   - Các variables khác nếu có

**Lưu ý**: Preview environment sẽ áp dụng cho staging và tất cả feature branches.

### 2. Verify Staging Deployment

#### A. Check Vercel Dashboard:

1. Vào **Deployments** tab
2. Tìm deployment cho `staging` branch
3. Kiểm tra:
   - Status là "Ready" hay đang "Building"?
   - Domain `staging.tocdovps.dev` đã được assign chưa?

#### B. Nếu chưa có deployment:

Staging branch có thể chưa trigger deploy. Có 2 cách:

**Option 1: Commit các files mới để trigger deployment**

Bạn có nhiều files mới chưa commit (docs, scripts, etc.). Có thể commit để trigger:

```bash
# Đang ở staging branch
git add .
git commit -m "docs: add staging setup and git workflow documentation"
git push origin staging
```

**Option 2: Tạo empty commit để trigger**

```bash
git commit --allow-empty -m "chore: trigger staging deployment"
git push origin staging
```

### 3. Test Staging Domain

Sau khi deployment ready, test:

#### A. Test Domain Access:

```bash
# Test domain
curl -I https://staging.tocdovps.dev

# Hoặc mở browser
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

### 4. Verify Branch Tracking (Đã OK!)

Từ cấu hình của bạn:
- ✅ Preview environment: "All unassigned branches" → Đúng!
- ✅ Domain `staging.tocdovps.dev` đã được assign cho Preview

Điều này có nghĩa:
- `main` → Production (tocdovps.dev)
- `staging` → Preview (staging.tocdovps.dev)
- `feature/*` → Preview (auto preview URLs)

## 🚀 Test Workflow End-to-End

Sau khi staging hoạt động, test workflow:

### Step 1: Tạo Feature Branch

```bash
# Tạo feature branch từ main
git checkout main
git pull origin main
git checkout -b feature/test-workflow

# Hoặc dùng script
npm run git:new-feature test-workflow
```

### Step 2: Make Changes và Test Preview

```bash
# Make một thay đổi nhỏ
# Ví dụ: thêm comment vào API route

# Commit và push
git add .
git commit -m "test: verify preview deployment workflow"
git push origin feature/test-workflow

# Vercel tự động deploy preview
# Copy preview URL từ Vercel Dashboard
# Test API trên preview URL
npm run test:api -- https://preview-url.vercel.app
```

### Step 3: Merge vào Staging

```bash
# Merge feature vào staging
git checkout staging
git pull origin staging
git merge feature/test-workflow
git push origin staging

# Vercel tự động deploy staging
# Test trên staging
npm run test:api -- https://staging.tocdovps.dev
```

### Step 4: Deploy Production (Khi Ready)

```bash
# Tạo PR trên GitHub: staging → main
# Review và merge
# Vercel tự động deploy production
# Test trên production
npm run test:api -- https://tocdovps.dev
```

## ✅ Final Checklist

- [ ] Verify environment variables đã được set cho Preview
- [ ] Verify staging deployment đã được tạo trên Vercel
- [ ] Test domain `staging.tocdovps.dev` hoạt động
- [ ] Test API trên staging domain
- [ ] (Optional) Commit các files mới để trigger deployment
- [ ] Test workflow: feature → staging → main

## 🔍 Quick Commands

```bash
# Check branch status
npm run git:status

# Test API trên staging
npm run test:api -- https://staging.tocdovps.dev

# Sync staging với main (nếu cần)
git checkout staging
git merge main
git push origin staging
```

## 📚 Tài Liệu

- Verify setup: `docs/verify-staging-setup.md`
- Branch strategy: `docs/git-branch-strategy.md`
- Quick workflow: `docs/quick-branch-workflow.md`

---

**Tóm lại**: Bạn đã setup xong! Bây giờ chỉ cần:
1. Verify environment variables
2. Test staging domain
3. Bắt đầu develop trên feature branches! 🎉

