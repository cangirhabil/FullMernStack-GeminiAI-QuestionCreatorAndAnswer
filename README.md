# 🎯 AI-Powered Interview Question Creator

**Modern MERN Stack Application** - Turn your PDF documents into intelligent question sets!

This application is an advanced web platform that automatically generates professional interview questions from PDF documents using Google Gemini 2.5 Flash AI and RAG (Retrieval-Augmented Generation) technology.

## 🌟 Features

### 🔐 Secure Authentication
- JWT token-based authentication system
- XSS protection using HttpOnly cookies
- Password hashing with bcrypt
- User profile management

### 📄 Advanced File Processing
- **Drag & Drop PDF upload** (max 10MB)
- **Real PDF text extraction** (pdf-parse with pdfjs-dist fallback)
- **Intelligent text cleaning** and keyword extraction
- **Multi-language support** (English, Turkish, Dutch)

### 🤖 AI & RAG Technology
- **Google Gemini 2.5 Flash** for advanced AI question generation
- **RAG System:** Splits documents into chunks and performs vector search
- **Contextual Questions:** Combines information from different document sections
- **Categorized Questions:** Technical, Conceptual, Practical, Analytical

### ⚙️ Customizable Question Generation
- **Number of questions:** Selectable between 5-50
- **Difficulty level:** Easy, Medium, Hard, Very Hard
- **Question types:** Multiple choice, open-ended, analytical
- **Language selection:** Generate questions in the desired language

### 📊 Comprehensive Dashboard
- **List and detailed view of question sets**
- **User statistics** (total documents, number of question sets)
- **Search and filter** features
- **Responsive design** (mobile friendly)

### 💾 Multiple Export Formats
- **JSON:** Structured data for API integrations
- **CSV:** For editing in Excel
- **PDF:** Professional printable formats
- **Exam Format:** Ready-made exam formats

### 🎨 Modern UI/UX
- **Next.js 15** for server-side rendering
- **TailwindCSS 4** for modern styling
- **ShadCN/UI** component library
- **Responsive design** for great appearance on all devices

## 🚀 Technology Stack

### Frontend
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - Modern React hooks and server components
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

## 🚀 Installation and Running

### 1. Clone the Project
```bash
git clone https://github.com/cangirhabil/FullMernStack-GeminiAI-QuestionCreatorAndAnswer.git
cd FullMernStack-GeminiAI-QuestionCreatorAndAnswer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file and add the following values:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview_questions

# Google AI API Key
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX

# JWT Secret (at least 32 characters)
JWT_SECRET=your_32_character_plus_random_string_here

# Next.js URL (change for production)
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start the Development Server
```bash
npm run dev
```

The app will run at [http://localhost:3000](http://localhost:3000).

### 5. Production Build
```bash
npm run build
npm start
```

## � API Endpoints

### Authentication
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # Login
POST /api/auth/logout      # Logout
```

### File Management
```http
POST /api/upload           # Upload PDF file
GET  /api/upload           # List uploaded files
DELETE /api/upload/[id]    # Delete file
```

### AI Question Generation
```http
POST /api/generate         # Generate questions with AI
POST /api/generate/test    # Generate questions in test mode
```

### Question Sets
```http
GET  /api/questions        # List question sets
GET  /api/questions/[id]   # Single question set details
DELETE /api/questions/[id] # Delete question set
```

### System
```http
GET  /api/health          # System health check
GET  /api/stats           # User statistics
POST /api/cleanup         # System cleanup
```

## 🎮 User Guide

### 1. Create an Account
1. Click the "Register" button on the main page
2. Enter your email and password
3. Your account will be created automatically

### 2. Add Google API Key
1. Go to the "Settings" menu from the dashboard
2. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Add your API key to your profile

### 3. Upload Document
1. Drag and drop your PDF into the "Upload Document" area
2. The file will be uploaded and processed automatically
3. Maximum file size: 10MB

### 4. Generate Questions
1. Select the uploaded document
2. Set the number of questions (5-50) and difficulty level
3. Choose the language (Turkish/English/Dutch)
4. Click the "Generate Questions" button

### 5. Review Results and Export
1. Review the generated questions
2. Export in the desired format (JSON/CSV/PDF)
3. Manage question sets from the dashboard

## 🔧 RAG System Details

### Document Processing Workflow
1. **PDF Parsing:** Text extraction and cleaning
2. **Chunking:** Split the document into 1000-character chunks
3. **Embedding:** Convert each chunk to vector form
4. **Indexing:** Index for search

### Intelligent Question Generation
1. **Multi-Query Search:** Search content from different angles
2. **Context Combining:** Combine relevant chunks
3. **Category-Based Generation:** Generate questions by type
4. **Quality Assessment:** Evaluate question quality

### Question Categories
- **Technical Questions:** Specific information and details
- **Conceptual Questions:** Core understanding and theories
- **Practical Questions:** Application and examples
- **Analytical Questions:** Analysis and evaluation

## 🛡️ Security Features

### Authentication & Authorization
- JWT token-based authentication
- Secure token storage with HttpOnly cookies
- Automatic token refresh
- Session management

### Data Protection
- Password hashing with bcrypt (12 rounds)
- Input sanitization and validation
- File type and size checks
- NoSQL injection protection

### API Security
- Rate limiting (in development)
- CORS policy
- Request validation
- Error handling without exposing sensitive data

## 📊 Project Statistics

### Code Metrics
- **Total Files:** 50+ TypeScript/JavaScript files
- **Component Count:** 25+ React components
- **API Endpoints:** 15+ RESTful endpoints
- **Models:** 4 main MongoDB models

### Dependencies
- **Production:** 32 main dependencies
- **Development:** 11 developer tools
- **Bundle Size:** Optimized Next.js output

## 🔧 Development Notes

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
1. **PDF Parsing:** Some complex PDFs may need manual preprocessing
2. **File Storage:** Local storage is ephemeral on Vercel - use S3 for production
3. **API Rate Limits:** Gemini API has usage limits - implement request queuing

### Performance Optimizations
- **Next.js 15:** App Router with server components
- **Turbopack:** Fast development builds
- **MongoDB Indexing:** Optimized queries
- **Lazy Loading:** Dynamic imports for better performance

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


**Made with ❤️ using Next.js 15, Gemini 2.5 Flash & RAG Technology**
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB Atlas / Mongoose
- **AI:** Google Generative AI (Gemini 1.5 Flash)
- **Auth:** JWT with HttpOnly cookies
- **Security:** bcryptjs, CORS, input validation

## 📖 Detailed Documentation

For comprehensive installation, usage, and development guide, see [README-DETAILED.md](./README-DETAILED.md).

## 🎮 Usage

1. **Register/Login** - Create an account
2. **PDF Upload** - Upload your document
3. **Generate** - Generate questions with AI
4. **Review** - Review question-answer sets
5. **Export** - Download in JSON/CSV formats


```

## 📄 License

MIT License - Detaylar için [LICENSE](./LICENSE) dosyasına bakın.
5. **Export** - Download in JSON/CSV formats## 📄 LicenseMIT License - See [LICENSE](./LICENSE) for details.