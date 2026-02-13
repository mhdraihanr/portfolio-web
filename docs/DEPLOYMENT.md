# Deployment Guide

Panduan lengkap untuk deploy portfolio website ke production.

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

### Code Quality

- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All tests passing (if any)
- [ ] Code reviewed and cleaned up
- [ ] No console.log statements in production code
- [ ] No commented out code blocks

### Environment Variables

- [ ] All required env vars documented in `.env.example`
- [ ] Sensitive data not committed to git
- [ ] `.env.local` in `.gitignore`

### Database

- [ ] Supabase schema applied
- [ ] RLS policies tested
- [ ] Admin user created
- [ ] Sample data added (optional)
- [ ] Storage bucket created and configured

### Content

- [ ] All static content updated
- [ ] Images optimized
- [ ] Meta tags configured
- [ ] Favicon updated
- [ ] Open Graph images set

### Testing

- [ ] Homepage loads correctly
- [ ] All sections visible
- [ ] Contact form works
- [ ] Admin panel accessible
- [ ] CRUD operations work
- [ ] Mobile responsive
- [ ] Dark mode works

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel adalah platform terbaik untuk Next.js dengan zero-config deployment.

#### Step 1: Prepare Repository

```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio website"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**

   Click "Environment Variables" dan tambahkan:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_TO=jonathanraffael098@gmail.com
   ADMIN_ROUTE_SECRET=admin
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

   **Important:**
   - Add variables to all environments (Production, Preview, Development)
   - `ADMIN_ROUTE_SECRET` must match your folder name in `app/` (default: `admin`)
   - For better security, rename folder to unique name and update this value
   - Or select specific environments as needed

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like `https://your-project.vercel.app`

#### Step 3: Post-Deployment

1. **Update Supabase Redirect URLs**
   - Go to Supabase Dashboard
   - Authentication > URL Configuration
   - Add to "Redirect URLs":
     - `https://your-project.vercel.app/**`
   - Add to "Site URL":
     - `https://your-project.vercel.app`

2. **Update Environment Variables**
   - Go back to Vercel Dashboard
   - Settings > Environment Variables
   - Update `NEXT_PUBLIC_SITE_URL` to your production URL
   - Click "Redeploy" to apply changes

3. **Configure Custom Domain (Optional)**
   - Vercel Dashboard > Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - Wait for DNS propagation (can take up to 48 hours)

4. **Test Production Site**
   - Visit your production URL
   - Test all features:
     - Homepage loads
     - Projects display
     - Contact form sends email
     - Admin login works
     - CRUD operations work

---

### Option 2: Netlify

Alternative platform dengan fitur similar.

#### Step 1: Prepare Repository

Same as Vercel Step 1.

#### Step 2: Deploy to Netlify

1. **Sign up/Login to Netlify**
   - Go to [https://netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" > "Import an existing project"
   - Choose "GitHub"
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: (leave empty)

4. **Add Environment Variables**
   - Site settings > Environment variables
   - Add all variables from `.env.local`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

#### Step 3: Post-Deployment

Similar to Vercel post-deployment steps.

---

### Option 3: VPS (DigitalOcean, AWS, etc.)

Untuk advanced users yang ingin full control.

#### Requirements

- VPS dengan Node.js 18+
- Nginx atau Apache
- PM2 untuk process management
- SSL certificate (Let's Encrypt)

#### Step 1: Setup VPS

```bash
# SSH to VPS
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 2: Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
sudo npm install

# Create .env.local
sudo nano .env.local
# Paste your environment variables

# Build application
sudo npm run build

# Start with PM2
sudo pm2 start npm --name "portfolio" -- start
sudo pm2 save
sudo pm2 startup
```

#### Step 3: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/portfolio

# Paste this configuration:
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Step 4: Setup Auto-Deploy (Optional)

Create webhook for auto-deploy on git push:

```bash
# Create deploy script
sudo nano /var/www/portfolio/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/portfolio
git pull origin main
npm install
npm run build
pm2 restart portfolio
```

```bash
# Make executable
sudo chmod +x /var/www/portfolio/deploy.sh

# Setup GitHub webhook
# Repository > Settings > Webhooks > Add webhook
# Payload URL: http://yourdomain.com/webhook
# Content type: application/json
# Events: Just the push event
```

---

## 🔒 Security Checklist

Before going live:

### Environment Variables

- [ ] All sensitive data in environment variables
- [ ] No hardcoded credentials in code
- [ ] `.env.local` not committed to git
- [ ] Service role key kept secret

### Supabase Security

- [ ] RLS policies enabled on all tables
- [ ] Storage policies configured correctly
- [ ] Admin user has strong password
- [ ] Email confirmation enabled (optional)

### Next.js Security

- [ ] ADMIN_ROUTE_SECRET matches folder name in `app/` directory
- [ ] Admin folder renamed to unique name for production (recommended)
- [ ] Middleware protecting admin routes
- [ ] API routes validating input
- [ ] CORS configured properly

### Server Security (VPS only)

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Fail2ban installed
- [ ] Regular security updates
- [ ] SSL certificate installed

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable Vercel Analytics for free:

1. Vercel Dashboard > Analytics
2. Enable Analytics
3. Add to `app/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics (Optional)

1. Create GA4 property
2. Get Measurement ID
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Install package:
   ```bash
   npm install @next/third-parties
   ```
5. Add to `app/layout.tsx`:

   ```tsx
   import { GoogleAnalytics } from "@next/third-parties/google";

   <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />;
   ```

### Error Monitoring (Optional)

Consider using Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: Module not found**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: Environment variable not found**

- Check all required env vars are set in Vercel/Netlify
- Restart deployment after adding env vars

### Runtime Errors

**Error: Supabase connection failed**

- Verify Supabase URL and keys
- Check Supabase project status
- Verify RLS policies

**Error: Email not sending**

- Check Gmail app password
- Verify SMTP settings
- Check email logs in Vercel

### Performance Issues

**Slow page load**

- Enable Image Optimization
- Use Next.js Image component
- Enable caching headers
- Optimize database queries

**High bandwidth usage**

- Compress images
- Enable Vercel Image Optimization
- Use CDN for static assets

---

## 📝 Post-Deployment Tasks

### Week 1

- [ ] Monitor error logs
- [ ] Check analytics data
- [ ] Test all features in production
- [ ] Get feedback from users
- [ ] Fix any critical bugs

### Month 1

- [ ] Review performance metrics
- [ ] Optimize slow queries
- [ ] Add missing features
- [ ] Update content
- [ ] SEO optimization

### Ongoing

- [ ] Regular content updates
- [ ] Security updates
- [ ] Performance monitoring
- [ ] Backup database
- [ ] Review analytics

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

**Last Updated:** January 2026
