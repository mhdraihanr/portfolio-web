# 🛡️ IP Whitelist Configuration Guide

Panduan lengkap untuk mengkonfigurasi IP Whitelist pada admin panel.

---

## 📖 Apa itu IP Whitelist?

**IP Whitelist** adalah daftar alamat IP yang diizinkan untuk mengakses admin panel. Jika diaktifkan, hanya IP yang ada di list yang bisa mengakses admin routes.

### Benefits:

- ✅ Extra layer security di atas authentication
- ✅ Prevent unauthorized access dari lokasi yang tidak diketahui
- ✅ Cocok untuk production environment
- ✅ Mudah diatur via environment variable

---

## 🔍 Cara Cek IP Address Anda

### **Method 1: Using Website (Paling Mudah)**

1. Buka browser
2. Visit: [https://whatismyipaddress.com/](https://whatismyipaddress.com/)
3. Copy angka di **IPv4** (contoh: `203.0.113.45`)

### **Method 2: Using Command Line**

**Windows (PowerShell):**

```powershell
# Cara 1
(Invoke-WebRequest -Uri "https://api.ipify.org").Content

# Cara 2
curl ifconfig.me

# Cara 3
curl api.ipify.org
```

**Windows (CMD):**

```cmd
curl ifconfig.me
curl api.ipify.org
```

**Mac/Linux (Terminal):**

```bash
# Cara 1
curl ifconfig.me

# Cara 2
curl api.ipify.org

# Cara 3
curl https://checkip.amazonaws.com

# Cara 4
dig +short myip.opendns.com @resolver1.opendns.com
```

### **Method 3: Using Browser Console**

1. Buka browser console (F12)
2. Paste code ini:

```javascript
fetch("https://api.ipify.org?format=json")
  .then((res) => res.json())
  .then((data) => console.log("Your IP:", data.ip));
```

---

## ⚙️ Cara Mengkonfigurasi IP Whitelist

### **Step 1: Dapatkan IP Address Anda**

Gunakan salah satu method di atas untuk mendapatkan IP address Anda.

**Contoh hasil:**

```
203.0.113.45
```

### **Step 2: Tambahkan ke `.env.local`**

Edit file `.env.local` di root project:

#### **Option A: Disable Whitelist (Allow All IPs) - Default & Recommended**

```env
# Allow all IPs - no restriction (prevents needing redeploy when IP changes)
ADMIN_IP_WHITELIST=
```

Atau hapus line ini sepenuhnya.

#### **Option B: Single IP (Your IP Only)**

```env
# Only allow specific IP
ADMIN_IP_WHITELIST=203.0.113.45
```

#### **Option C: Multiple IPs (Comma-separated)**

```env
# Allow multiple IPs
ADMIN_IP_WHITELIST=203.0.113.45,192.168.1.100,198.51.100.30
```

**Format:**

- No spaces between IPs
- Use comma (`,`) as separator
- IPv4 format only

### **Step 3: Restart Development Server**

```bash
# Stop server (Ctrl+C)
# Start again
pnpm dev
```

### **Step 4: Test Access**

1. **From whitelisted IP:** Should work normally ✅
2. **From non-whitelisted IP:** Will see HTTP 403 error ❌

---

## 🧪 Testing IP Whitelist

### **Test 1: With Empty Whitelist (Disabled)**

```env
ADMIN_IP_WHITELIST=
```

**Expected:**

- ✅ All IPs can access admin panel
- ✅ No restrictions

### **Test 2: With Your IP**

```env
ADMIN_IP_WHITELIST=203.0.113.45
```

**Expected:**

- ✅ Your IP can access (if matches)
- ❌ Other IPs get 403 error

**Error Response:**

```json
{
  "error": "Access Denied",
  "message": "Your IP address is not authorized to access this admin panel. Please contact the administrator."
}
```

### **Test 3: Using Incognito/VPN**

Jika Anda pakai VPN atau mobile data, IP address akan berbeda!

```
Regular IP: 203.0.113.45
VPN IP:     198.51.100.88  ← Will be blocked if not in whitelist
```

---

## 🚀 Production Setup

### **Recommended Configuration:**

```env
# .env.production (Vercel/Hosting)

# Use obscure admin route
ADMIN_ROUTE_SECRET=my-secret-admin-2024

# Allow specific IPs only
ADMIN_IP_WHITELIST=your-office-ip,your-home-ip,team-member-ip

# Example:
ADMIN_IP_WHITELIST=203.0.113.45,192.168.1.100,198.51.100.30
```

### **Where to Add in Vercel:**

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add `ADMIN_IP_WHITELIST` with your IP(s)
5. Redeploy

---

## ⚠️ Important Notes

### **Dynamic IPs**

Jika ISP Anda menggunakan **dynamic IP** (berubah-ubah):

**Symptom:**

- Kemarin bisa akses, hari ini tiba-tiba 403 ❌
- IP address berubah setelah restart modem

**Solutions:**

1. **Option A: Disable whitelist untuk development**

   ```env
   # Local development
   ADMIN_IP_WHITELIST=
   ```

2. **Option B: Use IP ranges (future enhancement)**

   ```env
   # Not yet supported - future feature
   ADMIN_IP_WHITELIST=203.0.113.0/24
   ```

3. **Option C: Update whitelist regularly**

   ```bash
   # Check current IP
   curl ifconfig.me

   # Update .env.local
   ADMIN_IP_WHITELIST=new-ip-address

   # Restart server
   pnpm dev
   ```

4. **Option D: Add IP range manually**
   ```env
   # Add multiple possible IPs dari ISP Anda
   ADMIN_IP_WHITELIST=203.0.113.45,203.0.113.46,203.0.113.47
   ```

### **VPN/Proxy Users**

Jika Anda use VPN:

- IP yang terdetect adalah VPN server IP, bukan IP asli Anda
- Matikan VPN saat setup, atau whitelist VPN IP

### **Mobile Network**

Jika akses dari mobile network (4G/5G):

- Mobile network IP berbeda dari WiFi/broadband
- Consider disable whitelist atau add mobile IP juga

### **Office/Corporate Network**

Jika akses dari kantor:

- Biasanya menggunakan NAT (shared IP)
- Satu IP untuk semua karyawan
- Contact IT untuk mendapatkan public IP kantor

---

## 🔒 Security Best Practices

### **Level 1: Development (Moderate Security)**

```env
ADMIN_ROUTE_SECRET=admin
ADMIN_IP_WHITELIST=           # Disabled
```

**Use case:** Local development

### **Level 2: Staging (Good Security)**

```env
ADMIN_ROUTE_SECRET=staging-admin-xyz
ADMIN_IP_WHITELIST=your-ip    # Single IP
```

**Use case:** Testing environment

### **Level 3: Production (High Security)**

```env
ADMIN_ROUTE_SECRET=prod-secret-route-2024
ADMIN_IP_WHITELIST=office-ip,home-ip  # Limited IPs
```

**Use case:** Production with rate limiting

### **Level 4: Enterprise (Maximum Security)**

```env
ADMIN_ROUTE_SECRET=very-unique-route-name-xyz-123
ADMIN_IP_WHITELIST=office-ip
# + 2FA enabled in Supabase
# + Rate limiting (already implemented)
# + VPN requirement
```

**Use case:** High-value production apps

---

## 🛠️ Troubleshooting

### **Problem: "Access Denied" Error**

**Cause:** Your IP is not in whitelist

**Solutions:**

1. Check your current IP: `curl ifconfig.me`
2. Verify IP in `.env.local` matches
3. Restart dev server
4. Check for typos in IP address

### **Problem: Whitelist Not Working**

**Cause:** Server not restarted or env not loaded

**Solutions:**

1. Stop server (Ctrl+C)
2. Verify `.env.local` has `ADMIN_IP_WHITELIST`
3. Restart: `pnpm dev`
4. Clear browser cache

### **Problem: IP Changes Frequently**

**Cause:** ISP uses dynamic IP

**Solutions:**

1. Disable whitelist: `ADMIN_IP_WHITELIST=`
2. Or contact ISP for static IP
3. Or use VPN with static IP

---

## 📊 Comparison: Security Methods

| Feature            | No Whitelist    | IP Whitelist      | IP + 2FA             |
| ------------------ | --------------- | ----------------- | -------------------- |
| **Ease of Setup**  | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Moderate | ⭐⭐ Complex         |
| **Security Level** | ⭐⭐ Basic      | ⭐⭐⭐⭐ Good     | ⭐⭐⭐⭐⭐ Excellent |
| **Mobile Access**  | ✅ Yes          | ⚠️ Needs setup    | ✅ Yes               |
| **Dynamic IP**     | ✅ No issue     | ❌ Issues         | ✅ No issue          |
| **Maintenance**    | ✅ None         | ⚠️ Update IPs     | ⚠️ Update codes      |

---

## 📚 Related Documentation

- [ADMIN_ROUTE_CONFIG.md](./ADMIN_ROUTE_CONFIG.md) - Admin route configuration
- [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) - Security best practices
- [lib/middleware/README.md](../lib/middleware/README.md) - Middleware utilities

---

**Last Updated:** February 13, 2026  
**Status:** ✅ Feature Implemented
