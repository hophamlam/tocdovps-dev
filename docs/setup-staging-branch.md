# 🚀 Setup Staging Branch - Hướng Dẫn

## ✅ Đã Tạo Staging Branch

Staging branch đã được tạo từ main và push lên GitHub.

## 📋 Các Bước Setup Vercel

### 1. Configure Branch Mapping trong Vercel Dashboard

1. Vào **Vercel Dashboard** → Chọn project `vps-benchmark-nextjs`
2. Vào **Settings** → **Git**
3. Cấu hình:
   - **Production Branch**: `main`
   - **Preview Branches**: `staging`, `feature/*`, `fix/*`, `hotfix/*`

### 2. Setup Environment Variables cho Staging

1. Vào **Settings** → **Environment Variables**
2. Đảm bảo các variables sau đã được set cho **Preview** environment:
   - `DATABASE_URL` (có thể dùng cùng với production hoặc database riêng)
   - `REPORT_TOKEN` (có thể dùng cùng hoặc token riêng)
   - Các variables khác nếu có

**Lưu ý**:

- Preview environment sẽ áp dụng cho tất cả preview deployments (staging, feature/\*, etc.)
- Nếu muốn staging dùng database riêng, tạo variable riêng cho staging branch

### 3. (Optional) Setup Custom Domain cho Staging

Nếu bạn muốn có domain cố định cho staging (ví dụ: `test.tocdovps.dev`):

1. Vào **Settings** → **Domains**
2. Click **Add Domain**
3. Nhập domain: `test.tocdovps.dev`
4. Configure:

   - **Branch**: `staging`
   - **Production Domain**: `tocdovps.dev` (nếu chưa có)

5. **Setup DNS** (trong domain provider):
   ```
   Type: CNAME
   Name: test
   Value: cname.vercel-dns.com
   TTL: Auto
   ```

Xem chi tiết: `docs/vercel-custom-domain-setup.md`

## 🔄 Workflow Sau Khi Setup

### 1. Develop trên Feature Branch

```bash
# Tạo feature branch
npm run git:new-feature benchmark-report-api

# Hoặc
git checkout main
git pull origin main
git checkout -b feature/benchmark-report-api

# Develop và test
npm run dev
npm run test:api
```

### 2. Test trên Preview

```bash
# Push feature branch
git push origin feature/benchmark-report-api

# Vercel tự động deploy preview
# Copy preview URL từ Vercel Dashboard
# Test API
npm run test:api -- https://preview-url.vercel.app
```

### 3. Merge vào Staging

```bash
# Merge feature vào staging
git checkout staging
git pull origin staging
git merge feature/benchmark-report-api
git push origin staging

# Hoặc dùng script
./scripts/git-workflow.sh merge-staging
```

### 4. Test trên Staging

- Staging sẽ tự động deploy lên Vercel
- Test trên staging URL (hoặc custom domain nếu đã setup)
- Verify mọi thứ hoạt động đúng

### 5. Deploy Production

```bash
# Tạo PR trên GitHub: staging → main
# Review và merge
# → Tự động deploy lên production
```

## 📊 Branch Structure Hiện Tại

```
main              → Production (tocdovps.dev)
staging           → Staging (preview URL hoặc test.tocdovps.dev)
feature/*         → Feature branches (auto preview URLs)
```

## ✅ Checklist Setup

- [x] Tạo staging branch từ main
- [x] Push staging lên GitHub
- [ ] Configure Vercel branch mapping
- [ ] Setup environment variables cho Preview
- [ ] (Optional) Setup custom domain cho staging
- [ ] Test deploy staging branch

## 🔍 Verify Setup

Sau khi setup xong, verify:

1. **Check Vercel Dashboard**:

   - Vào Deployments
   - Xem có deployment cho staging branch không
   - Verify environment variables đã được set

2. **Test Staging Deployment**:

   ```bash
   # Lấy staging URL từ Vercel Dashboard
   npm run test:api -- https://staging-url.vercel.app
   ```

3. **Check Branch Status**:
   ```bash
   npm run git:status
   ```

## 📚 Tài Liệu Liên Quan

- Branch Strategy: `docs/git-branch-strategy.md`
- Quick Workflow: `docs/quick-branch-workflow.md`
- Custom Domain Setup: `docs/vercel-custom-domain-setup.md`
- API Testing Guide: `docs/vercel-api-testing-guide.md`

## 🎯 Next Steps

1. Vào Vercel Dashboard và configure branch mapping
2. Setup environment variables cho Preview
3. Test deploy staging branch
4. Bắt đầu develop trên feature branches!

---

**Lưu ý**: Staging branch đã được tạo và push lên GitHub. Bây giờ bạn chỉ cần configure Vercel là có thể sử dụng! 🎉
