# ⚡ Quick Guide: Test API trên Vercel Preview

## 🚀 Cách Nhanh Nhất

### Option 1: Test trên Feature Branch (Khuyến nghị)

```bash
# 1. Tạo feature branch
git checkout -b feature/test-api

# 2. Code và commit
git add .
git commit -m "Add new API feature"

# 3. Push lên GitHub
git push origin feature/test-api

# 4. Vào Vercel Dashboard → Deployments
# Copy preview URL (có dạng: https://project-git-feature-test-api.vercel.app)

# 5. Test API
npm run test:api -- https://project-git-feature-test-api.vercel.app
```

### Option 2: Test Local trước

```bash
# 1. Start dev server
npm run dev

# 2. Test local (terminal khác)
npm run test:api

# 3. Nếu OK, push lên GitHub để test trên preview
```

### Option 3: Deploy Preview nhanh với Vercel CLI

```bash
# 1. Install Vercel CLI (nếu chưa có)
npm i -g vercel

# 2. Login
vercel login

# 3. Link project (lần đầu)
vercel link

# 4. Deploy preview
vercel

# 5. Copy URL được trả về và test
npm run test:api -- https://preview-url.vercel.app
```

## 📝 Test Script Usage

```bash
# Test local (default: http://localhost:3000)
npm run test:api

# Test preview deployment
npm run test:api -- https://your-preview-url.vercel.app

# Hoặc dùng trực tiếp
./scripts/test-api.sh https://your-preview-url.vercel.app
```

## ✅ Checklist

- [ ] Code đã được test local
- [ ] Environment variables đã được set trong Vercel (Preview)
- [ ] Push code lên feature branch
- [ ] Copy preview URL từ Vercel Dashboard
- [ ] Chạy test script với preview URL
- [ ] Review logs nếu có lỗi
- [ ] Merge vào main nếu test pass

## 🔍 Xem Logs

```bash
# Xem logs trên Vercel Dashboard
# Hoặc dùng CLI:
vercel logs [deployment-url] --follow
```

---

**Lưu ý**: Bạn KHÔNG CẦN push lên production để test! Preview deployments là cách tốt nhất! 🎉



