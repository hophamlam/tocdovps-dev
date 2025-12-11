# ✅ Staging Branch Setup Checklist

## 🎯 Trạng Thái Hiện Tại

- ✅ Staging branch đã được tạo từ main
- ⏳ Cần push lên GitHub
- ⏳ Cần configure Vercel

## 📝 Các Bước Cần Làm

### 1. Push Staging Branch Lên GitHub

```bash
# Bạn đang ở staging branch
# Push lên GitHub:
git push -u origin staging
```

Nếu gặp lỗi authentication, bạn có thể:
- Sử dụng SSH key (nếu đã setup)
- Hoặc push thủ công qua GitHub Desktop/Git GUI
- Hoặc setup GitHub CLI: `gh auth login`

### 2. Configure Vercel Dashboard

#### A. Branch Mapping

1. Vào **Vercel Dashboard** → Project `vps-benchmark-nextjs`
2. **Settings** → **Git**
3. Cấu hình:
   ```
   Production Branch: main
   Preview Branches: staging, feature/*, fix/*, hotfix/*
   ```

#### B. Environment Variables

1. **Settings** → **Environment Variables**
2. Đảm bảo các variables đã được set cho **Preview**:
   - `DATABASE_URL` → Set cho Preview environment
   - `REPORT_TOKEN` → Set cho Preview environment
   - Các variables khác nếu có

**Lưu ý**: Preview environment sẽ áp dụng cho staging và tất cả feature branches.

#### C. (Optional) Custom Domain cho Staging

Nếu muốn có domain cố định cho staging:

1. **Settings** → **Domains** → **Add Domain**
2. Nhập: `test.tocdovps.dev` (hoặc domain bạn muốn)
3. Configure:
   - **Branch**: `staging`
   - **Production**: `tocdovps.dev` (nếu chưa có)

4. **Setup DNS** trong domain provider:
   ```
   Type: CNAME
   Name: test
   Value: cname.vercel-dns.com
   ```

### 3. Verify Setup

Sau khi push staging và configure Vercel:

```bash
# Check branches
git branch -a

# Check staging branch status
git checkout staging
git status

# Test staging deployment
# Lấy URL từ Vercel Dashboard → Deployments
npm run test:api -- https://staging-deployment-url.vercel.app
```

## 🔄 Workflow Sau Khi Setup Xong

### Develop Feature:
```bash
# 1. Tạo feature branch
npm run git:new-feature feature-name

# 2. Develop và test local
npm run dev
npm run test:api

# 3. Push và test preview
git push origin feature/feature-name
# Test trên preview URL từ Vercel

# 4. Merge vào staging
git checkout staging
git merge feature/feature-name
git push origin staging
# Test trên staging

# 5. Deploy production
# Tạo PR: staging → main
# Merge → Auto deploy production
```

## ✅ Checklist

- [ ] Push staging branch lên GitHub: `git push -u origin staging`
- [ ] Configure Vercel branch mapping (Production: main, Preview: staging, feature/*)
- [ ] Setup environment variables cho Preview environment
- [ ] (Optional) Setup custom domain cho staging
- [ ] Verify staging deployment hoạt động
- [ ] Test API trên staging URL

## 📚 Tài Liệu

- Setup chi tiết: `docs/setup-staging-branch.md`
- Branch strategy: `docs/git-branch-strategy.md`
- Quick workflow: `docs/quick-branch-workflow.md`

---

**Lưu ý**: Staging branch đã được tạo local. Bạn chỉ cần push lên GitHub và configure Vercel là xong! 🚀

