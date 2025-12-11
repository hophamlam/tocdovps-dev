# 🧪 Hướng Dẫn Test API trên Vercel - Best Practices

## 📋 Tổng Quan

Khi deploy Next.js API Routes lên Vercel, bạn có nhiều cách để test mà **KHÔNG CẦN** push code lên production. Vercel cung cấp **Preview Deployments** tự động cho mỗi branch và pull request.

## 🎯 Các Phương Pháp Test API

### 1. **Preview Deployments (Khuyến Nghị) ⭐**

**Cách hoạt động:**

- Mỗi khi bạn push code lên **bất kỳ branch nào**, Vercel tự động tạo một Preview Deployment
- Mỗi Preview Deployment có URL riêng để test
- Không ảnh hưởng đến production

**Workflow:**

```bash
# 1. Tạo feature branch
git checkout -b feature/new-api-endpoint

# 2. Code và commit
git add .
git commit -m "Add new API endpoint"

# 3. Push lên GitHub/GitLab
git push origin feature/new-api-endpoint

# 4. Vercel tự động deploy preview
# URL sẽ có dạng: https://vps-benchmark-nextjs-git-feature-new-api-endpoint-username.vercel.app
```

**Lợi ích:**

- ✅ Test ngay trên môi trường production-like
- ✅ Không cần merge vào main
- ✅ Có thể share URL với team để test
- ✅ Tự động sync với code mới nhất

### 2. **Pull Request Previews**

**Cách hoạt động:**

- Khi tạo Pull Request, Vercel tự động deploy preview
- Comment trên PR sẽ có link đến preview deployment
- Test trước khi merge vào main

**Workflow:**

```bash
# 1. Push feature branch
git push origin feature/new-api-endpoint

# 2. Tạo Pull Request trên GitHub
# 3. Vercel tự động comment preview URL vào PR
# 4. Test API trên preview URL
# 5. Nếu OK, merge vào main
```

### 3. **Staging Branch (Optional)**

Nếu bạn muốn có một môi trường staging cố định:

```bash
# 1. Tạo branch staging
git checkout -b staging
git push origin staging

# 2. Trong Vercel Dashboard:
# - Settings → Git → Production Branch: main
# - Settings → Git → Preview Branches: staging, develop, feature/*
# 3. Staging sẽ luôn có URL cố định để test
```

### 4. **Local Testing với Vercel CLI**

Test API ngay trên local trước khi push:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy preview locally
vercel dev
# Hoặc deploy preview lên Vercel
vercel
```

## 🔧 Setup Environment Variables cho Preview

### Trong Vercel Dashboard:

1. Vào **Project Settings → Environment Variables**
2. Add variables với các environments:
   - **Production**: Chỉ cho main branch
   - **Preview**: Cho tất cả preview deployments
   - **Development**: Cho local development

**Ví dụ:**

```
DATABASE_URL
├── Production: postgresql://prod-db...
├── Preview: postgresql://staging-db... (hoặc cùng prod)
└── Development: postgresql://local-db...

REPORT_TOKEN
├── Production: prod-token-123
├── Preview: preview-token-456
└── Development: dev-token-789
```

**Lưu ý:**

- Preview có thể dùng cùng database với production (nếu safe)
- Hoặc dùng database riêng để test an toàn hơn
- Luôn test với data thật nhưng không quan trọng

## 📝 Test Script Example

Tạo script để test API endpoints:

```bash
# scripts/test-api.sh
#!/bin/bash

# Lấy URL từ environment hoặc argument
API_URL=${1:-"http://localhost:3000"}

echo "🧪 Testing API: $API_URL"

# Test POST /api/benchmark/report
echo "Testing POST /api/benchmark/report..."
curl -X POST "$API_URL/api/benchmark/report" \
  -H "Content-Type: application/json" \
  -d '{
    "serverLabel": "test-server",
    "avgPingMs": 10,
    "downloadMbps": 100,
    "score": 8.5,
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

echo -e "\n✅ Test completed"
```

## 🚀 Automated Testing với GitHub Actions

Tự động test API khi có PR:

```yaml
# .github/workflows/test-api.yml
name: Test API on Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Wait for Vercel Preview
        uses: actions/github-script@v6
        with:
          script: |
            // Wait for Vercel comment with preview URL
            // Then extract URL and test

      - name: Test API Endpoints
        run: |
          # Extract preview URL from PR comment
          PREVIEW_URL=$(extract-vercel-url)

          # Run tests
          npm run test:api -- --url=$PREVIEW_URL
```

## 📊 Best Practices Checklist

### ✅ Trước khi Deploy:

- [ ] Test local với `npm run dev`
- [ ] Test với `vercel dev` để simulate Vercel environment
- [ ] Verify environment variables đã được set trong Vercel
- [ ] Check database connection (nếu dùng DB riêng cho preview)

### ✅ Khi Test trên Preview:

- [ ] Test tất cả API endpoints
- [ ] Test với valid và invalid payloads
- [ ] Test error handling
- [ ] Test rate limiting (nếu có)
- [ ] Test authentication (nếu có)
- [ ] Check logs trong Vercel Dashboard

### ✅ Sau khi Test:

- [ ] Review logs để tìm errors
- [ ] Verify data được lưu đúng (nếu có database)
- [ ] Test performance (response time)
- [ ] Document any issues found

## 🔍 Debugging trên Vercel Preview

### Xem Logs:

1. Vào Vercel Dashboard
2. Chọn deployment (preview)
3. Click vào **Functions** tab
4. Xem logs real-time

### Hoặc dùng Vercel CLI:

```bash
# Xem logs của deployment
vercel logs [deployment-url]

# Follow logs real-time
vercel logs --follow [deployment-url]
```

## 🎯 Recommended Workflow

### Workflow 1: Feature Development (Khuyến nghị)

```bash
# 1. Tạo feature branch
git checkout -b feature/add-new-endpoint

# 2. Develop và test local
npm run dev
# Test tại http://localhost:3000/api/...

# 3. Commit và push
git add .
git commit -m "Add new endpoint"
git push origin feature/add-new-endpoint

# 4. Vercel tự động deploy preview
# Copy preview URL từ Vercel Dashboard hoặc GitHub PR

# 5. Test trên preview
npm run test:api -- --url=https://preview-url.vercel.app

# 6. Nếu OK, tạo PR và merge
```

### Workflow 2: Quick Testing

```bash
# 1. Deploy preview nhanh với Vercel CLI
vercel

# 2. Test ngay trên preview URL được trả về
curl https://preview-url.vercel.app/api/benchmark/report

# 3. Nếu OK, push code lên GitHub
```

## 📚 Tài Liệu Tham Khảo

- [Vercel Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🚨 Common Issues & Solutions

### Issue: Preview không có environment variables

**Solution**:

- Check Vercel Dashboard → Environment Variables
- Đảm bảo đã set cho "Preview" environment
- Redeploy preview deployment

### Issue: Database connection failed trên preview

**Solution**:

- Check DATABASE_URL đã được set cho Preview
- Verify database allows connections từ Vercel IPs
- Check database credentials

### Issue: API response khác với local

**Solution**:

- Check environment variables
- Verify Next.js version match
- Check Vercel Functions logs để debug

---

**Tóm lại**: Bạn **KHÔNG CẦN** push lên production để test. Sử dụng Preview Deployments trên feature branches là cách tốt nhất! 🎉


