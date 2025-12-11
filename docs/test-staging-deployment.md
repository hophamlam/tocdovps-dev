# 🧪 Test Staging Deployment - Hướng Dẫn

## ✅ Đã Setup

- ✅ Environment variables đã được set cho Production và Preview
- ✅ Preview database URL riêng biệt
- ✅ Đang ở staging branch

## 🚀 Các Bước Test

### 1. Commit và Push Lên Staging

Bạn có nhiều files mới (docs, scripts) chưa commit. Có 2 cách:

#### Option A: Commit Tất Cả Files (Khuyến nghị)

```bash
# Đang ở staging branch
git add .

# Commit với message rõ ràng
git commit -m "docs: add staging setup, git workflow, and API testing documentation

- Add staging branch setup guide
- Add git workflow helper scripts
- Add API testing scripts and documentation
- Add branch strategy documentation"

# Push lên GitHub
git push origin staging
```

#### Option B: Chỉ Commit Docs và Scripts (Nếu không muốn commit code changes)

```bash
# Chỉ add docs và scripts
git add docs/ scripts/ .github/

# Commit
git commit -m "docs: add staging setup and workflow documentation"

# Push
git push origin staging
```

### 2. Monitor Deployment trên Vercel

Sau khi push:

1. Vào **Vercel Dashboard** → Project `tocdovps.dev`
2. Vào **Deployments** tab
3. Tìm deployment mới nhất cho `staging` branch
4. Monitor:
   - Status: "Building" → "Ready"
   - Domain: `staging.tocdovps.dev`
   - Environment: Preview (sẽ dùng Preview database)

### 3. Verify Environment Variables

Sau khi deployment ready, verify:

1. Vào deployment → **Functions** tab
2. Check logs để verify:
   - Database connection thành công
   - Environment variables đã được load đúng

Hoặc test trực tiếp:

```bash
# Test API endpoint
curl -X POST https://staging.tocdovps.dev/api/benchmark/report \
  -H "Content-Type: application/json" \
  -d '{
    "serverLabel": "test-staging-deployment",
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

### 4. Test API với Script

```bash
# Test API trên staging
npm run test:api -- https://staging.tocdovps.dev
```

Script sẽ test:
- ✅ POST /api/benchmark/report với valid payload
- ✅ Invalid JSON handling
- ✅ Missing required fields
- ✅ Invalid data validation
- ✅ Visibility header handling

### 5. Verify Database Connection

Staging sẽ dùng **Preview database** (khác với production):

1. Test API để tạo record
2. Check Preview database để verify:
   - Record đã được tạo
   - Data đúng format
   - Không ảnh hưởng đến Production database

## 🔍 Verify Checklist

Sau khi push và deployment ready:

- [ ] Deployment status là "Ready"
- [ ] Domain `staging.tocdovps.dev` hoạt động
- [ ] API endpoint trả về response (không lỗi database)
- [ ] Test script pass tất cả tests
- [ ] Data được lưu vào Preview database (không vào Production)
- [ ] Logs không có errors

## 🐛 Troubleshooting

### Issue: Deployment failed

**Check:**
1. Build logs trong Vercel Dashboard
2. Environment variables đã được set chưa
3. Database connection string đúng chưa

**Solution:**
- Check build logs để tìm lỗi cụ thể
- Verify environment variables trong Settings
- Test database connection string

### Issue: API trả về database error

**Check:**
1. Preview database URL đúng chưa
2. Database có cho phép connections từ Vercel IPs không
3. Database credentials đúng chưa

**Solution:**
- Verify DATABASE_URL trong Preview environment
- Check database firewall settings
- Test connection string local trước

### Issue: Domain không hoạt động

**Check:**
1. DNS đã propagate chưa
2. Domain đã được verify trong Vercel chưa
3. Deployment đã ready chưa

**Solution:**
```bash
# Check DNS
dig staging.tocdovps.dev

# Hoặc
nslookup staging.tocdovps.dev
```

## 📊 Expected Results

Sau khi test thành công:

1. **Deployment**: Status "Ready", domain `staging.tocdovps.dev` hoạt động
2. **API**: Trả về 201 Created với id và created_at
3. **Database**: Record được lưu vào Preview database
4. **Test Script**: Tất cả tests pass

## 🎯 Next Steps Sau Khi Test Thành Công

1. ✅ Staging environment hoạt động tốt
2. ✅ Bắt đầu develop trên feature branches
3. ✅ Test trên preview URLs
4. ✅ Merge vào staging để test
5. ✅ Merge vào main để deploy production

## 📚 Commands Summary

```bash
# 1. Commit và push
git add .
git commit -m "docs: add staging setup documentation"
git push origin staging

# 2. Monitor deployment trên Vercel Dashboard

# 3. Test API
npm run test:api -- https://staging.tocdovps.dev

# 4. Check logs (nếu cần)
# Vào Vercel Dashboard → Deployments → Functions → Logs
```

---

**Lưu ý**: Sau khi push, Vercel sẽ tự động deploy staging. Đợi deployment ready (thường 1-2 phút) rồi test API! 🚀

