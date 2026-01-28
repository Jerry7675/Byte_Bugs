# 🚀 StartupConnect - Bridging Investors & Startups

> **A modern platform connecting investors with promising startups through intelligent matching, secure messaging, and verified profiles.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [Team](#-team)

---

## 🎯 Problem Statement

Startups struggle to find the right investors, while investors face difficulty discovering promising ventures that align with their interests. Traditional networking methods are inefficient, lack verification, and don't provide structured communication channels.

## 💡 Our Solution

**StartupConnect** is a comprehensive platform that:
- ✅ Connects verified investors with startups based on industry categories
- ✅ Provides secure, quota-managed messaging to prevent spam
- ✅ Offers a points-based system for platform interactions
- ✅ Features multi-stage verification for authenticity
- ✅ Enables community engagement through posts and announcements

---

## ✨ Key Features

### 👥 **Role-Based Access Control**
- **Investors**: Discover startups, manage portfolio, send investment offers
- **Startups**: Create profiles, post updates, request funding
- **Admins**: Platform management, verification review, analytics dashboard

### 🔐 **Multi-Stage Verification System**
- Document submission and review
- Stage-by-stage approval process
- Verified badge for authenticated profiles
- Admin review panel with approval/rejection workflow

### 💬 **Smart Messaging System**
- Role-based messaging (Investors ↔ Startups only)
- Daily message quota to prevent spam (50 messages/day)
- Message expiration for privacy

### 📝 **Community Feed**
- Create posts with categories (Funding, Technology, Marketing, Operations, General)
- Post types: Funding Requests, Investment Offers, Updates, Announcements, Milestones
- Image uploads with Supabase integration
- Tag-based organization

### 💰 **Points & Wallet System**
- Purchase points packages (200/Rs 50, 400/Rs 95, 2000/Rs 475)
- Mock payment flow with confirmation
- Transaction history tracking
- Admin wallet management tools

### 📊 **Analytics Dashboard**
- Real-time platform statistics
- User distribution metrics
- Activity monitoring
- Pending verification tracking

### 🎨 **Modern UI/UX**
- Responsive design with TailwindCSS
- Glass-morphism card effects
- Smooth animations and transitions
- Green-themed professional interface
- Toast notifications for user feedback

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 16.1.2** - React framework with App Router
- **React 19.2.3** - JavaScript library for building user interfaces
- **TypeScript 5.0** - Type-safe development
- **TailwindCSS 4.0** - Utility-first styling
- **Lucide Icons 0.562** - Modern icon library
- **Sonner 2.0** - Toast notifications
- **date-fns 4.1** - Date formatting
- **Framer Motion 12.29** - Animation library

### **Backend**
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM 7.2.0** - Database modeling and migrations
- **PostgreSQL 16** - Relational database
- **pg 8.17.1** - PostgreSQL client for Node.js
- **jsonwebtoken 9.0** - JWT authentication
- **nodemailer 7.0** - Email sending
- **Context-based Auth** - Custom authentication system

### **Storage**
- **Supabase Storage** - Image upload and hosting

### **Development Tools**
- **TypeScript 5.0** - Static type checking
- **ESLint** - Code linting
- **tsx 4.21** - TypeScript execution
- **Prisma CLI 7.2.0** - Database management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                        │
│  Next.js App Router • React Components • TailwindCSS        │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                       API LAYER                             │
│  Next.js API Routes • Request Context • Middleware          │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                     SERVICE LAYER                           │
│  Business Logic • Validation • Data Processing              │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      DATA LAYER                             │
│  Prisma ORM • PostgreSQL • Supabase Storage                 |
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 9+
- **PostgreSQL** 16+
- **Supabase** account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/startup-connect.git
   cd startup-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/startup_connect"
   
   # Supabase (for image uploads)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. **Create an Admin Account**
   - Register a new account
   - Manually update the role in the database to `ADMIN`
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Create Test Accounts**
   - Register as Investor
   - Register as Startup
   - Test the verification flow

---

## 📁 Project Structure

```
startup-connect/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (main)/           # Main application pages
│   │   ├── api/              # API routes
│   │   └── dashboard/        # Dashboard pages
│   ├── client/               # Client-side utilities
│   │   ├── api/             # API client functions
│   │   └── hooks/           # Custom React hooks
│   ├── components/           # React components
│   │   ├── dashboards/      # Dashboard components
│   │   ├── forms/           # Form components
│   │   ├── messaging/       # Messaging components
│   │   ├── posts/           # Post components
│   │   ├── profile/         # Profile components
│   │   └── verification/    # Verification components
│   ├── context/             # React Context providers
│   ├── lib/                 # Utility libraries
│   ├── server/              # Server-side code
│   │   ├── api/            # API layer
│   │   ├── services/       # Business logic
│   │   └── validators/     # Input validation
│   └── styles/             # Global styles
├── public/                  # Static assets
└── generated/              # Generated Prisma types
```

---

## 🎨 Key Pages & Features

### 🏠 **Landing Page**
- Dynamic statistics from database
- Hero section with floating animations
- Features showcase
- "How It Works" section
- Call-to-action buttons

### 👤 **Profile Management**
- Edit profile information
- Category selection (5 categories)
- Bio and profile image
- Verification status display

### 📱 **Dashboard**
- Role-specific dashboards (Investor/Startup/Admin)
- Quick stats overview
- Community feed integration
- Create post functionality

### 💬 **Messages**
- Sidebar with conversation list
- Real-time message interface
- Quota tracking
- Search conversations

### 💳 **Wallet**
- View current balance
- Purchase points packages
- Payment confirmation flow
- Transaction history (Admin)

### 🔍 **Admin Panel**
- Platform statistics
- Verification review queue
- User management
- Transaction monitoring

---

## 🔒 Security Features

- ✅ Role-based access control (RBAC)
- ✅ Server-side authentication validation
- ✅ Request context middleware
- ✅ SQL injection prevention (Prisma)
- ✅ Input validation and sanitization
- ✅ Protected API routes
- ✅ Secure file uploads with type validation

---

## 🌟 Future Enhancements

### Phase 1 (Next 3 Months)
- [ ] Real payment gateway integration (Stripe/Khalti/eSewa)
- [ ] Advanced search and filtering
- [ ] Investor portfolio tracking
- [ ] Email notifications

### Phase 2 (6 Months)
- [ ] Video call integration
- [ ] Document signing (eSignatures)
- [ ] Investment deal tracking
- [ ] Analytics and insights dashboard

### Phase 3 (1 Year)
- [ ] Automated pitch deck analysis
- [ ] Investment recommendation engine
- [ ] Multi-language support
- [ ] API for third-party integrations

---

## 📊 Database Schema

**Key Models:**
- **User** - Authentication and profile data
- **InvestorProfile** - Investor-specific information
- **StartupProfile** - Startup-specific information
- **Post** - Community posts and announcements
- **Conversation** - Message threads
- **Message** - Individual messages
- **VerificationApplication** - Multi-stage verification
- **PointsWallet** - User points and transactions
- **PointsTransaction** - Transaction history

---

## 🧪 Testing

```bash
# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Check database schema
npx prisma validate

# View database in Prisma Studio
npx prisma studio
```

---

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/upload` - Upload image

### Messages
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages/conversations` - Create conversation
- `GET /api/messages/:id` - Get messages
- `POST /api/messages/:id` - Send message

### Wallet
- `GET /api/wallet/balance` - Get balance
- `POST /api/wallet/mock-payment/init` - Initiate payment
- `POST /api/wallet/mock-payment/confirm` - Confirm payment
- `GET /api/wallet/transactions` - Get transactions

---

## 👨‍💻 Team

**Team Byte_Bugs**

- **[Your Name]** - Full Stack Developer
- **[Team Member 2]** - Frontend Developer
- **[Team Member 3]** - Backend Developer
- **[Team Member 4]** - UI/UX Designer

---

## 📄 License

This project is created for [Hackathon Name] 2026.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- TailwindCSS for the utility-first CSS framework
- All open-source contributors

---

## 📞 Contact

For any queries or demo requests:
- **Email**: team@bytebug.dev
- **GitHub**: [@yourteam](https://github.com/yourteam)
- **Demo**: [https://startup-connect-demo.vercel.app](https://startup-connect-demo.vercel.app)

---

<div align="center">
  
**Made with ❤️ by Team Byte_Bugs**

⭐ Star us on GitHub if you find this project interesting!

</div>
