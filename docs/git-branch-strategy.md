# 🌿 Git Branch Strategy - Best Practices

## 📋 Phân Tích Workflow Hiện Tại Của Bạn

### Workflow Bạn Đề Xuất:

```
main (production)     → Deploy lên production
staging              → Dev branch, không quay lại main
                     → Merge staging → main khi muốn deploy
```

## ⚠️ Vấn Đề Với Workflow Này

### 1. **Staging Branch Sẽ Phát Triển Độc Lập**

- Nếu chỉ dev trên staging và không quay lại main
- Staging sẽ có nhiều commits mà main không có
- Khi merge staging → main, có thể gây conflict lớn
- Khó track được những gì đã deploy lên production

### 2. **Không Có Feature Isolation**

- Tất cả code đều dev trên staging
- Khó test từng feature riêng biệt
- Nếu một feature có bug, phải revert toàn bộ staging

### 3. **Khó Maintain**

- Không biết code nào đã được deploy
- Khó rollback nếu có vấn đề
- Khó review code trước khi merge

## ✅ Workflow Đề Xuất (Cải Thiện)

### **Option 1: GitHub Flow (Đơn Giản, Khuyến Nghị cho Solo Dev)**

```
main (production)     → Production, luôn stable
feature/*            → Feature branches
                     → Merge feature → main qua PR
```

**Workflow:**

```bash
# 1. Tạo feature branch từ main
git checkout main
git pull origin main
git checkout -b feature/benchmark-report-api

# 2. Develop và test
# ... code ...
git add .
git commit -m "Add benchmark report API"

# 3. Push và tạo PR
git push origin feature/benchmark-report-api
# Tạo Pull Request trên GitHub: feature/benchmark-report-api → main

# 4. Test trên Preview (Vercel tự động deploy preview cho PR)
# Test API trên preview URL

# 5. Nếu OK, merge PR vào main
# → Tự động deploy lên production
```

**Lợi ích:**

- ✅ Đơn giản, dễ hiểu
- ✅ Mỗi feature có branch riêng
- ✅ Dễ test và review
- ✅ Main luôn stable

### **Option 2: Git Flow (Phức Tạp Hơn, Phù Hợp Team)**

```
main (production)     → Production, chỉ merge từ release
develop              → Development integration branch
feature/*            → Feature branches
release/*            → Prepare release
hotfix/*             → Urgent fixes
```

**Workflow:**

```bash
# 1. Tạo feature branch từ develop
git checkout develop
git pull origin develop
git checkout -b feature/benchmark-report-api

# 2. Develop và test
# ... code ...
git add .
git commit -m "Add benchmark report API"

# 3. Push và tạo PR: feature → develop
git push origin feature/benchmark-report-api
# Tạo PR: feature/benchmark-report-api → develop

# 4. Test trên Preview
# Merge vào develop sau khi test OK

# 5. Khi muốn deploy production:
git checkout develop
git checkout -b release/v1.2.0
# Test kỹ trên release branch
# Tạo PR: release/v1.2.0 → main
```

**Lợi ích:**

- ✅ Có staging environment (develop)
- ✅ Tách biệt rõ ràng giữa dev và production
- ✅ Dễ quản lý releases
- ⚠️ Phức tạp hơn, cần discipline

### **Option 3: Hybrid (Cân Bằng - Khuyến Nghị Cho Bạn)**

```
main (production)     → Production
staging              → Staging environment (test trước khi prod)
feature/*            → Feature branches
```

**Workflow:**

```bash
# 1. Tạo feature branch từ main
git checkout main
git pull origin main
git checkout -b feature/benchmark-report-api

# 2. Develop và test local
# ... code ...
git add .
git commit -m "Add benchmark report API"

# 3. Push và test trên Preview
git push origin feature/benchmark-report-api
# Vercel tự động deploy preview
# Test API trên preview URL

# 4. Nếu OK, merge vào staging để test thêm
# Tạo PR: feature/benchmark-report-api → staging
# Test trên staging environment

# 5. Nếu staging OK, merge vào main
# Tạo PR: staging → main
# → Deploy lên production
```

**Lợi ích:**

- ✅ Có staging environment để test
- ✅ Mỗi feature có branch riêng
- ✅ Main luôn stable
- ✅ Dễ maintain và track

## 🎯 Workflow Khuyến Nghị Cho Dự Án Của Bạn

Dựa trên yêu cầu của bạn, tôi đề xuất **Option 3: Hybrid** với một số điều chỉnh:

### Branch Structure:

```
main              → Production (tocdovps.dev)
staging           → Staging (test.tocdovps.dev) - Optional
feature/*         → Feature branches (auto preview URLs)
fix/*             → Bug fixes
hotfix/*          → Urgent production fixes
```

### Workflow Chi Tiết:

#### **Scenario 1: Feature Development**

```bash
# 1. Tạo feature branch từ main
git checkout main
git pull origin main
git checkout -b feature/benchmark-report-api

# 2. Develop và test local
npm run dev
npm run test:api

# 3. Commit và push
git add .
git commit -m "feat: add benchmark report API endpoint"
git push origin feature/benchmark-report-api

# 4. Vercel tự động deploy preview
# Copy preview URL từ Vercel Dashboard

# 5. Test trên preview
npm run test:api -- https://preview-url.vercel.app

# 6. Nếu có staging, merge vào staging trước
git checkout staging
git pull origin staging
git merge feature/benchmark-report-api
git push origin staging
# Test trên staging environment

# 7. Nếu staging OK, merge vào main
# Tạo PR trên GitHub: staging → main (hoặc feature → main)
# Review và merge
# → Tự động deploy lên production
```

#### **Scenario 2: Bug Fix**

```bash
# 1. Tạo fix branch từ main
git checkout main
git checkout -b fix/benchmark-api-validation

# 2. Fix bug
# ... code ...

# 3. Test và push
git push origin fix/benchmark-api-validation

# 4. Test trên preview
# 5. Merge vào main qua PR
```

#### **Scenario 3: Hotfix (Urgent Production Fix)**

```bash
# 1. Tạo hotfix branch từ main
git checkout main
git checkout -b hotfix/critical-api-bug

# 2. Fix ngay
# ... code ...

# 3. Test và merge ngay vào main
# 4. Deploy production
# 5. Merge hotfix vào staging (nếu có)
```

## 📊 So Sánh Workflows

| Aspect                | Workflow Của Bạn | Option 1 (GitHub Flow) | Option 3 (Hybrid) |
| --------------------- | ---------------- | ---------------------- | ----------------- |
| **Đơn giản**          | ⭐⭐⭐           | ⭐⭐⭐⭐⭐             | ⭐⭐⭐⭐          |
| **Có Staging**        | ✅               | ❌                     | ✅                |
| **Feature Isolation** | ❌               | ✅                     | ✅                |
| **Dễ Maintain**       | ⚠️               | ✅                     | ✅                |
| **Phù hợp Solo Dev**  | ⚠️               | ✅                     | ✅                |
| **Phù hợp Team**      | ❌               | ⚠️                     | ✅                |

## 🔧 Setup Vercel cho Workflow Mới

### 1. Configure Branch Mapping trong Vercel:

```
Production Branch: main
Preview Branches: staging, feature/*, fix/*, hotfix/*
```

### 2. Custom Domain Mapping (nếu có):

```
main     → tocdovps.dev (production)
staging  → test.tocdovps.dev (staging)
feature/* → Auto preview URLs
```

### 3. Environment Variables:

```
Production:  main branch
Preview:     staging, feature/*, fix/*, hotfix/*
Development: local (.env.local)
```

## ✅ Best Practices

### 1. **Luôn Tạo Feature Branch Từ Main**

```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
```

### 2. **Test Trước Khi Merge**

- Test local với `npm run dev`
- Test trên preview deployment
- Test trên staging (nếu có)
- Chỉ merge vào main khi đã test kỹ

### 3. **Commit Messages Convention**

```bash
feat: add new API endpoint
fix: fix validation error
refactor: improve error handling
docs: update API documentation
```

### 4. **Pull Request Workflow**

- Tạo PR với description rõ ràng
- Link preview URL trong PR
- Review code trước khi merge
- Test trên preview trước khi approve

### 5. **Staging Branch Maintenance**

- Định kỳ sync staging với main: `git checkout staging && git merge main`
- Hoặc reset staging từ main nếu cần: `git checkout staging && git reset --hard main`

## 🚨 Lưu Ý Quan Trọng

### ❌ Tránh:

- Dev trực tiếp trên main
- Dev trực tiếp trên staging mà không có feature branches
- Merge staging → main mà không test
- Bỏ qua preview deployments

### ✅ Nên:

- Luôn tạo feature branch cho mỗi feature
- Test trên preview trước khi merge
- Sử dụng Pull Requests để review
- Giữ main branch luôn stable và deployable

## 📝 Tóm Tắt

**Workflow của bạn có thể cải thiện bằng cách:**

1. ✅ **Giữ main cho production** (OK)
2. ✅ **Có staging branch** (OK, nhưng nên dùng đúng cách)
3. ⚠️ **Không nên dev trực tiếp trên staging**
   - Thay vào đó: tạo feature branches
   - Merge feature → staging để test
   - Merge staging → main để deploy
4. ✅ **Sử dụng Pull Requests** để review và track changes

**Workflow đề xuất:**

```
feature/* → staging → main
         (preview)  (staging)  (production)
```

---

**Kết luận**: Workflow của bạn có ý tưởng đúng nhưng cần điều chỉnh. Sử dụng feature branches thay vì dev trực tiếp trên staging sẽ giúp code dễ maintain và test hơn! 🎉
