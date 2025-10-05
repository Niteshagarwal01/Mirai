# Mirai AI Platform 🚀

A comprehensive AI-powered content generation and business planning platform that helps users create high-quality content for various social media platforms and develop strategic business plans.

## 🌟 Features

### Content Generation
- **Multi-Platform Support**: Generate content for Instagram, LinkedIn, Twitter, and blog posts
- **Multiple AI Providers**: Integrated with Groq (Llama 3.3), OpenAI, Cohere, Hugging Face, Claude, and Gemini
- **Customizable Content**: Choose tone (Professional, Casual, Creative, Formal) and length (Short, Medium, Long)
- **Real-time Generation**: Fast AI-powered content creation with multiple provider fallbacks

### Business Planning
- **AI Business Plan Generator**: Create comprehensive business plans using advanced AI
- **Strategic Planning**: Get detailed business strategies, market analysis, and growth plans
- **Professional Templates**: Industry-standard business plan formats

### User Management
- **Secure Authentication**: Powered by Clerk with JWT-based authentication
- **Pro Features**: Premium subscription model with Razorpay integration
- **User Dashboard**: Personalized dashboard with usage tracking

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel for user management
- **Analytics**: Track user engagement and platform usage
- **Content Moderation**: Monitor and manage generated content

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Prisma** - Modern database toolkit
- **MongoDB Atlas** - Cloud database
- **JWT** - JSON Web Token authentication

### AI Integration
- **Groq API** - Primary AI provider (Llama 3.3)
- **OpenAI API** - GPT models integration
- **Cohere API** - Natural language processing
- **Hugging Face** - Open-source AI models
- **Claude API** - Anthropic's AI assistant
- **Google Gemini** - Google's AI model

### Payment Processing
- **Razorpay** - Payment gateway for Pro subscriptions

### Deployment
- **Frontend**: Vercel - Fast and reliable hosting
- **Backend**: Render - Scalable cloud hosting
- **Database**: MongoDB Atlas - Cloud database service

## 🚀 Live Demo

- **Frontend**: [https://mirai-ejxu.vercel.app](https://mirai-ejxu.vercel.app)
- **Backend API**: [https://mirai-5qov.onrender.com](https://mirai-5qov.onrender.com)

## 📸 Screenshots

<img width="1919" height="976" alt="Screenshot 2025-10-05 163221" src="https://github.com/user-attachments/assets/37844322-501f-4558-9852-81e1f23fb477" />

<img width="1919" height="971" alt="Screenshot 2025-10-05 163234" src="https://github.com/user-attachments/assets/81e0821b-1ccf-4019-acc0-ec1540902e13" />
<img width="1913" height="974" alt="Screenshot 2025-10-05 163243" src="https://github.com/user-attachments/assets/93e4cf44-5d0e-4466-a9c1-2455ca33da51" />
<img width="1919" height="928" alt="Screenshot 2025-10-05 163354" src="https://github.com/user-attachments/assets/706d72fb-d199-4235-a5c8-3010505208a7" />
<img width="1916" height="937" alt="Screenshot 2025-10-05 163337" src="https://github.com/user-attachments/assets/4537dad0-8d96-4436-97e0-2fc2c0ea0467" />
<img width="1919" height="970" alt="Screenshot 2025-10-05 163326" src="https://github.com/user-attachments/assets/153d7af6-de62-40eb-bc27-2e7bba6d870a" />
<img width="1919" height="966" alt="Screenshot 2025-10-05 163302" src="https://github.com/user-attachments/assets/718e9afa-460d-495c-86b8-223267c41631" />
<img width="1919" height="1024" alt="Screenshot 2025-10-05 172204" src="https://github.com/user-attachments/assets/359bae15-2ed1-4ce0-bfa4-17ce100a5283" />
<img width="1919" height="1020" alt="Screenshot 2025-10-05 172145" src="https://github.com/user-attachments/assets/8cff0e4f-a762-4149-b01f-b0e2da0ece2a" />
<img width="1915" height="975" alt="Screenshot 2025-10-05 172024" src="https://github.com/user-attachments/assets/0e227fc7-b181-40ba-9f26-7262a6f93365" />
<img width="1919" height="1062" alt="Screenshot 2025-10-05 173907" src="https://github.com/user-attachments/assets/893fd1b1-206b-41d3-9987-0b9c5975bf5f" />
<img width="1919" height="1079" alt="Screenshot 2025-06-21 221738" src="https://github.com/user-attachments/assets/d8c81c8a-abc8-49c4-a090-d75f8d1c46c9" />
<img width="1919" height="1079" alt="Screenshot 2025-06-21 210919" src="https://github.com/user-attachments/assets/d42055dc-cf59-4d2a-b915-1b6176c70307" />
<img width="1919" height="1079" alt="Screenshot 2025-06-21 200912" src="https://github.com/user-attachments/assets/5a073e63-3341-4d50-b520-06bebcca27ef" />


## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Required API keys (see below)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Niteshagarwal01/Mirai.git
cd Mirai
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL="your_mongodb_atlas_connection_string"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# AI Provider API Keys
GROQ_API_KEY="your_groq_api_key"
OPENAI_API_KEY="your_openai_api_key"
COHERE_API_KEY="your_cohere_api_key"
HUGGINGFACE_API_KEY="your_huggingface_api_key"
CLAUDE_API_KEY="your_claude_api_key"
GEMINI_API_KEY="your_gemini_api_key"

# Payment
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Server Configuration
PORT=3001
NODE_ENV=development
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the backend server**
```bash
npm run dev
```

### Frontend Setup

1. **Install frontend dependencies**
```bash
cd ..  # Back to root directory
npm install
```

2. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Backend API
VITE_BACKEND_URL=http://localhost:3001

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"

# Payment
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

3. **Start the frontend development server**
```bash
npm run dev
```

4. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 🔑 Required API Keys

### Clerk Authentication
1. Sign up at [Clerk](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys

### AI Provider Keys
- **Groq**: [https://console.groq.com](https://console.groq.com)
- **OpenAI**: [https://platform.openai.com](https://platform.openai.com)
- **Cohere**: [https://dashboard.cohere.ai](https://dashboard.cohere.ai)
- **Hugging Face**: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- **Claude**: [https://console.anthropic.com](https://console.anthropic.com)
- **Gemini**: [https://makersuite.google.com](https://makersuite.google.com)

### Database
- **MongoDB Atlas**: [https://cloud.mongodb.com](https://cloud.mongodb.com)

### Payment Gateway
- **Razorpay**: [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification

### Content Generation
- `POST /api/ai/generate` - Generate AI content
- `GET /api/ai/providers` - Get available AI providers

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/subscription` - Get subscription status

### Payment
- `POST /api/checkout/create` - Create payment session
- `POST /api/webhooks/razorpay` - Handle payment webhooks

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend (Render)
1. Connect repository to Render
2. Choose "Web Service"
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@mirai-ai.com or join our Discord community.

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting
- [MongoDB Atlas](https://cloud.mongodb.com) for database hosting
- All the amazing AI providers that power our platform

---

**Built with ❤️ by the Mirai Team**

*Empowering creativity through AI-powered content generation*
