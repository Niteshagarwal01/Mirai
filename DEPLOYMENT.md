# Mirai Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render.com**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `mirai-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables on Render**
   Go to Environment → Add the following (use your actual values from backend/.env):
   ```
   NODE_ENV=production
   PORT=10000
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   DATABASE_URL=your_database_url
   GROQ_API_KEY=your_groq_api_key
   VAPI_API_KEY=your_vapi_api_key
   VAPI_ASSISTANT_ID=your_vapi_assistant_id
   ```

4. **Copy Your Backend URL**
   - After deployment, copy the URL (e.g., `https://mirai-backend-xyz.onrender.com`)

---

### 2. Frontend Deployment (Vercel)

1. **Update API Config**
   - Open `src/config/api.js`
   - Replace `'https://your-backend-url.onrender.com'` with your actual Render URL

2. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables on Vercel**
   Go to Settings → Environment Variables → Add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

---

### 3. Post-Deployment Configuration

1. **Update Clerk Dashboard**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Add your Vercel domain to allowed origins
   - Add your Render backend URL to allowed CORS origins

2. **Test Your Deployment**
   - Visit your Vercel URL
   - Test login functionality
   - Test Content Creator
   - Test Voice Agent
   - Test Media Studio

---

## 📦 What's Included

### Features Ready for Production:
- ✅ **Content Creator** - 9 content types with Groq AI
- ✅ **Voice Calling Agent** - VAPI integration with Rai
- ✅ **Media Studio** - AI photoshoot with Pollinations
- ✅ **Email Marketing** - Setup request form
- ✅ **Authentication** - Clerk integration
- ✅ **Responsive UI** - Works on all devices

### Backend Routes:
- `/api/content/types` - Get content types
- `/api/content/generate` - Generate content
- `/api/photoshoot/generate` - Generate AI images
- `/api/email-setup/request` - Email setup requests

---

## 🔧 Quick Commands

### Build Frontend Locally
```bash
npm run build
```

### Test Production Build
```bash
npm run preview
```

### Backend Start
```bash
cd backend
npm start
```

---

## 🐛 Troubleshooting

### Issue: CORS Errors
**Solution**: Add your Vercel URL to backend CORS configuration in `server.js`

### Issue: API Not Working
**Solution**: Check environment variables are set correctly on both platforms

### Issue: Voice Agent Not Loading
**Solution**: Ensure VAPI credentials are correct and npm package is installed

### Issue: Build Fails on Vercel
**Solution**: Check that all dependencies are in `package.json`, not `devDependencies`

---

## 📝 Environment Variables Checklist

### Frontend (Vercel):
- [ ] VITE_CLERK_PUBLISHABLE_KEY
- [ ] VITE_BACKEND_URL

### Backend (Render):
- [ ] NODE_ENV=production
- [ ] PORT=10000
- [ ] CLERK_SECRET_KEY
- [ ] CLERK_PUBLISHABLE_KEY
- [ ] DATABASE_URL
- [ ] GROQ_API_KEY
- [ ] VAPI_API_KEY
- [ ] VAPI_ASSISTANT_ID

---

## 🎉 Done!

Your Mirai AI platform should now be live and accessible at your Vercel URL!

**Frontend**: `https://your-app.vercel.app`
**Backend**: `https://your-backend.onrender.com`

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Render logs for backend errors
3. Verify all environment variables are set
4. Ensure Clerk dashboard is configured with correct URLs
