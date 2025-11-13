# Mirai – AI Marketing Automation Platform 🚀

Next.js, Python, LangGraph, n8n, VAPI, Chatbase, Google Cloud | 12+ API Integrations

## 🌟 Overview

**Flagship Project**: Among 10+ AI and full-stack projects, Mirai stands out as a highly flexible, end-to-end automation system designed to redefine marketing workflows.

Developed an AI-powered marketing automation platform integrating 12+ APIs to streamline digital marketing operations. The system features an Ultimate Agent for Content Creation (in progress) for automating social media posts, photoshoots, and video campaigns, along with smart chatbot agents and upcoming WhatsApp automation.

## 🛠️ Key Features

### Ultimate Agent for Content Creation (In Progress)
- Automate social media posts, photoshoots, and video campaigns
- AI-driven content generation across multiple platforms

### Smart Chatbot Agents
- Intelligent conversational agents powered by Chatbase
- Seamless integration for customer engagement

### Email Marketing Automation
- Automates cold outreach, monitors inboxes, and intelligently replies to key messages
- Built using n8n workflows and LangGraph for robust automation
- Features RAG (Retrieval-Augmented Generation) for accurate responses
- Email categorization and quality assurance

### Voice Calling Automation
- Uses VAPI for real-time client communication, follow-ups, and lead qualification
- Advanced voice agents for personalized interactions
- n8n workflows for order confirmation calls

### WhatsApp Automation (Upcoming)
- Automated messaging workflows for enhanced customer communication

### Marketing Campaigns
- Excel-based marketing outreach with personalized email generation
- Lead tracking and campaign management

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Python** - For LangGraph and automation scripts
- **LangGraph** - Multi-agent orchestration framework
- **n8n** - Workflow automation tool
- **Prisma** - Modern database toolkit
- **MongoDB Atlas** / **PostgreSQL** - Cloud databases
- **JWT** - JSON Web Token authentication

### AI & Integrations
- **VAPI** - Voice calling automation
- **Chatbase** - Chatbot platform
- **Langchain** - AI agent development
- **Groq API** - Primary AI provider (Llama 3.3)
- **OpenAI API** - GPT models integration
- **Cohere API** - Natural language processing
- **Hugging Face** - Open-source AI models
- **Claude API** - Anthropic's AI assistant
- **Google Gemini** - Google's AI model
- **Google Gmail API** - Email automation
- **Retell AI** - Voice agent technology
- **12+ API Integrations** - Comprehensive third-party service integrations

### Deployment & Cloud
- **Google Cloud** - Scalable cloud infrastructure
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📁 Project Structure

```
Mirai/
├── src/                    # Frontend React/Next.js application
├── backend/                # Node.js backend with authentication & payments
├── langgraph-email-automation-main/  # Python email automation with LangGraph
├── aivoiceagentn8nworkflows/         # n8n workflows for voice agents
├── WhatsApp/               # WhatsApp automation workflows
├── public/                 # Static assets
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## 🚀 Live Demo

- **Frontend**: [https://mirai-ejxu.vercel.app](https://mirai-ejxu.vercel.app)
- **Backend API**: [https://mirai-5qov.onrender.com](https://mirai-5qov.onrender.com)

## ✅ Current Status vs 🗺️ Roadmap

**Working Now**:
- Email marketing automation with LangGraph and RAG
- Voice calling automation with VAPI and n8n
- Smart chatbot agents with Chatbase
- Multi-agent orchestration with LangGraph and n8n
- User authentication and payment processing
- Marketing campaign automation

**In Progress**:
- Ultimate Agent for Content Creation (social media posts, photoshoots, video campaigns)

**Planned**:
- WhatsApp automation
- Advanced analytics dashboard
- Mobile app integration
- Enterprise integrations
- Multi-language support

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn
- MongoDB Atlas account or PostgreSQL
- Required API keys (see below)

### 1. Clone the Repository
```bash
git clone https://github.com/Niteshagarwal01/Mirai.git
cd Mirai
```

### 2. Frontend Setup (Next.js/React)
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your keys
# VITE_BACKEND_URL=http://localhost:3001
# VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
# VITE_RAZORPAY_KEY_ID=your_razorpay_key

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Backend Setup (Node.js)
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your keys
# DATABASE_URL=your_mongodb_or_postgresql_url
# CLERK_SECRET_KEY=your_clerk_secret
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_secret

# Generate Prisma client
npx prisma generate
npx prisma db push

# Start backend server
npm run dev
```
Backend runs on `http://localhost:3001`

### 4. Python Email Automation Setup
```bash
cd langgraph-email-automation-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup Gmail API (follow GMAIL_SETUP.md)
# Create .env file with API keys
# MY_EMAIL=your_email@gmail.com
# GROQ_API_KEY=your_groq_key
# GEMINI_API_KEY=your_gemini_key

# Run email automation
python main.py
```

### 5. n8n Workflows Setup
- Import workflows from `aivoiceagentn8nworkflows/` and `WhatsApp/` folders
- Configure credentials for Retell AI, databases, etc.
- Set up webhooks for order confirmations and messaging

## 🔑 Required API Keys

### Authentication & Payments
- **Clerk**: [https://clerk.com](https://clerk.com)
- **Razorpay**: [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

### AI & Automation
- **VAPI**: [https://vapi.ai](https://vapi.ai)
- **Chatbase**: [https://chatbase.co](https://chatbase.co)
- **Groq**: [https://console.groq.com](https://console.groq.com)
- **OpenAI**: [https://platform.openai.com](https://platform.openai.com)
- **Google Gemini**: [https://makersuite.google.com](https://makersuite.google.com)
- **Retell AI**: For voice agents

### Email & Communication
- **Google Gmail API**: For email automation
- **Google Cloud**: [https://console.cloud.google.com](https://console.cloud.google.com)

### Databases
- **MongoDB Atlas**: [https://cloud.mongodb.com](https://cloud.mongodb.com)
- **PostgreSQL**: Local or cloud instance

## 📚 API Documentation

### Backend Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/checkout` - Create Razorpay payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/user/me` - Get user profile
- `GET /api/bots` - List user bots
- `POST /api/bots/create` - Create new bot

### Marketing Automation
- Email categorization and response generation via LangGraph
- Voice call initiation via n8n workflows
- Marketing campaign execution via Python scripts

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

### n8n Workflows
- Self-host n8n or use n8n cloud
- Import workflow JSON files
- Configure credentials and webhooks

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
- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting
- [Google Cloud](https://cloud.google.com) for scalable infrastructure
- [MongoDB Atlas](https://cloud.mongodb.com) for database hosting
- All the amazing AI providers that power our platform

---

**Built with ❤️ by the Mirai Team**

*Redefining marketing workflows through AI-powered automation*

