# ⚡ Quick Reference: Branch Workflow

## 🎯 Workflow Khuyến Nghị (Hybrid)

```
main (production)     → tocdovps.dev
staging               → test.tocdovps.dev (optional)
feature/*             → Auto preview URLs
```

## 📝 Commands Cheat Sheet

### Tạo Feature Branch
```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Tạo feature branch
git checkout -b feature/benchmark-report-api

# 3. Develop và test local
npm run dev
npm run test:api

# 4. Commit và push
git add .
git commit -m "feat: add benchmark report API"
git push origin feature/benchmark-report-api

# 5. Test trên preview (Vercel tự động deploy)
# Copy preview URL từ Vercel Dashboard
npm run test:api -- https://preview-url.vercel.app
```

### Merge vào Staging (nếu có)
```bash
# 1. Tạo PR: feature/benchmark-report-api → staging
# Hoặc merge trực tiếp:
git checkout staging
git pull origin staging
git merge feature/benchmark-report-api
git push origin staging

# 2. Test trên staging environment
```

### Deploy Production
```bash
# 1. Tạo PR: staging → main (hoặc feature → main)
# 2. Review và merge trên GitHub
# 3. Vercel tự động deploy lên production
```

## 🔄 Workflow Diagram

```
┌─────────────┐
│   main      │ ← Production (tocdovps.dev)
└──────┬──────┘
       │
       │ merge (sau khi test)
       │
┌──────▼──────┐
│  staging    │ ← Staging (test.tocdovps.dev)
└──────┬──────┘
       │
       │ merge (sau khi test preview)
       │
┌──────▼──────┐
│ feature/*  │ ← Preview URLs (auto)
└────────────┘
```

## ✅ Checklist

### Khi Tạo Feature:
- [ ] Tạo branch từ main: `git checkout -b feature/name`
- [ ] Test local: `npm run dev && npm run test:api`
- [ ] Commit với message rõ ràng
- [ ] Push và test trên preview
- [ ] Tạo PR để review

### Khi Merge vào Staging:
- [ ] Test đã pass trên preview
- [ ] Code đã được review
- [ ] Merge vào staging
- [ ] Test trên staging environment

### Khi Deploy Production:
- [ ] Test đã pass trên staging
- [ ] Không có breaking changes
- [ ] Environment variables đã được set
- [ ] Merge vào main
- [ ] Verify production deployment

## 🚨 Lưu Ý

### ❌ KHÔNG:
- Dev trực tiếp trên main
- Dev trực tiếp trên staging
- Merge mà không test
- Bỏ qua preview deployments

### ✅ NÊN:
- Luôn tạo feature branch
- Test trên preview trước
- Sử dụng Pull Requests
- Giữ main luôn stable

## 📚 Xem Thêm

- Chi tiết: `docs/git-branch-strategy.md`
- Test API: `docs/vercel-api-testing-guide.md`

