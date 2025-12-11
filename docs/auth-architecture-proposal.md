# Đề Xuất Kiến Trúc Authentication cho VPS Benchmark Next.js

## 📋 Tổng Quan

Hệ thống authentication được đề xuất sử dụng **Stack Auth** tích hợp với **Neon Database**, cung cấp giải pháp auth hoàn chỉnh, bảo mật và dễ mở rộng cho ứng dụng VPS Benchmark.

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────┐
│   Next.js App   │
│  (Client/Server)│
└────────┬────────┘
         │
         ├─── Stack Auth SDK (@stackframe/stack)
         │    ├── Client Components (useUser, useStackApp)
         │    └── Server Components (stackServerApp.getUser)
         │
         ▼
┌─────────────────┐
│   Stack Auth    │
│   (External)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Neon Database  │
│  (neon_auth)    │
│  Schema Sync    │
└─────────────────┘
```

## 🎯 Các Tính Năng Chính

### 1. **Authentication Methods**

- ✅ Email/Password (Credentials)
- ✅ OAuth Providers (Google, GitHub, Discord)
- ✅ Magic Link (Passwordless)
- ✅ Social Login (Facebook, Twitter nếu cần)

### 2. **User Management**

- User registration và profile management
- Email verification
- Password reset flow
- Account deletion
- Session management

### 3. **Authorization & Access Control**

- Role-based access control (RBAC)
- Protected routes middleware
- API route protection
- Permission-based features

### 4. **Security Features**

- JWT token management
- Session refresh tokens
- CSRF protection
- Rate limiting
- Account lockout sau nhiều lần đăng nhập sai

## 📁 Cấu Trúc Thư Mục Đề Xuất

```
vps-benchmark-nextjs/
├── app/
│   ├── handler/
│   │   └── [...stack]/
│   │       └── page.tsx          # Stack Auth routes handler
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx          # Custom sign-in page (optional)
│   │   ├── sign-up/
│   │   │   └── page.tsx          # Custom sign-up page (optional)
│   │   └── profile/
│   │       └── page.tsx          # User profile page
│   ├── api/
│   │   └── users/
│   │       └── route.ts          # User management API
│   └── middleware.ts            # Auth middleware
├── components/
│   ├── auth/
│   │   ├── sign-in-form.tsx      # Custom sign-in form
│   │   ├── sign-up-form.tsx      # Custom sign-up form
│   │   ├── user-button.tsx       # User menu button
│   │   └── protected-route.tsx   # Protected route wrapper
│   └── layout/
│       └── header.tsx            # Updated với auth UI
├── lib/
│   ├── stack.ts                  # Stack Server App config
│   └── auth/
│       ├── middleware.ts         # Auth middleware logic
│       └── permissions.ts        # Permission checks
└── stack.ts                     # Stack configuration (auto-generated)
```

## 🔧 Các Bước Triển Khai

### Phase 1: Setup Stack Auth với Neon

1. **Provision Neon Auth**

   ```bash
   # Sử dụng MCP Neon tool để provision
   # Tạo schema neon_auth và sync với Stack Auth
   ```

2. **Cài đặt Dependencies**

   ```bash
   npm install @stackframe/stack
   ```

3. **Khởi tạo Stack Auth**

   ```bash
   npx @stackframe/init-stack . --no-browser
   ```

   Lệnh này sẽ tự động:

   - Thêm `@stackframe/stack` vào package.json
   - Tạo `stack.ts` với StackServerApp config
   - Wrap root layout với StackProvider và StackTheme
   - Tạo `app/loading.tsx` cho Suspense boundary
   - Tạo `app/handler/[...stack]/page.tsx` cho auth routes

4. **Cấu hình Environment Variables**
   ```env
   # .env.local
   NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
   STACK_SECRET_SERVER_KEY=your_secret_key
   ```

### Phase 2: Tích Hợp Auth vào UI

1. **Update Header Component**

   - Thêm UserButton khi user đã đăng nhập
   - Hiển thị Sign In/Sign Up buttons khi chưa đăng nhập
   - Tích hợp với i18n (VI/EN)

2. **Tạo Auth Components**

   - Custom SignIn component với shadcn UI
   - Custom SignUp component
   - UserButton với dropdown menu
   - Protected route wrapper

3. **Tạo Profile Page**
   - Hiển thị thông tin user
   - Form chỉnh sửa profile
   - Quản lý sessions
   - Account settings

### Phase 3: Protected Routes & Middleware

1. **Tạo Middleware**

   ```typescript
   // app/middleware.ts
   - Check authentication status
   - Redirect unauthenticated users
   - Protect specific routes
   ```

2. **Protected Route Patterns**

   ```typescript
   // Client Component
   const user = useUser({ or: "redirect" });

   // Server Component
   const user = await stackServerApp.getUser({ or: "redirect" });
   ```

3. **API Route Protection**
   ```typescript
   // app/api/protected/route.ts
   const user = await stackServerApp.getUser();
   if (!user)
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   ```

### Phase 4: Database Schema Extensions

1. **User Profile Table**

   ```sql
   CREATE TABLE user_profiles (
     id UUID PRIMARY KEY REFERENCES neon_auth.users(id),
     display_name VARCHAR(255),
     avatar_url TEXT,
     bio TEXT,
     preferences JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **User Roles & Permissions**

   ```sql
   CREATE TABLE user_roles (
     user_id UUID REFERENCES neon_auth.users(id),
     role VARCHAR(50) NOT NULL,
     granted_at TIMESTAMPTZ DEFAULT NOW(),
     PRIMARY KEY (user_id, role)
   );

   CREATE TABLE permissions (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) UNIQUE NOT NULL,
     description TEXT
   );
   ```

3. **User Sessions Tracking** (nếu cần)
   ```sql
   CREATE TABLE user_sessions (
     id UUID PRIMARY KEY,
     user_id UUID REFERENCES neon_auth.users(id),
     ip_address INET,
     user_agent TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     expires_at TIMESTAMPTZ NOT NULL
   );
   ```

### Phase 5: Advanced Features

1. **OAuth Providers Setup**

   - Google OAuth
   - GitHub OAuth
   - Discord OAuth

2. **Email Verification Flow**

   - Send verification email
   - Verify email endpoint
   - Resend verification

3. **Password Reset Flow**

   - Request reset password
   - Reset password với token
   - Token expiration handling

4. **Role-Based Access Control**
   - Admin role
   - Moderator role
   - User role
   - Permission checks

## 🎨 UI/UX Design với shadcn UI

### Components Sử Dụng

1. **Sign In Page**

   - Card component cho form container
   - Input components cho email/password
   - Button components cho actions
   - Alert components cho error messages
   - Separator cho OAuth options

2. **User Button**

   - DropdownMenu component
   - Avatar component
   - Badge cho role display
   - Dialog cho account settings

3. **Profile Page**
   - Form components
   - Tabs cho different sections
   - Toast notifications cho success/error

### Theme Integration

- Sử dụng orange theme từ shadcn/ui themes
- Dark mode support
- Responsive design

## 🔐 Security Best Practices

1. **Environment Variables**

   - Không commit secrets vào git
   - Sử dụng .env.local cho local development
   - Sử dụng Vercel Environment Variables cho production

2. **API Security**

   - Rate limiting trên auth endpoints
   - CSRF protection
   - Input validation với Zod
   - SQL injection prevention (Stack Auth handles this)

3. **Session Management**

   - Secure cookie settings
   - Token refresh mechanism
   - Session timeout
   - Logout on all devices

4. **Password Security**
   - Minimum password requirements
   - Password hashing (Stack Auth handles)
   - Account lockout sau failed attempts

## 📊 Database Schema Overview

```
neon_auth schema (managed by Stack Auth):
├── users (synced with Stack Auth)
│   ├── id (UUID)
│   ├── primary_email
│   ├── display_name
│   └── ...

public schema (custom):
├── user_profiles
│   ├── id → neon_auth.users.id
│   ├── display_name
│   ├── avatar_url
│   └── preferences
├── user_roles
│   ├── user_id → neon_auth.users.id
│   └── role
└── permissions
    ├── id
    ├── name
    └── description
```

## 🌐 i18n Integration

Thêm translations cho auth flows:

```typescript
// lib/i18n/dictionary.ts
auth: {
  signIn: {
    title: "Đăng nhập",
    email: "Email",
    password: "Mật khẩu",
    submit: "Đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    noAccount: "Chưa có tài khoản?",
    signUp: "Đăng ký",
  },
  signUp: {
    title: "Đăng ký",
    // ...
  },
  profile: {
    title: "Hồ sơ",
    // ...
  },
  // ...
}
```

## 🚀 Deployment Checklist

- [ ] Provision Neon Auth
- [ ] Setup Stack Auth credentials
- [ ] Configure OAuth providers (nếu cần)
- [ ] Setup environment variables trên Vercel
- [ ] Test authentication flows
- [ ] Test protected routes
- [ ] Test API route protection
- [ ] Verify email sending (nếu có)
- [ ] Test OAuth flows
- [ ] Performance testing
- [ ] Security audit

## 📝 API Endpoints Đề Xuất

### Authentication (handled by Stack Auth)

- `POST /handler/sign-in` - Sign in
- `POST /handler/sign-up` - Sign up
- `POST /handler/sign-out` - Sign out
- `POST /handler/reset-password` - Reset password
- `POST /handler/verify-email` - Verify email

### User Management (custom)

- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user
- `GET /api/users/me/profile` - Get user profile
- `PATCH /api/users/me/profile` - Update user profile
- `DELETE /api/users/me` - Delete account

### Admin (nếu cần)

- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🧪 Testing Strategy

1. **Unit Tests**

   - Auth utility functions
   - Permission checks
   - Middleware logic

2. **Integration Tests**

   - Sign in flow
   - Sign up flow
   - Protected route access
   - API route protection

3. **E2E Tests**
   - Complete auth flow
   - Profile update flow
   - Password reset flow

## 📚 Tài Liệu Tham Khảo

- [Stack Auth Documentation](https://docs.stack-auth.com)
- [Neon Auth Integration](https://neon.tech/docs/auth)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🎯 Next Steps

1. Review và approve kiến trúc này
2. Provision Neon Auth
3. Setup Stack Auth
4. Implement từng phase theo thứ tự
5. Test và deploy

---

**Lưu ý**: Tài liệu này là đề xuất ban đầu. Có thể điều chỉnh dựa trên requirements cụ thể và feedback.











