# Admin Route Configuration Guide

## 🔒 Important: Folder Name MUST Match Environment Variable

### Critical Requirement

The admin folder name in your filesystem **MUST exactly match** the value of `ADMIN_ROUTE_SECRET` in your `.env.local` file.

**Why?**

- Next.js creates routes based on **physical folder names** (file-based routing)
- Middleware protects routes based on the **environment variable value**
- If they don't match = **SECURITY VULNERABILITY** (admin panel will be unprotected!)

---

## 🏗️ Current Configuration

**Default Setup:**

- **Folder:** `app/admin/`
- **Environment Variable:** `ADMIN_ROUTE_SECRET=admin`
- **Access URL:** `http://localhost:3000/admin`

---

## 🔐 Security Best Practices

### For Production

**Recommended:** Use a unique, hard-to-guess route name for better security.

**Steps:**

1. **Rename the folder:**

   ```bash
   mv app/admin app/my-unique-secret-admin-2024
   ```

2. **Update `.env.local`:**

   ```env
   ADMIN_ROUTE_SECRET=my-unique-secret-admin-2024
   ```

3. **Update `.env.production` (Vercel/deployment):**

   ```env
   ADMIN_ROUTE_SECRET=my-unique-secret-admin-2024
   ```

4. **Access your admin panel:**
   ```
   https://yourdomain.com/my-unique-secret-admin-2024
   ```

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Mismatch Between Folder and Env Variable

```
Folder: app/admin/
Env Variable: ADMIN_ROUTE_SECRET=admin_secret_key
```

**Result:**

- Route `/admin` exists (from folder) but is **NOT PROTECTED**
- Middleware tries to protect `/admin_secret_key` which doesn't exist
- Anyone can access `/admin` without authentication! 🚨

### ❌ Mistake 2: Forgetting to Update Production Env

```
Local: ADMIN_ROUTE_SECRET=admin
Production: ADMIN_ROUTE_SECRET=my-secret-route (but folder is still named 'admin')
```

**Result:**

- Works locally but **FAILS in production**
- Middleware protects wrong route
- Admin panel inaccessible or unprotected

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Folder name matches `ADMIN_ROUTE_SECRET` value
- [ ] `.env.local` updated
- [ ] `.env.production` or Vercel env vars updated (if using custom name)
- [ ] Can access admin at correct URL
- [ ] Login redirects work correctly
- [ ] Direct access to admin pages requires authentication
- [ ] Test in incognito/private browsing mode

---

## 🧪 Testing

### Test Authentication Protection

1. **Open incognito/private browsing**
2. **Try accessing admin route directly:**
   ```
   http://localhost:3000/admin
   ```
3. **Expected:** Should redirect to `/admin/login`
4. **Try accessing admin subpages:**
   ```
   http://localhost:3000/admin/projects
   ```
5. **Expected:** Should redirect to `/admin/login?redirectTo=/admin/projects`

### Test After Login

1. **Login with valid credentials**
2. **Should redirect to:** `/admin` (dashboard)
3. **Try accessing login page while authenticated:**
   ```
   http://localhost:3000/admin/login
   ```
4. **Expected:** Should redirect to `/admin` (dashboard)

---

## 📝 Migration from Old Setup

If you previously used a different folder name (e.g., `admin`):

### Steps to Migrate:

1. **Rename folder:**

   ```bash
   mv app/admin app/admin
   ```

2. **Update environment variables:**

   ```env
   # .env.local
   ADMIN_ROUTE_SECRET=admin
   ```

3. **Update any hardcoded references in code** (if any):

   ```typescript
   // ❌ Before
   router.push("/admin/projects");

   // ✅ After
   const adminRoute = process.env.ADMIN_ROUTE_SECRET || "admin";
   router.push(`/${adminRoute}/projects`);
   ```

4. **Test thoroughly:**
   - Run `pnpm dev`
   - Access admin panel
   - Test login/logout
   - Test protected routes

5. **Update deployment:**
   - Push changes to repository
   - Update environment variables in Vercel/hosting platform
   - Redeploy

---

## 🔍 How It Works

### File-Based Routing (Next.js)

```
app/
├── admin/           ← Creates route: /admin
│   ├── page.tsx     ← URL: /admin
│   ├── login/
│   │   └── page.tsx ← URL: /admin/login
│   └── projects/
│       └── page.tsx ← URL: /admin/projects
```

### Middleware Protection

```typescript
// middleware.ts
const adminRoute = process.env.ADMIN_ROUTE_SECRET || "admin";

// If path starts with `/${adminRoute}`, check authentication
if (pathname.startsWith(`/${adminRoute}`)) {
  // Check if user is authenticated
  // If not, redirect to login
}
```

### Critical: They Must Match!

```
✅ CORRECT:
Folder: app/admin/
Env: ADMIN_ROUTE_SECRET=admin
Result: /admin is protected ✓

❌ WRONG:
Folder: app/admin/
Env: ADMIN_ROUTE_SECRET=admin
Result: /admin exists but NOT PROTECTED! ✗
Result: /admin is protected but DOESN'T EXIST! ✗
```

---

## 📚 Related Documentation

- [README.md](../README.md) - Project overview
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Full documentation
- [MIDDLEWARE_ARCHITECTURE.md](./MIDDLEWARE_ARCHITECTURE.md) - Middleware details
- [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) - Security considerations
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

**Last Updated:** February 13, 2026  
**Status:** ✅ Configuration Updated
