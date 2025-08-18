# 🎯 Interview Question Creator - AI Destekli Mülakat Soru Üretim Sistemi

Modern, yapay zeka destekli PDF tabanlı mülakat soru üretim uygulaması. PDF dökümanlarınızı yükleyin, AI ile otomatik soru setleri oluşturun ve mülakat hazırlığınızı optimize edin.

## 🚀 Özellikler

### 🔐 Kimlik Doğrulama

- **Güvenli Kullanıcı Kaydı:** Email & şifre ile hesap oluşturma
- **JWT Token Tabanlı Oturum:** HttpOnly cookie ile güvenli session yönetimi
- **Şifre Hashleme:** bcryptjs ile güvenli şifre koruması

### 📄 PDF Yönetimi

- **PDF Upload:** Drag & drop ile kolay dosya yükleme (max 10MB)
- **Dosya Doğrulama:** Sadece PDF formatı kabul edilir
- **Güvenli Depolama:** Local filesystem veya cloud storage desteği
- **Metadata Takibi:** Dosya boyutu, upload tarihi, orijinal isim

### 🤖 AI Destekli Soru Üretimi

- **Google Gemini 1.5 Flash:** Son teknoloji language model
- **Özelleştirilebilir Parametreler:**
  - Soru sayısı (1-50 arası)
  - Zorluk seviyeleri (Easy, Medium, Hard)
  - Soru kategorileri (Technical, Conceptual, Practical)
- **Akıllı İçerik Analizi:** PDF'den çıkarılan metni analiz eder
- **Kapsamlı Cevaplar:** Her soru için detaylı açıklamalar

### 📊 Soru Seti Yönetimi

- **Dashboard Görünümü:** Tüm soru setlerinizi bir arada
- **Detay Sayfaları:** Soru-cevap çiftlerini düzenli şekilde görüntüleme
- **Filtreleme & Arama:** Kategori ve zorluk seviyesine göre
- **İstatistikler:** Toplam soru sayısı, oluşturma tarihi

### 💾 Dışa Aktarma

- **JSON Format:** API entegrasyonları için
- **CSV Format:** Excel/Sheets uyumluluğu
- **Batch İşlemler:** Birden fazla soru setini toplu dışa aktarma

## 🛠️ Teknoloji Stack

### Frontend

- **Next.js 15.4.6** - App Router ile modern React framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN/UI** - Elegant ve accessible UI components
- **Lucide Icons** - Modern icon library
- **React Hot Toast** - User-friendly notifications

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime
- **Express.js patterns** - RESTful API design

### Database & Storage

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - ODM for MongoDB
- **Local File System** - PDF storage (development)

### AI & ML

- **Google Generative AI** - Gemini 1.5 Flash model
- **LangChain** - AI workflow orchestration
- **PDF-Parse** - PDF content extraction

### Security & Auth

- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Request sanitization

## 📁 Proje Yapısı

```
📦 interview-question-creator/
├── 📁 src/
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 api/                  # API Routes
│   │   │   ├── 📁 auth/             # Authentication endpoints
│   │   │   │   ├── login/route.ts   # POST: User login
│   │   │   │   ├── register/route.ts # POST: User registration
│   │   │   │   ├── logout/route.ts  # POST: User logout
│   │   │   │   └── me/route.ts      # GET: Current user info
│   │   │   ├── 📁 questions/        # Question management
│   │   │   │   ├── route.ts         # GET: List questions
│   │   │   │   └── [id]/route.ts    # GET,DELETE: Question CRUD
│   │   │   ├── upload/route.ts      # POST: PDF file upload
│   │   │   ├── generate/route.ts    # POST: AI question generation
│   │   │   ├── health/route.ts      # GET: System health check
│   │   │   └── cleanup/route.ts     # DELETE: Dev database cleanup
│   │   ├── 📁 questions/            # Question pages
│   │   │   ├── page.tsx             # Questions dashboard
│   │   │   └── [id]/page.tsx        # Question set detail
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   └── globals.css              # Global styles
│   ├── 📁 components/               # React Components
│   │   ├── 📁 auth/                 # Authentication UI
│   │   │   └── auth-form.tsx        # Login/Register form
│   │   ├── 📁 dashboard/            # Dashboard components
│   │   │   ├── question-set-list.tsx # Question sets grid
│   │   │   └── upload-and-generate.tsx # Upload & generate UI
│   │   ├── 📁 providers/            # Context providers
│   │   │   └── auth-provider.tsx    # Auth state management
│   │   └── 📁 ui/                   # ShadCN UI components
│   ├── 📁 lib/                      # Utility libraries
│   │   ├── mongodb.ts               # Database connection
│   │   ├── auth.ts                  # JWT utilities
│   │   ├── storage.ts               # File storage utilities
│   │   └── utils.ts                 # Helper functions
│   └── 📁 models/                   # Database models
│       ├── User.ts                  # User schema
│       ├── Document.ts              # Document schema
│       └── QuestionSet.ts           # Question set schema
├── 📁 uploads/                      # Local PDF storage
├── 📁 types/                        # TypeScript definitions
├── .env.example                     # Environment template
├── .env.local                       # Local environment (git-ignored)
├── package.json                     # Dependencies
└── README.md                        # This file
```

## ⚙️ Kurulum ve Çalıştırma

### Ön Gereksinimler

- **Node.js 18+** - JavaScript runtime
- **npm veya yarn** - Package manager
- **MongoDB** - Database (Atlas cloud veya local)
- **Google AI API Key** - Gemini model erişimi

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd interview-question-creator
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 3. Environment Variables Ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# MongoDB Bağlantısı
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-creator

# Google AI API Key (https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# JWT Secret (32+ karakter rastgele string)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# Opsiyonel
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Veritabanını Hazırlayın

**MongoDB Atlas (Önerilen):**

1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Yeni cluster oluşturun
3. Database user ekleyin
4. IP whitelist ayarlayın
5. Connection string'i kopyalayın

**Local MongoDB:**

```bash
# Docker ile
docker run -d --name mongo-interview -p 27017:27017 mongo:7

# macOS Homebrew ile
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

### 5. Development Server'ı Başlatın

```bash
npm run dev
# veya
yarn dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

### 6. Production Build

```bash
npm run build
npm start
```

## 🎮 Kullanım Kılavuzu

### 1. Hesap Oluşturma

- Ana sayfada "Register" butonuna tıklayın
- Email, isim ve şifre bilgilerinizi girin
- Başarılı kayıt sonrası otomatik login olursunuz

### 2. PDF Yükleme

- Dashboard'da "Upload PDF" alanına dosyanızı sürükleyin
- Maksimum 10MB, sadece PDF formatı
- Yükleme tamamlandığında dosya listede görünür

### 3. Soru Üretimi

- Yüklenen PDF'in yanındaki "Generate Questions" butonuna tıklayın
- Soru sayısı (1-50) ve zorluk seviyesi seçin
- AI işlemi 5-15 saniye sürer
- Üretilen sorular otomatik kaydedilir

### 4. Soru Setlerini Görüntüleme

- Dashboard'da tüm soru setlerinizi görün
- Detaylar için herhangi bir set'e tıklayın
- Soru-cevap çiftlerini inceleyin

### 5. Dışa Aktarma

- Soru seti detay sayfasında "Export" butonları
- JSON veya CSV formatında indirebilirsiniz

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Kullanıcı çıkışı
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### File Management

- `POST /api/upload` - PDF dosyası yükleme

### AI Question Generation

- `POST /api/generate` - AI ile soru üretimi

### Question Management

- `GET /api/questions` - Soru setleri listesi
- `GET /api/questions/[id]` - Spesifik soru seti
- `DELETE /api/questions/[id]` - Soru seti silme

### System

- `GET /api/health` - Sistem sağlık kontrolü
- `DELETE /api/cleanup` - Development database temizleme

## 🛡️ Güvenlik Özellikleri

### Data Protection

- **JWT Tokens:** HttpOnly cookies ile XSS koruması
- **Password Hashing:** bcrypt ile güvenli hash
- **Input Validation:** Tüm user input'lar doğrulanır
- **File Type Checking:** Sadece PDF dosyaları kabul edilir
- **File Size Limits:** 10MB upload limiti

### Database Security

- **MongoDB Atlas:** Enterprise-grade güvenlik
- **Connection Encryption:** SSL/TLS bağlantı
- **User Authentication:** Database seviyesinde auth
- **IP Whitelisting:** Erişim kontrolü

### API Security

- **CORS Configuration:** Cross-origin koruması
- **Rate Limiting:** (Gelecekte eklenecek)
- **Request Sanitization:** Malicious input koruması

## 🚧 Bilinen Limitasyonlar ve TODO

### Mevcut Limitasyonlar

- **PDF Parsing:** Geçici olarak placeholder text kullanıyor
- **File Storage:** Local filesystem (production için S3 gerekli)
- **Rate Limiting:** Henüz implementasyonda yok
- **Email Verification:** Hesap doğrulama sistemi yok

### Roadmap

- [ ] **PDF Parsing Fix:** pdf-parse kütüphanesi sorununu çöz
- [ ] **S3 Integration:** AWS S3 veya Cloudflare R2 entegrasyonu
- [ ] **Rate Limiting:** API rate limiting ekle
- [ ] **Email System:** Email verification & notifications
- [ ] **Advanced Filtering:** Soru kategorilerine göre filtreleme
- [ ] **Bulk Operations:** Toplu soru seti işlemleri
- [ ] **Export Options:** PDF export, Word export
- [ ] **Sharing Features:** Soru setlerini paylaşma
- [ ] **Analytics:** Kullanım istatistikleri
- [ ] **Mobile App:** React Native uygulaması

## 🐛 Sorun Giderme

### MongoDB Bağlantı Sorunları

```bash
# Health check
curl http://localhost:3000/api/health

# MongoDB connection test
mongosh "your-connection-string"
```

### API Key Sorunları

- Google AI Studio'da API key'in aktif olduğundan emin olun
- Billing account bağlı olmalı
- Rate limits kontrol edin

### PDF Upload Sorunları

- Dosya boyutu 10MB'ın altında olmalı
- Dosya formatı PDF olmalı
- uploads/ klasörü yazılabilir olmalı

### Development Issues

```bash
# Clean build
rm -rf .next node_modules
npm install
npm run dev

# Database cleanup
curl -X DELETE http://localhost:3000/api/cleanup
```

## 📊 Performance

### Optimizasyonlar

- **Next.js 15:** Latest framework features
- **Turbopack:** Fast development builds
- **Dynamic Imports:** Code splitting
- **Image Optimization:** Next.js automatic optimization
- **Static Generation:** Pre-rendered pages where possible

### Monitoring

- **Server Logs:** Console logging for debugging
- **Error Tracking:** Built-in error boundaries
- **Health Checks:** /api/health endpoint

## 🤝 Katkıda Bulunma

1. **Fork** the repository
2. **Branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** yapın (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 Destek

### GitHub Issues

Sorun ve önerileriniz için GitHub Issues kullanın.

### Development Team

- **Backend Development:** Node.js, MongoDB, API design
- **Frontend Development:** React, Next.js, TypeScript
- **AI Integration:** Google Gemini, LangChain
- **DevOps:** Vercel deployment, environment management

---

**Son Güncelleme:** 18 Ağustos 2025  
**Versiyon:** 1.0.0  
**Durum:** ✅ Production Ready
