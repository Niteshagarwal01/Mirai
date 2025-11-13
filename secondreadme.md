## 🚀 Live Demo

- **Frontend**: [https://mirai-ejxu.vercel.app](https://mirai-ejxu.vercel.app)
- **Backend API**: [https://mirai-5qov.onrender.com](https://mirai-5qov.onrender.com)

## ✅ Current Status vs 🗺️ Roadmap

**Working Now**: Email marketing automation, Voice calling automation, Smart chatbot agents, Multi-agent orchestration with LangGraph and n8n.

**In Progress**: Ultimate Agent for Content Creation (social media posts, photoshoots, video campaigns).

**Planned**: WhatsApp automation, Advanced analytics, Mobile app, Enterprise integrations, Multi-language support.

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
- Python 3.8+
- npm or yarn
- MongoDB Atlas account
- Required API keys (see below)

### Backend Setup (Node.js)

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

# AI & Integration API Keys
VAPI_API_KEY="your_vapi_api_key"
CHATBASE_API_KEY="your_chatbase_api_key"
# Add other 12+ API keys as needed

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

### Python Setup (LangGraph Automation)

1. **Navigate to the Python directory**
```bash
cd langgraph-email-automation-main
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure Gmail API** (for email automation)
Follow the instructions in `GMAIL_SETUP.md`

4. **Run the automation**
```bash
python main.py
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

### Authentication
- **Clerk**: [https://clerk.com](https://clerk.com)

### AI & Automation
- **VAPI**: [https://vapi.ai](https://vapi.ai)
- **Chatbase**: [https://chatbase.co](https://chatbase.co)
- **Google Cloud**: [https://console.cloud.google.com](https://console.cloud.google.com)
- **n8n**: Self-hosted or cloud instance
- **LangGraph**: Integrated via Python

### Database
- **MongoDB Atlas**: [https://cloud.mongodb.com](https://cloud.mongodb.com)

### Payment Gateway
- **Razorpay**: [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification

### Marketing Automation
- `POST /api/automation/email` - Trigger email automation
- `POST /api/automation/voice` - Initiate voice calling
- `GET /api/chatbots` - Manage chatbot agents

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

### Python Automation (Google Cloud)
1. Deploy to Google Cloud Functions or App Engine
2. Configure service accounts and permissions
3. Set up scheduled tasks for automation

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

- [LangGraph](https://langchain-ai.github.io/langgraph/) for multi-agent orchestration
- [n8n](https://n8n.io) for workflow automation
- [VAPI](https://vapi.ai) for voice calling
- [Chatbase](https://chatbase.co) for chatbot platform
- [Google Cloud](https://cloud.google.com) for scalable infrastructure
- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting
- [MongoDB Atlas](https://cloud.mongodb.com) for database hosting

---

**Built with ❤️ by the Mirai Team**

*Redefining marketing workflows through AI-powered automation*
