# Mirai Backend - Authentication & Payment Services

A streamlined backend service for the Mirai AI Platform, focused on core authentication and payment processing.

## 🎯 Features

- **Clerk Authentication** - Secure JWT-based user authentication
- **Razorpay Payment Gateway** - Process subscription payments for Pro plans
- **MongoDB Database** - User and subscription data management
- **RESTful API** - Clean API endpoints for frontend integration

## 🏗️ Architecture

### Tech Stack
- **Node.js** + **Express.js** - Backend framework
- **Prisma ORM** - Database access layer
- **MongoDB Atlas** - Cloud database
- **Clerk SDK** - Authentication middleware
- **Razorpay SDK** - Payment processing

### API Endpoints

#### Authentication (Handled by Clerk)
- User authentication is handled by Clerk on the frontend
- Backend validates JWT tokens using Clerk SDK

#### User Management
- `GET /api/user/me` - Get current user profile
- `GET /api/user/plan` - Get user's subscription plan

#### Payment Processing
- `POST /api/checkout` - Create Razorpay payment order
- `POST /api/payment/verify` - Verify payment signature
- `POST /api/webhooks/razorpay` - Handle Razorpay webhooks

#### Health Checks
- `GET /health` - Server health status
- `GET /api/health/database` - Database connection status
- `GET /api/health/razorpay` - Razorpay configuration status
- `GET /api/health/clerk` - Clerk configuration status

## 🚀 Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account
- Razorpay account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   - `DATABASE_URL` - MongoDB connection string
   - `CLERK_SECRET_KEY` - Clerk secret key
   - `RAZORPAY_KEY_ID` - Razorpay key ID
   - `RAZORPAY_KEY_SECRET` - Razorpay secret key

3. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:3001`

## 📊 Database Schema

### User Model
```prisma
model User {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  clerkUserId String   @unique
  email       String   @unique
  plan        String   @default("free")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Plans**: `free`, `pro`, `starter`, `professional`, `enterprise`

## 💳 Payment Flow

1. User clicks "Upgrade to Pro" on frontend
2. Frontend calls `POST /api/checkout` to create Razorpay order
3. Razorpay Checkout modal opens
4. User completes payment
5. Frontend calls `POST /api/payment/verify` to verify signature
6. Backend upgrades user plan to "pro"
7. Razorpay webhook confirms payment (optional backup)

## 🔒 Security

- **JWT Validation** - All protected routes validate Clerk JWT tokens
- **Signature Verification** - Razorpay payments verified with HMAC signatures
- **CORS Protection** - Configured for specific frontend origins
- **Environment Variables** - Sensitive data stored in .env file

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run build` - Generate Prisma client
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

### Project Structure

```
backend/
├── routes/
│   ├── checkout.js      # Payment order creation
│   ├── user.js          # User profile and plan
│   └── webhooks.js      # Payment webhooks
├── middleware/
│   ├── clerkAuth.js     # Clerk JWT validation
│   └── adminAccess.js   # Admin access control
├── lib/
│   ├── prisma.js        # Prisma client
│   └── stripe.js        # Razorpay client
├── prisma/
│   └── schema.prisma    # Database schema
├── server.js            # Express app entry point
└── package.json
```

## 🌍 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_mongodb_atlas_url
CLERK_SECRET_KEY=sk_live_xxx
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
FRONTEND_URL=https://your-frontend-domain.com
```

### Deploy to Render

1. Connect GitHub repository to Render
2. Create new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for Mirai AI Platform**
