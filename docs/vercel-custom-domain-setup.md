# 🌐 Hướng Dẫn Setup Custom Domain cho Branch Dev trên Vercel

## 📋 Tổng Quan

Bạn muốn setup custom domain `test.tocdovps.dev` cho branch `dev` để có thể test API dễ dàng hơn thay vì dùng preview URL dài.

## 🎯 Mục Tiêu

- Branch `dev` → Deploy lên `test.tocdovps.dev`
- Branch `main` → Deploy lên `tocdovps.dev` (production)
- Các branch khác → Vẫn dùng preview URLs tự động

## 📝 Các Bước Setup

### Bước 1: Tạo Branch `dev` (nếu chưa có)

```bash
# Tạo và switch sang branch dev
git checkout -b dev

# Push lên GitHub
git push origin dev
```

### Bước 2: Add Custom Domain trong Vercel Dashboard

1. **Vào Vercel Dashboard** → Chọn project `vps-benchmark-nextjs`

2. **Settings** → **Domains**

3. **Add Domain** → Nhập `test.tocdovps.dev`

4. **Configure Domain**:
   - Chọn **Branch**: `dev`
   - **Production Domain**: `tocdovps.dev` (nếu chưa có)
   - **Preview Domain**: `test.tocdovps.dev` → Map to branch `dev`

### Bước 3: Configure DNS Records

Bạn cần thêm DNS records trong domain provider (ví dụ: Cloudflare, Namecheap, etc.)

#### Option 1: CNAME Record (Khuyến nghị)

```
Type: CNAME
Name: test
Value: cname.vercel-dns.com
TTL: Auto (hoặc 3600)
```

#### Option 2: A Record (nếu CNAME không được hỗ trợ)

Vercel sẽ cung cấp IP addresses trong Dashboard. Thêm A records:

```
Type: A
Name: test
Value: [IP từ Vercel]
TTL: Auto
```

### Bước 4: Verify Domain trong Vercel

1. Sau khi add domain, Vercel sẽ tự động verify
2. Nếu DNS chưa propagate, đợi 5-15 phút
3. Check status trong Vercel Dashboard → Domains

### Bước 5: Configure Branch Mapping

Trong Vercel Dashboard:

1. **Settings** → **Git**
2. **Production Branch**: `main`
3. **Preview Branches**: 
   - `dev` → Map to `test.tocdovps.dev`
   - `feature/*` → Auto preview URLs
   - `staging` → Auto preview URLs (nếu có)

## 🔧 Alternative: Sử dụng Vercel CLI

Nếu bạn muốn setup bằng CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add domain cho branch dev
vercel domains add test.tocdovps.dev

# Configure domain mapping
vercel domains ls
```

## 📊 Branch Strategy Đề Xuất

### Branch Naming Convention:

```
main              → Production (tocdovps.dev)
dev               → Staging/Testing (test.tocdovps.dev)
feature/*         → Feature branches (auto preview URLs)
fix/*             → Bug fixes (auto preview URLs)
hotfix/*          → Urgent fixes (auto preview URLs)
```

### Workflow:

```bash
# 1. Feature development
git checkout -b feature/benchmark-report-api
# ... code ...
git push origin feature/benchmark-report-api
# → Auto preview URL: https://project-git-feature-benchmark-report-api.vercel.app

# 2. Test trên preview, nếu OK → merge vào dev
git checkout dev
git merge feature/benchmark-report-api
git push origin dev
# → Auto deploy lên test.tocdovps.dev

# 3. Test trên test.tocdovps.dev, nếu OK → merge vào main
git checkout main
git merge dev
git push origin main
# → Auto deploy lên tocdovps.dev (production)
```

## 🎯 Về Branch Naming: `feature/benchmark-report-api`

**Gợi ý của bạn rất tốt!** Tuy nhiên, có một số lưu ý:

### ✅ Nên dùng nếu:
- Đây là feature mới hoặc cải thiện lớn cho API
- Bạn muốn tách riêng để review kỹ trước khi merge
- Feature có thể mất nhiều commits

### ⚠️ Cân nhắc:
- Nếu chỉ là bug fix nhỏ → dùng `fix/benchmark-report-api`
- Nếu là refactor → dùng `refactor/benchmark-report-api`
- Nếu là improvement nhỏ → có thể commit trực tiếp vào `dev`

### 📝 Branch Naming Best Practices:

```
feature/benchmark-report-api     ✅ Feature mới
fix/benchmark-report-validation  ✅ Bug fix
refactor/benchmark-api-structure ✅ Refactor
improve/benchmark-api-error-handling ✅ Improvement
docs/api-testing-guide           ✅ Documentation
```

## 🔍 Verify Setup

### Test Domain:

```bash
# Test API endpoint
curl https://test.tocdovps.dev/api/benchmark/report \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"payload": {...}}'

# Hoặc dùng test script
npm run test:api -- https://test.tocdovps.dev
```

### Check Deployment:

1. Vào Vercel Dashboard → Deployments
2. Verify branch `dev` đang deploy lên `test.tocdovps.dev`
3. Check logs nếu có lỗi

## 🚨 Troubleshooting

### Issue: Domain không resolve

**Solution**:
- Check DNS records đã được add đúng
- Đợi DNS propagation (có thể mất 24-48h)
- Verify domain trong Vercel Dashboard

### Issue: Domain verify failed

**Solution**:
- Check DNS records match với Vercel requirements
- Verify domain ownership trong Vercel
- Contact Vercel support nếu cần

### Issue: Branch không auto-deploy

**Solution**:
- Check Git integration trong Vercel Settings
- Verify branch name match với configuration
- Check deployment logs

## 📚 Tài Liệu Tham Khảo

- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Vercel Branch Deployments](https://vercel.com/docs/concepts/deployments/branch-deployments)
- [Vercel DNS Configuration](https://vercel.com/docs/concepts/projects/domains/domain-verification)

---

**Lưu ý**: Sau khi setup, mỗi khi push code lên branch `dev`, Vercel sẽ tự động deploy lên `test.tocdovps.dev`! 🎉

