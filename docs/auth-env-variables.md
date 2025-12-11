# Environment Variables cho Authentication

## 📝 Required Variables

### Stack Auth Credentials

Sau khi provision Neon Auth, bạn sẽ nhận được các credentials sau:

```env
# Stack Auth Project ID (Public)
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id_here

# Stack Auth Publishable Client Key (Public)
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key_here

# Stack Auth Secret Server Key (Private - NEVER expose to client)
STACK_SECRET_SERVER_KEY=your_secret_key_here
```

### Existing Variables

```env
# Neon Database Connection String
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Report Token cho API benchmark
REPORT_TOKEN=your_report_token_here
```

## 🔐 Security Notes

### Public Variables (NEXT_PUBLIC_*)
- ✅ Có thể expose trong client-side code
- ✅ Safe để commit vào git (nhưng không bắt buộc)
- ✅ Accessible trong browser

### Private Variables
- ❌ **KHÔNG BAO GIỜ** expose trong client-side code
- ❌ **KHÔNG BAO GIỜ** commit vào git
- ✅ Chỉ sử dụng trong Server Components và API Routes

## 📋 Setup Checklist

### Local Development (.env.local)

1. Tạo file `.env.local` trong root directory
2. Copy các variables từ `.env.example` (nếu có)
3. Thêm Stack Auth credentials sau khi provision
4. Verify tất cả variables đã được set

```bash
# Example .env.local
NEXT_PUBLIC_STACK_PROJECT_ID=proj_xxxxx
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pk_xxxxx
STACK_SECRET_SERVER_KEY=sk_xxxxx
DATABASE_URL=postgresql://...
REPORT_TOKEN=your_token
```

### Production (Vercel)

1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Add từng variable:
   - `NEXT_PUBLIC_STACK_PROJECT_ID` (Production)
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` (Production)
   - `STACK_SECRET_SERVER_KEY` (Production)
   - `DATABASE_URL` (Production)
   - `REPORT_TOKEN` (Production)
3. Redeploy để apply changes

## 🔍 Verification

### Check Variables trong Code

```typescript
// Server-side (safe)
const secretKey = process.env.STACK_SECRET_SERVER_KEY;

// Client-side (only public vars)
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
```

### Runtime Check

```typescript
// lib/stack.ts
if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_STACK_PROJECT_ID is not set");
}

if (!process.env.STACK_SECRET_SERVER_KEY) {
  throw new Error("STACK_SECRET_SERVER_KEY is not set");
}
```

## 🚨 Common Issues

### Issue: "NEXT_PUBLIC_STACK_PROJECT_ID is not set"
**Solution**: 
- Check `.env.local` file exists
- Verify variable name (case-sensitive)
- Restart dev server sau khi thêm variables

### Issue: "STACK_SECRET_SERVER_KEY is not set"
**Solution**:
- Check `.env.local` file
- Verify không có typo
- Restart dev server

### Issue: Variables không work trong production
**Solution**:
- Check Vercel Environment Variables
- Verify environment (Production/Preview/Development)
- Redeploy application

## 📝 .env.example Template

Tạo file `.env.example` để team members biết cần variables gì:

```env
# Stack Auth Credentials
# Get these after provisioning Neon Auth
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# Neon Database
DATABASE_URL=

# API Security
REPORT_TOKEN=
```

**Lưu ý**: `.env.example` không chứa actual values, chỉ là template.

## 🔄 After Provisioning Neon Auth

Sau khi chạy `provision_neon_auth` tool, bạn sẽ nhận được:

1. **Project ID**: Thêm vào `NEXT_PUBLIC_STACK_PROJECT_ID`
2. **Publishable Client Key**: Thêm vào `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
3. **Secret Server Key**: Thêm vào `STACK_SECRET_SERVER_KEY`

Copy các values này vào `.env.local` và restart dev server.

---

**Security Best Practice**: Luôn sử dụng `.env.local` cho local development và Vercel Environment Variables cho production. Không bao giờ commit `.env.local` vào git.












