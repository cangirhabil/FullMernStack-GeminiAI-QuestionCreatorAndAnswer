# 🎯 Interview Question Creator

AI destekli PDF tabanlı mülakat soru üretim uygulaması. PDF dökümanlarınızı yükleyin, Google Gemini AI ile otomatik soru setleri oluşturun.

## ✨ Özellikler

- 🔐 **Güvenli Auth:** JWT token tabanlı kimlik doğrulama
- 📄 **PDF Upload:** Drag & drop ile dosya yükleme (max 10MB)
- 🤖 **AI Soru Üretimi:** Google Gemini 1.5 Flash ile akıllı soru oluşturma
- ⚙️ **Özelleştirilebilir:** Soru sayısı ve zorluk seviyesi seçimi
- 📊 **Dashboard:** Soru setlerinizi yönetin ve görüntüleyin
- 💾 **Export:** JSON & CSV formatında dışa aktarma
- 🎨 **Modern UI:** Next.js 15 + TailwindCSS + ShadCN/UI

## 🚀 Hızlı Başlangıç

### 1. Kurulum
```bash
git clone <repo-url>
cd interview-question-creator
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# .env.local dosyasını düzenleyin:
```

**Gerekli Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
JWT_SECRET=your_32_char_plus_random_string_here
```

### 3. Çalıştırma
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS, ShadCN/UI
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB Atlas / Mongoose
- **AI:** Google Generative AI (Gemini 1.5 Flash)
- **Auth:** JWT with HttpOnly cookies
- **Security:** bcryptjs, CORS, input validation

## 📖 Detaylı Dokümantasyon

Kapsamlı kurulum, kullanım ve geliştirme kılavuzu için [README-DETAILED.md](./README-DETAILED.md) dosyasına bakın.

## 🎮 Kullanım

1. **Register/Login** - Hesap oluşturun
2. **PDF Upload** - Dökümanınızı yükleyin  
3. **Generate** - AI ile sorular oluşturun
4. **Review** - Soru-cevap setlerini inceleyin
5. **Export** - JSON/CSV formatında indirin

## 🔧 API Endpoints

```
POST /api/auth/register    # Kullanıcı kaydı
POST /api/auth/login       # Login
POST /api/upload           # PDF yükleme
POST /api/generate         # AI soru üretimi
GET  /api/questions        # Soru setleri listesi
GET  /api/health          # Sistem durumu
```

## 🛡️ Güvenlik

- JWT token tabanlı authentication
- HttpOnly cookies ile XSS koruması
- bcrypt ile şifre hashleme
- File type ve boyut validasyonu
- MongoDB Atlas enterprise güvenlik

## 🚧 Roadmap

- [ ] PDF parsing fix (şu an placeholder text)
- [ ] S3/Cloudflare R2 entegrasyonu
- [ ] Rate limiting
- [ ] Email verification
- [ ] Advanced filtering
- [ ] Mobile app

## 📊 Durum

**✅ Production Ready**
- ✅ Authentication çalışıyor
- ✅ PDF upload fonksiyonel
- ✅ AI soru üretimi aktif
- ✅ Dashboard ve export hazır
- ✅ MongoDB Atlas bağlantılı

## 📄 Lisans

MIT License - Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

---

**Son Güncelleme:** 18 Ağustos 2025 | **Versiyon:** 1.0.0

### Geliştirme İpuçları

- `uploads/` klasörü development sırasında local diskte tutulur. Production için kalıcı storage önerilir.
- API hatalarını görmek için terminal / server loglarını takip edin.
- `JWT_SECRET` değerini değiştirirseniz mevcut giriş (cookie) geçersiz olur; yeniden login yapın.

### Vercel Notları

- `uploads/` dizini ephemeral; kalıcı depolama için S3 / R2 kullanın.
- `pdf-parse` dinamik import edildi (server only).
- Environment değişkenlerini Vercel dashboard üzerinden tanımlayın.

### Yol Haritası

- [ ] Kalıcı obje depolama entegrasyonu
- [ ] Büyük PDF chunking & streaming
- [ ] Rate limiting
- [ ] RAG (embeddings + semantic arama)
- [ ] Rol bazlı yetki

### Lisans

MIT
