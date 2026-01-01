# 🚀 Quick Deployment Guide (5 Minutes)

## Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Render.com account (free)
- Vercel account (free)

---

## Step 1: MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0)
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Get connection string

**Connection String Format:**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/inventory_db?retryWrites=true&w=majority
```

---

## Step 2: Push to GitHub (1 minute)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 3: Deploy Backend on Render (1 minute)

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:

   - **Name**: inventory-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. Add Environment Variables:

   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Any random 32+ character string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Leave empty for now

7. Click "Create Web Service"
8. **Copy your backend URL**: `https://your-app.onrender.com`

---

## Step 4: Deploy Frontend on Vercel (1 minute)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:

   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Add Environment Variable:

   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend.onrender.com/api`

7. Click "Deploy"
8. **Copy your frontend URL**: `https://your-app.vercel.app`

---

## Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save (will trigger redeploy)

---

## Step 6: Seed Database (Optional)

### Option A: Via Render Shell

1. Go to Render dashboard
2. Select your service
3. Click "Shell" tab
4. Run: `npm run seed`

### Option B: Locally

1. Update `backend/.env` with production MongoDB URI
2. Run: `cd backend && npm run seed`
3. Revert `.env` changes

---

## ✅ Done!

Your app is now live at:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com

### Default Login Credentials:

- **Admin**: admin@inventory.com / admin123
- **Manager**: manager@inventory.com / manager123
- **Staff**: staff@inventory.com / staff123

---

## 🔧 Troubleshooting

### Backend not starting?

- Check Render logs
- Verify MongoDB connection string
- Check environment variables

### Frontend can't connect?

- Verify `REACT_APP_API_URL` is correct
- Check backend is running
- Wait for backend cold start (~30s)

### CORS errors?

- Update `FRONTEND_URL` in backend
- Redeploy backend

---

## 💡 Pro Tips

1. **Keep backend awake**: Use UptimeRobot to ping every 5 minutes
2. **Custom domain**: Add in Vercel/Render settings
3. **Monitor**: Check logs regularly
4. **Backup**: MongoDB Atlas has automatic backups

---

## 📚 Full Documentation

See `DEPLOYMENT_GUIDE.md` for detailed instructions and alternatives.

---

**Total Time: ~5 minutes** ⚡
**Total Cost: $0/month** 💰
