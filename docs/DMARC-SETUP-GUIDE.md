# DMARC Setup Guide untuk mhdraihanr.my.id

## 🎯 Tujuan
Menambahkan DMARC record untuk mencegah email spoofing dan phishing menggunakan domain Anda.

---

## 📋 Langkah-Langkah

### **Step 1: Login ke Cloudflare Dashboard**

1. Buka https://dash.cloudflare.com/
2. Login dengan akun Anda
3. Pilih domain: **mhdraihanr.my.id**
4. Klik menu **DNS** di sidebar kiri

---

### **Step 2: Tambah DMARC Record**

Klik tombol **"Add record"** dan masukkan:

```
Type:   TXT
Name:   _dmarc
Content: v=DMARC1; p=quarantine; rua=mailto:raihanrafliansyah1234@gmail.com; pct=100; adkim=s; aspf=s
TTL:    Auto
```

**Penjelasan setiap bagian:**

| Parameter | Nilai | Arti |
|-----------|-------|------|
| `v=DMARC1` | - | Versi DMARC (wajib) |
| `p=quarantine` | quarantine | Email yang gagal SPF/DKIM masuk folder spam |
| `rua=mailto:...` | Email Anda | Alamat untuk menerima laporan agregat (weekly report) |
| `pct=100` | 100% | Kebijakan berlaku untuk semua email (100%) |
| `adkim=s` | strict | DKIM alignment strict (lebih ketat) |
| `aspf=s` | strict | SPF alignment strict (lebih ketat) |

**Klik "Save"**

---

### **Step 3: Rollout Bertahap (PENTING!)**

**JANGAN langsung `p=reject`** — bisa block email legit!

Gunakan urutan ini:

#### **Minggu 1-2: Monitoring Mode**
```
v=DMARC1; p=none; rua=mailto:raihanrafliansyah1234@gmail.com; pct=100; adkim=s; aspf=s
```
- `p=none` → Hanya monitor, tidak block apapun
- Baca laporan yang masuk ke email Anda
- Pastikan email legit tidak ada yang fail

#### **Minggu 3-4: Quarantine Mode** ← **Mulai dari sini**
```
v=DMARC1; p=quarantine; rua=mailto:raihanrafliansyah1234@gmail.com; pct=100; adkim=s; aspf=s
```
- `p=quarantine` → Email yang gagal masuk spam
- Cek apakah ada false positive

#### **Minggu 5+: Reject Mode** (Opsional, paling ketat)
```
v=DMARC1; p=reject; rua=mailto:raihanrafliansyah1234@gmail.com; pct=100; adkim=s; aspf=s
```
- `p=reject` → Email yang gagal langsung ditolak
- Hanya gunakan setelah yakin tidak ada false positive

---

### **Step 4: Pastikan DKIM Aktif**

DMARC bekerja optimal dengan **SPF + DKIM**. Anda sudah punya SPF, sekarang cek DKIM:

1. **Dashboard Cloudflare Email Routing:**
   - Klik **Email** di sidebar
   - Pastikan ada record DKIM (biasanya auto-generated)

2. **Atau cek manual di DNS:**
   - Cari record TXT dengan nama seperti: `*._domainkey.mhdraihanr.my.id`
   - Jika tidak ada, enable di Email Routing settings

**Jika pakai email provider lain (Gmail, Resend, etc):**
- Mereka biasanya kasih DKIM record untuk ditambahkan
- Follow dokumentasi provider Anda

---

### **Step 5: Verifikasi (24 jam kemudian)**

Setelah 24 jam, tes apakah DMARC sudah aktif:

#### **Cara 1: Command Line**
```powershell
nslookup -type=TXT _dmarc.mhdraihanr.my.id 1.1.1.1
```

**Output yang benar:**
```
_dmarc.mhdraihanr.my.id	text = "v=DMARC1; p=quarantine; rua=mailto:raihanrafliansyah1234@gmail.com; pct=100; adkim=s; aspf=s"
```

#### **Cara 2: Online Tool**
Buka: https://mxtoolbox.com/dmarc.aspx
Masukkan: `mhdraihanr.my.id`
Klik **"DMARC Lookup"**

**✅ Status harus:** "DMARC Record found"

---

## 📊 Membaca Laporan DMARC

Setelah beberapa hari, Anda akan menerima **DMARC Aggregate Reports** (format XML) ke email `raihanrafliansyah1234@gmail.com`.

**Isi laporan:**
- Berapa email terkirim menggunakan domain Anda
- Berapa yang pass/fail SPF & DKIM
- IP address pengirim
- Email provider penerima (Gmail, Yahoo, etc)

**Tools untuk baca laporan (XML susah dibaca manual):**
- https://dmarcian.com/dmarc-xml-parser/ (gratis)
- https://dmarc.postmarkapp.com/ (gratis)
- Upload file XML yang Anda terima

**Red flags di laporan:**
- Banyak email fail dari IP yang tidak Anda kenal → bisa jadi spoofing attempt
- Email legit Anda sendiri fail → perlu fix SPF/DKIM config

---

## 🚨 Troubleshooting

### **Problem 1: Email legit masuk spam setelah DMARC**

**Solusi:**
1. Cek apakah email Anda punya DKIM signature
2. Pastikan SPF record include semua IP yang Anda gunakan
3. Turunkan ke `p=none` sementara
4. Baca laporan untuk cari tahu kenapa fail

### **Problem 2: Tidak ada laporan masuk**

**Penyebab:**
- Email provider belum kirim (bisa 1-2 minggu)
- Volume email Anda rendah → tidak cukup data untuk laporan
- Email masuk spam (cek spam folder)

**Solusi:**
- Tunggu 1-2 minggu
- Cek spam folder
- Pastikan email `rua=` benar

### **Problem 3: Record tidak ke-detect setelah 24 jam**

**Solusi:**
1. Flush DNS cache:
   ```powershell
   ipconfig /flushdns
   ```
2. Cek typo di Cloudflare DNS
3. Pastikan Name: `_dmarc` (dengan underscore)
4. TTL biarkan Auto

---

## ✅ Checklist Final

- [ ] DMARC TXT record ditambahkan di Cloudflare DNS
- [ ] Mulai dengan `p=quarantine` (bukan `p=reject`)
- [ ] Email `rua=` sudah benar
- [ ] DKIM sudah aktif (cek di Email Routing atau provider)
- [ ] SPF record masih ada (jangan dihapus)
- [ ] Tunggu 24 jam, lalu verify dengan `nslookup` atau MXToolbox
- [ ] Monitor laporan yang masuk ke email selama 2-4 minggu
- [ ] Jika semua aman, upgrade ke `p=reject` (opsional)

---

## 📚 Referensi

- [DMARC Official Spec](https://dmarc.org/)
- [Cloudflare DMARC Guide](https://developers.cloudflare.com/email-routing/dmarc-reporting/)
- [Google DMARC Setup](https://support.google.com/a/answer/2466563)

---

**Estimasi waktu setup:** 5-10 menit
**Estimasi verifikasi:** 24-48 jam
**Monitoring:** 2-4 minggu sebelum upgrade ke `p=reject`
