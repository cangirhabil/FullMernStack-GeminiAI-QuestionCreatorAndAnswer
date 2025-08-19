# 🎯 AI-Powered Interview Question Creator

**Modern MERN Stack Uygulaması** - PDF dökümanlarınızı akıllı soru setlerine dönüştürün!

Bu uygulama, Google Gemini 2.5 Flash AI modeli ve RAG (Retrieval-Augmented Generation) teknolojisi kullanarak PDF dökümanlarından otomatik olarak profesyonel mülakat soruları oluşturan gelişmiş bir web platformudur.

## 🌟 Özellikler

### 🔐 Güvenli Kimlik Doğrulama
- JWT token tabanlı authentication sistemi
- HttpOnly cookies ile XSS koruması
- bcrypt ile şifre şifreleme
- Kullanıcı profil yönetimi

### 📄 Gelişmiş Dosya İşleme
- **Drag & Drop PDF yükleme** (maksimum 10MB)
- **Gerçek PDF metin çıkarma** (pdf-parse ve pdfjs-dist fallback)
- **Akıllı metin temizleme** ve anahtar kelime çıkarma
- **Çoklu dil desteği** (İngilizce, Türkçe, Hollandaca)

### 🤖 AI & RAG Teknolojisi
- **Google Gemini 2.5 Flash** ile gelişmiş AI soru üretimi
- **RAG Sistemi:** Dokümanları parçalara böler ve vektörel arama yapar
- **Bağlamsal Sorular:** Dokümanın farklı bölümlerinden bilgi birleştirir
- **Kategorilendirilmiş Sorular:** Teknik, Kavramsal, Pratik, Analitik

### ⚙️ Özelleştirilebilir Soru Üretimi
- **Soru sayısı:** 5-50 arasında seçilebilir
- **Zorluk seviyesi:** Kolay, Orta, Zor, Çok Zor
- **Soru tipleri:** Çoktan seçmeli, açık uçlu, analitik
- **Dil seçimi:** Sorular istenilen dilde üretilir

### 📊 Kapsamlı Dashboard
- **Soru setleri listesi** ve detaylı görüntüleme
- **Kullanıcı istatistikleri** (toplam doküman, soru seti sayısı)
- **Arama ve filtreleme** özellikleri
- **Responsive tasarım** (mobil uyumlu)

### 💾 Çoklu Export Formatları
- **JSON:** API entegrasyonları için yapılandırılmış veri
- **CSV:** Excel'de düzenleme için
- **PDF:** Profesyonel yazdırılabilir formatlar
- **Exam Format:** Hazır sınav formatları

### 🎨 Modern UI/UX
- **Next.js 15** ile server-side rendering
- **TailwindCSS 4** ile modern tasarım
- **ShadCN/UI** komponent kütüphanesi
- **Responsive design** tüm cihazlarda mükemmel görünüm

## �️ Teknoloji Stack'i

### Frontend
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - Modern React hooks ve server components
- **TypeScript 5.x** - Type-safe development
- **TailwindCSS 4.x** - Utility-first CSS framework
- **ShadCN/UI** - Pre-built UI components
- **Lucide React** - Modern icon library

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework components
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Database & Storage
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose 8.17.1** - ODM for MongoDB
- **File System** - Local upload storage (development)
- **AWS S3** - Production file storage (ready)

### AI & Processing
- **Google Generative AI (Gemini 2.5 Flash)** - Main AI model
- **LangChain** - AI application framework
- **RAG System** - Custom retrieval-augmented generation
- **PDF-Parse** - PDF text extraction
- **PDFJS-Dist** - Fallback PDF processor

### Security & Auth
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **HttpOnly Cookies** - Secure token storage
- **Input Validation** - Request data validation
- **Rate Limiting** - API abuse prevention

### Development & Deployment
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast development builds
- **Vercel Ready** - Production deployment ready

## 🚀 Kurulum ve Çalıştırma

### 1. Projeyi İndirin
```bash
git clone https://github.com/cangirhabil/FullMernStack-GeminiAI-QuestionCreatorAndAnswer.git
cd FullMernStack-GeminiAI-QuestionCreatorAndAnswer
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
`.env.local` dosyası oluşturun ve aşağıdaki değerleri ekleyin:

```env
# MongoDB Bağlantısı
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview_questions

# Google AI API Key
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX

# JWT Secret (en az 32 karakter)
JWT_SECRET=your_32_character_plus_random_string_here

# Next.js URL (production için değiştirin)
NEXTAUTH_URL=http://localhost:3000
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

### 5. Production Build
```bash
npm run build
npm start
```

## � API Endpoints

### Authentication
```http
POST /api/auth/register    # Kullanıcı kaydı
POST /api/auth/login       # Giriş yapma
POST /api/auth/logout      # Çıkış yapma
```

### File Management
```http
POST /api/upload           # PDF dosyası yükleme
GET  /api/upload           # Yüklenen dosyaları listele
DELETE /api/upload/[id]    # Dosya silme
```

### AI Question Generation
```http
POST /api/generate         # AI ile soru üretimi
POST /api/generate/test    # Test modunda soru üretimi
```

### Question Sets
```http
GET  /api/questions        # Soru setleri listesi
GET  /api/questions/[id]   # Tek soru seti detayı
DELETE /api/questions/[id] # Soru seti silme
```

### System
```http
GET  /api/health          # Sistem durumu kontrolü
GET  /api/stats           # Kullanıcı istatistikleri
POST /api/cleanup         # Sistem temizleme
```

## 🎮 Kullanım Kılavuzu

### 1. Hesap Oluşturma
1. Ana sayfada "Register" butonuna tıklayın
2. E-posta ve şifrenizi girin
3. Hesabınız otomatik olarak oluşturulacak

### 2. Google API Key Ekleme
1. Dashboard'dan "Settings" menüsüne gidin
2. [Google AI Studio](https://aistudio.google.com/app/apikey)'dan API key alın
3. API key'inizi profile ekleyin

### 3. Doküman Yükleme
1. "Upload Document" alanına PDF dosyanızı sürükleyin
2. Dosya otomatik olarak yüklenecek ve işlenecek
3. Maksimum dosya boyutu: 10MB

### 4. Soru Üretimi
1. Yüklediğiniz dokümanı seçin
2. Soru sayısı (5-50) ve zorluk seviyesini ayarlayın
3. İstenilen dili seçin (Türkçe/İngilizce/Hollandaca)
4. "Generate Questions" butonuna tıklayın

### 5. Sonuçları İnceleme ve Export
1. Üretilen soruları review edin
2. İstenilen formatta (JSON/CSV/PDF) export edin
3. Soru setlerini dashboard'dan yönetin

## 🔧 RAG Sistemi Detayları

### Doküman İşleme Süreci
1. **PDF Parsing:** Metin çıkarma ve temizleme
2. **Chunking:** Dokümanı 1000 karakter parçalara bölme
3. **Embedding:** Her parça vektörel forma dönüştürme
4. **Indexing:** Arama için indeksleme

### Akıllı Soru Üretimi
1. **Multi-Query Search:** Farklı açılardan içerik arama
2. **Context Combining:** İlgili parçaları birleştirme
3. **Category-Based Generation:** Tip bazında soru üretimi
4. **Quality Assessment:** Soru kalitesi değerlendirmesi

### Soru Kategorileri
- **Teknik Sorular:** Spesifik bilgiler ve detaylar
- **Kavramsal Sorular:** Temel anlayış ve teoriler
- **Pratik Sorular:** Uygulama ve örnekler
- **Analitik Sorular:** Analiz ve değerlendirme

## 🛡️ Güvenlik Özellikleri

### Authentication & Authorization
- JWT token tabanlı kimlik doğrulama
- HttpOnly cookies ile güvenli token saklama
- Automatic token refresh
- Session management

### Data Protection
- bcrypt ile şifre hashleme (12 rounds)
- Input sanitization ve validation
- File type ve boyut kontrolü
- NoSQL injection koruması

### API Security
- Rate limiting (geliştirilmekte)
- CORS policy
- Request validation
- Error handling without data exposure

## 📊 Proje İstatistikleri

### Kod Metrikleri
- **Toplam Dosya:** 50+ TypeScript/JavaScript dosyası
- **Komponent Sayısı:** 25+ React komponenti
- **API Endpoint:** 15+ RESTful endpoint
- **Model:** 4 ana MongoDB modeli

### Dependencies
- **Production:** 32 ana bağımlılık
- **Development:** 11 geliştirme aracı
- **Bundle Size:** Optimize edilmiş Next.js output

## 🚧 Gelecek Planları (Roadmap)

### Kısa Vadeli (1-2 ay)
- [ ] **AWS S3 Integration** - Kalıcı dosya depolama
- [ ] **Advanced Rate Limiting** - API abuse koruması
- [ ] **Email Verification** - E-posta doğrulama sistemi
- [ ] **Enhanced Error Handling** - Daha iyi hata yönetimi

### Orta Vadeli (3-6 ay)
- [ ] **Multi-Language PDF Support** - Çoklu dil PDF desteği
- [ ] **Advanced Export Formats** - DOCX, PPTX export
- [ ] **Question Templates** - Hazır soru şablonları
- [ ] **Collaboration Features** - Takım çalışması özellikleri

### Uzun Vadeli (6+ ay)
- [ ] **Mobile Application** - React Native mobil uygulama
- [ ] **Advanced Analytics** - Detaylı analitik dashboard
- [ ] **Integration APIs** - Üçüncü parti entegrasyonlar
- [ ] **Enterprise Features** - Kurumsal özellikler

## 🔧 Geliştirme Notları

### Local Development
```bash
# Development server with turbopack
npm run dev

# Type checking
npm run lint

# Build production
npm run build
```

### Environment Specifics
- **Development:** Local file storage in `uploads/` directory
- **Production:** AWS S3 bucket integration recommended
- **Database:** MongoDB Atlas with connection pooling

### Known Issues & Solutions
1. **PDF Parsing:** Some complex PDFs might need manual preprocessing
2. **File Storage:** Local storage is ephemeral on Vercel - use S3 for production
3. **API Rate Limits:** Gemini API has usage limits - implement request queuing

### Performance Optimizations
- **Next.js 15:** App Router with server components
- **Turbopack:** Fast development builds
- **MongoDB Indexing:** Optimized queries
- **Lazy Loading:** Dynamic imports for better performance

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasına bakınız.

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim & Destek

- **GitHub Issues:** Hata raporları ve özellik istekleri
- **Email:** proje@example.com
- **Documentation:** [Detaylı Dokümantasyon](./README-DETAILED.md)

---

**Son Güncelleme:** 19 Ağustos 2025 | **Versiyon:** 1.2.0

### ⭐ Bu projeyi faydalı bulduysanız yıldız vermeyi unutmayın!

**Made with ❤️ using Next.js 15, Gemini 2.5 Flash & RAG Technology**
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
