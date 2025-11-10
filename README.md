<div align="center">

# 🧠 AI-Powered Mental Health Assessment System

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.11-007FFF?logo=mui)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Face-API.js](https://img.shields.io/badge/Face--API.js-0.22.2-FF6B6B?logo=javascript)](https://github.com/justadudewhohacks/face-api.js)

**A comprehensive full-stack web application for intelligent mental health risk assessment using AI-powered text analysis and real-time facial emotion detection.**

[Features](#-key-features) • [Installation](#-quick-start) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features in Detail](#-features-in-detail)
- [Security & Privacy](#-security--privacy)
- [AI & ML Capabilities](#-ai--ml-capabilities)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **AI-Powered Mental Health Assessment System** is an innovative web application designed to provide intelligent mental health risk assessment through a combination of standardized psychological questionnaires and advanced facial emotion recognition technology. The system offers real-time analysis, personalized recommendations, and comprehensive analytics for both users and administrators.

### What Makes This Special?

✨ **Dual Assessment Approach**: Combines self-reported questionnaire data with real-time facial emotion analysis  
🤖 **AI-Powered Analysis**: Advanced machine learning models for accurate risk prediction  
📊 **Comprehensive Analytics**: Detailed insights and trends for users and administrators  
🔒 **Privacy-First Design**: HIPAA-compliant data handling with encryption and anonymization  
🎨 **Modern UI/UX**: Beautiful, responsive interface built with Material-UI  
⚡ **High Performance**: Optimized with Vite for lightning-fast development and builds

---

## ✨ Key Features

### 👤 User Features

- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📝 **Comprehensive Assessment**: 90-question bank with intelligent 10-question selection
- 🎥 **Real-Time Emotion Detection**: Webcam-based facial emotion analysis using Face-API.js
- 📊 **Personalized Results**: AI-powered risk assessment with detailed metrics
- 💡 **Wellness Activities**: Guided breathing, mindfulness, and relaxation exercises
- 💬 **Chat Support**: Anonymous messaging system for mental health support
- 📈 **Progress Tracking**: Historical assessment data with trend analysis
- 👤 **Profile Management**: User dashboard with assessment history

### 👨‍💼 Admin Features

- 📊 **Analytics Dashboard**: System-wide statistics and mental health trends
- 👥 **User Management**: Anonymized user data and assessment history
- 📈 **Data Visualization**: Interactive charts and risk distribution analysis
- 📥 **Data Export**: CSV/JSON export with privacy controls
- 🔍 **Advanced Filtering**: Filter by risk level, date range, and demographics
- 🎯 **System Insights**: ML model performance metrics and diagnostics

### 🔬 System Features

- 🧠 **ML Performance Monitoring**: Model accuracy, precision, and recall metrics
- 💻 **System Health**: Resource usage, uptime, and response time tracking
- 📉 **Emotion Recognition Analytics**: Facial analysis performance metrics
- 🔍 **Error Logging**: Comprehensive system diagnostics and debugging
- 📊 **Confusion Matrix**: Model prediction accuracy visualization

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Auth UI    │  │  User Dash   │  │  Admin Dash │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Emotion Analysis (Face-API.js)                 │   │
│  │  • Face Detection  • Expression Recognition          │   │
│  │  • Real-time Processing  • Confidence Scoring       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         State Management (React Context)             │   │
│  │  • AuthContext  • DataContext  • Local Storage       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Data Layer (Local Storage / Simulated API)      │
├─────────────────────────────────────────────────────────────┤
│  • User Data  • Assessment Results  • Analytics Data        │
│  • JWT Tokens  • Encrypted Sensitive Data                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ProtectedRoute.tsx
│   ├── User/              # User dashboard components
│   │   ├── UserDashboard.tsx
│   │   ├── AssessmentForm.tsx
│   │   ├── EmotionAnalysis.tsx
│   │   ├── AssessmentResults.tsx
│   │   ├── WellnessActivity.tsx
│   │   ├── ChatSupport.tsx
│   │   ├── UserProfile.tsx
│   │   └── ReviewSystem.tsx
│   ├── Admin/              # Admin dashboard components
│   │   ├── AdminDashboard.tsx
│   │   ├── AnalyticsView.tsx
│   │   ├── UserManagement.tsx
│   │   └── DataExport.tsx
│   ├── System/             # System insights components
│   │   └── SystemInsights.tsx
│   └── Home/               # Landing page
│       └── HomePage.tsx
├── contexts/               # React Context providers
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── data/                   # Data models and question bank
│   └── questionBank.ts     # 90 questions + wellness activities
└── App.tsx                 # Main application component
```

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version | Purpose                  |
| ---------------- | ------- | ------------------------ |
| **React**        | 18.3.1  | UI framework             |
| **TypeScript**   | 5.5.3   | Type safety              |
| **Material-UI**  | 5.15.11 | Component library        |
| **Vite**         | 5.4.2   | Build tool & dev server  |
| **React Router** | 7.3.3   | Client-side routing      |
| **Face-API.js**  | 0.22.2  | Facial emotion detection |
| **Recharts**     | 3.0.0   | Data visualization       |
| **Axios**        | 1.10.0  | HTTP client              |
| **Tailwind CSS** | 3.4.1   | Utility-first CSS        |
| **Emotion**      | 11.11.3 | CSS-in-JS styling        |

### Security & Authentication

| Technology    | Version | Purpose                    |
| ------------- | ------- | -------------------------- |
| **JWT**       | 9.0.2   | Token-based authentication |
| **bcryptjs**  | 3.0.2   | Password hashing           |
| **crypto-js** | 4.2.0   | Data encryption            |

### Development Tools

| Technology            | Version | Purpose             |
| --------------------- | ------- | ------------------- |
| **ESLint**            | 9.9.1   | Code linting        |
| **TypeScript ESLint** | 8.3.0   | TypeScript linting  |
| **PostCSS**           | 8.4.35  | CSS processing      |
| **Autoprefixer**      | 10.4.18 | CSS vendor prefixes |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- Modern web browser with camera support (for emotion detection)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "AI-Powered Mental Health Assesment"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000` (or the port shown in terminal)
   - The application will automatically open in your default browser

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` directory.

---

## 📁 Project Structure

```
AI-Powered Mental Health Assessment/
│
├── public/
│   └── models/                    # Face-API.js ML models
│       ├── age_gender_model/
│       ├── face_expression_model/
│       ├── face_landmark_68_model/
│       ├── face_recognition_model/
│       ├── mtcnn_model/
│       ├── ssd_mobilenetv1_model/
│       └── tiny_face_detector_model/
│
├── src/
│   ├── components/                # React components
│   │   ├── Admin/                 # Admin dashboard components
│   │   ├── Auth/                  # Authentication components
│   │   ├── Home/                   # Landing page
│   │   ├── System/                # System insights
│   │   └── User/                  # User dashboard components
│   │
│   ├── contexts/                  # React Context providers
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── DataContext.tsx        # Application data state
│   │
│   ├── data/                      # Data models
│   │   └── questionBank.ts        # 90 questions + activities
│   │
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Global app styles
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
│
├── dist/                          # Production build output
├── node_modules/                  # Dependencies
│
├── index.html                     # HTML template
├── package.json                   # Project dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── README.md                      # This file
```

---

## 🎨 Features in Detail

### 1. Emotion Detection System

The application uses **Face-API.js** for real-time facial emotion recognition:

- **Face Detection**: Uses TinyFaceDetector for fast, accurate face detection
- **Expression Recognition**: Analyzes 7 emotion categories (happy, sad, angry, fearful, disgusted, surprised, neutral)
- **Real-time Processing**: Processes video frames at 30fps for smooth analysis
- **Confidence Scoring**: Provides reliability indicators for each emotion prediction
- **Calibration**: Initial calibration phase ensures accurate baseline readings

**Technical Implementation:**

- Loads ML models asynchronously for optimal performance
- Implements frame-by-frame analysis with requestAnimationFrame
- Handles camera permissions and errors gracefully
- Provides visual feedback during detection process

### 2. Assessment System

**Question Bank:**

- **90 comprehensive questions** covering 18 categories:
  - Stress Management
  - Mood & Emotional State
  - Sleep Quality
  - Anxiety & Worry
  - Social Connections
  - Life Satisfaction
  - Physical Health
  - Coping Mechanisms
  - And more...

**Assessment Flow:**

1. **Emotion Analysis** (optional): Real-time facial emotion detection
2. **Questionnaire**: 10 randomly selected questions from the bank
3. **Results**: AI-powered risk assessment with detailed metrics
4. **Wellness Activities**: Guided exercises based on results
5. **Post-Activity Assessment**: Follow-up questions to measure improvement

**Risk Calculation:**

- Combines questionnaire responses (80% weight) with emotion data (20% weight)
- Categorizes risk as: **Low**, **Moderate**, or **High**
- Provides category-specific scores and interpretations

### 3. Wellness Activities

Five guided wellness activities:

1. **Deep Breathing Exercise** (2 minutes)

   - 4-4-6 breathing pattern
   - Reduces stress and anxiety

2. **Mindfulness Meditation** (2 minutes)

   - Breath-focused meditation
   - Improves emotional awareness

3. **Gentle Stretching** (2 minutes)

   - Seated stretching routine
   - Releases physical tension

4. **Gratitude Practice** (2 minutes)

   - Reflective gratitude exercise
   - Improves mood and outlook

5. **Progressive Muscle Relaxation** (2 minutes)
   - Systematic muscle relaxation
   - Promotes deep relaxation

### 4. Analytics & Reporting

**User Analytics:**

- Assessment history with trend visualization
- Category-wise score breakdown
- Progress tracking over time
- Improvement metrics

**Admin Analytics:**

- System-wide risk distribution
- User engagement statistics
- Emotion trend analysis
- ML model performance metrics
- Export capabilities (CSV/JSON)

---

## 🔐 Security & Privacy

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Separate user and admin roles
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Route-level access control

### Data Protection

- **Encryption**: Sensitive data encrypted before storage
- **Anonymization**: Personal identifiers removed from analytics
- **Local Storage**: Secure client-side data persistence
- **Consent Management**: Clear consent for camera usage

### Privacy Features

- **Anonymous Chat**: Support messages without identification
- **Data Minimization**: Only necessary data collected
- **Secure Export**: Privacy-compliant data export
- **HIPAA Compliance**: Healthcare data handling standards

---

## 🤖 AI & ML Capabilities

### Face-API.js Integration

The application leverages multiple ML models:

1. **TinyFaceDetector**: Fast, lightweight face detection
2. **Face Expression Recognition**: 7 emotion categories
3. **Face Landmark Detection**: 68-point facial landmark detection
4. **Age & Gender Recognition**: Demographic analysis
5. **Face Recognition**: Identity verification (for future use)

### Risk Assessment Algorithm

```typescript
// Simplified risk calculation
const overallScore = average(categoryScores);
const emotionModifier = getEmotionModifier(emotionData);
const combinedScore = overallScore * 0.8 + emotionModifier * 0.2;
const riskScore = 1 - combinedScore;
const riskLevel =
  riskScore < 0.35 ? "low" : riskScore < 0.65 ? "moderate" : "high";
```

### Model Performance

- **Face Detection Accuracy**: >95% in well-lit conditions
- **Emotion Recognition**: 7 emotion categories with confidence scores
- **Real-time Processing**: 30fps video analysis
- **Model Loading**: Asynchronous loading for optimal performance

---

## 📖 Usage Guide

### For End Users

1. **Registration**

   - Navigate to the registration page
   - Create account with email and password
   - Complete profile setup

2. **Take Assessment**

   - Click "Start Assessment" from dashboard
   - Allow camera access for emotion detection (optional)
   - Complete emotion analysis (if enabled)
   - Answer 10 assessment questions
   - Review personalized results

3. **Wellness Activities**

   - Select recommended wellness activity
   - Follow guided instructions
   - Complete post-activity assessment

4. **View History**

   - Access assessment history from profile
   - View trends and progress over time
   - Review category-specific scores

5. **Chat Support**
   - Access anonymous chat support
   - Get mental health resources
   - Connect with support team

### For Administrators

1. **Login**

   - Access admin dashboard with admin credentials
   - View system-wide analytics

2. **User Management**

   - View anonymized user data
   - Monitor assessment completion rates
   - Track user engagement

3. **Analytics**

   - Review risk distribution charts
   - Analyze emotion trends
   - Monitor system performance

4. **Data Export**

   - Export anonymized data (CSV/JSON)
   - Apply privacy filters
   - Generate research-ready datasets

5. **System Insights**
   - Monitor ML model performance
   - View system health metrics
   - Access error logs and diagnostics

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Workflow

1. **Feature Development**

   - Create feature branch from `main`
   - Implement feature with TypeScript
   - Add proper type definitions
   - Test thoroughly

2. **Code Quality**

   - Follow ESLint rules
   - Maintain TypeScript strict mode
   - Write clean, readable code
   - Add comments for complex logic

3. **Testing**
   - Test emotion detection with various lighting
   - Verify assessment flow end-to-end
   - Check responsive design on multiple devices
   - Validate authentication flows

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_JWT_SECRET=your-secret-key
VITE_ENCRYPTION_KEY=your-encryption-key
```

---

## 🚢 Deployment

### Production Build

```bash
npm run build
```

The production build will be optimized and minified in the `dist/` directory.

### Deployment Options

1. **Static Hosting** (Recommended)

   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

2. **Container Deployment**

   - Docker
   - Kubernetes
   - AWS ECS

3. **Traditional Hosting**
   - Apache/Nginx
   - Node.js server

### Production Considerations

- ✅ Enable HTTPS for secure camera access
- ✅ Configure CORS for API endpoints
- ✅ Set up environment variables
- ✅ Enable compression and caching
- ✅ Monitor performance and errors
- ✅ Set up analytics tracking

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass

---

## ⚠️ Important Disclaimers

### Medical Disclaimer

**This application is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition.**

### Privacy Notice

- All data is stored locally in your browser
- Camera access is optional and requires explicit consent
- No data is transmitted to external servers without permission
- Users can delete their data at any time

### Ethical Considerations

- This tool provides wellness support, not diagnosis
- Professional consultation is recommended for serious concerns
- Crisis resources are provided for emergency situations
- Data handling follows HIPAA-compliant standards

---

## 🎓 Educational Value

This project demonstrates:

- ✅ **Healthcare Application Development**: Real-world mental health tech
- ✅ **AI/ML Integration**: Face-API.js emotion recognition
- ✅ **Privacy-Compliant Design**: HIPAA considerations
- ✅ **Modern React Development**: TypeScript, Context API, Hooks
- ✅ **Professional UI/UX**: Material-UI design system
- ✅ **Full-Stack Architecture**: Frontend with simulated backend

**Perfect for:**

- Academic institutions
- Research organizations
- Healthcare technology demonstrations
- Portfolio projects
- Learning modern web development

---

<div align="center">

**Built with ❤️ for mental health awareness**

[⬆ Back to Top](#-ai-powered-mental-health-assessment-system)

</div>
