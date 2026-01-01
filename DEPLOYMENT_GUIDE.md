# Free Deployment Guide - Inventory Management System

## 🚀 Complete Free Deployment Solution

This guide will help you deploy both frontend and backend completely free using modern hosting platforms.

---

## 📋 Deployment Options

### Recommended Setup (100% Free)

- **Backend**: Render.com (Free tier)
- **Database**: MongoDB Atlas (Free tier - 512MB)
- **Frontend**: Vercel or Netlify (Free tier)

### Alternative Options

- **Backend**: Railway.app, Fly.io, or Cyclic.sh
- **Frontend**: GitHub Pages, Cloudflare Pages

---

## 🗄️ Step 1: Deploy MongoDB Database (Free)

### MongoDB Atlas Setup

1. **Create Account**

   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**

   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Configure Database Access**

   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**

   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**

   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `inventory_db`

   Example:

   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/inventory_db?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Prepare Backend for Deployment

### 2.1 Create Production Environment File

Create `backend/.env.production`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secure_random_string_at_least_32_characters_long
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 2.2 Update package.json

Add to `backend/package.json`:

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'"
  }
}
```

### 2.3 Create render.yaml (for Render.com)

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: inventory-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        sync: false
```

---

## 🌐 Step 3: Deploy Backend to Render.com

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: inventory-backend
     - **Root Directory**: backend
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
3. **Add Environment Variables**

   - Click "Environment" tab
   - Add:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a secure random string
     - `NODE_ENV`: production
     - `FRONTEND_URL`: (add after deploying frontend)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://your-app.onrender.com`

### Option B: Deploy via Render Dashboard

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Connect your repository
5. Follow same configuration as Option A

---

## 🎨 Step 4: Prepare Frontend for Deployment

### 4.1 Update API URL

Update `frontend/src/services/api.js`:

```javascript
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2 Create Environment File

Create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### 4.3 Add Build Script

Ensure `frontend/package.json` has:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🚀 Step 5: Deploy Frontend to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts**:

   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? inventory-frontend
   - Directory? ./
   - Override settings? No

5. **Add Environment Variable**

   ```bash
   vercel env add REACT_APP_API_URL production
   ```

   Enter your backend URL: `https://your-backend.onrender.com/api`

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Vercel Dashboard

1. **Go to Vercel**

   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project**

   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**

   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

4. **Add Environment Variables**

   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Copy your frontend URL: `https://your-app.vercel.app`

---

## 🔄 Step 6: Update CORS Settings

### Update Backend Environment Variable

1. Go to Render.com dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save changes (will trigger redeploy)

---

## 🌐 Alternative: Deploy Frontend to Netlify

### Via Netlify Dashboard

1. **Go to Netlify**

   - Visit https://www.netlify.com
   - Sign up/Login with GitHub

2. **Import Project**

   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Configure Build**

   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: frontend/build

4. **Add Environment Variables**

   - Go to "Site settings" → "Environment variables"
   - Add: `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment
   - Copy your URL: `https://your-app.netlify.app`

---

## 📝 Step 7: Seed Database (Optional)

### Run Seed Script

1. **Update seed.js** with production MongoDB URI temporarily
2. **Run locally**:
   ```bash
   cd backend
   node seed.js
   ```
3. **Or use Render Shell**:
   - Go to Render dashboard
   - Select your service
   - Click "Shell" tab
   - Run: `node seed.js`

---

## ✅ Step 8: Test Deployment

### Test Backend

```bash
curl https://your-backend.onrender.com/health
```

Should return:

```json
{
  "status": "OK",
  "timestamp": "2026-01-01T...",
  "uptime": 123.45
}
```

### Test Frontend

1. Visit your frontend URL
2. Try to login with seeded credentials:
   - Email: admin@inventory.com
   - Password: admin123

---

## 🎯 Free Tier Limitations

### Render.com (Backend)

- ✅ 750 hours/month (enough for 1 app)
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min inactivity (cold start ~30s)
- ⚠️ 512MB RAM

### MongoDB Atlas (Database)

- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Unlimited connections
- ⚠️ Limited to 3 clusters

### Vercel (Frontend)

- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ 100GB bandwidth/month
- ⚠️ 6000 build minutes/month

### Netlify (Frontend Alternative)

- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ 300 build minutes/month

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: App crashes on Render

- Check logs in Render dashboard
- Verify environment variables
- Check MongoDB connection string

**Problem**: CORS errors

- Verify FRONTEND_URL in backend env
- Check CORS configuration in server.js

**Problem**: Cold starts (slow first request)

- This is normal on free tier
- Consider upgrading or using a ping service

### Frontend Issues

**Problem**: API calls fail

- Check REACT_APP_API_URL is correct
- Verify backend is running
- Check browser console for errors

**Problem**: Build fails

- Check Node version compatibility
- Verify all dependencies installed
- Check build logs

### Database Issues

**Problem**: Can't connect to MongoDB

- Verify connection string
- Check IP whitelist (should be 0.0.0.0/0)
- Verify database user credentials

---

## 🚀 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Backend pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Backend health check passes
- [ ] Frontend environment variable set
- [ ] Frontend deployed to Vercel/Netlify
- [ ] CORS updated with frontend URL
- [ ] Database seeded (optional)
- [ ] Login tested
- [ ] All features working

---

## 💰 Cost Summary

| Service       | Free Tier       | Cost         |
| ------------- | --------------- | ------------ |
| MongoDB Atlas | 512MB           | $0           |
| Render.com    | 750hrs/month    | $0           |
| Vercel        | 100GB bandwidth | $0           |
| **Total**     |                 | **$0/month** |

---

## 🎉 You're Live!

Your inventory management system is now deployed and accessible worldwide for free!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas (managed)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

- Push to GitHub → Automatic deployment
- No manual steps needed
- Instant updates

---

## 🎯 Next Steps

1. Set up custom domain (optional)
2. Configure monitoring/alerts
3. Set up backup strategy
4. Add analytics
5. Implement error tracking (Sentry)

---

## 💡 Pro Tips

1. **Keep Render awake**: Use a service like UptimeRobot to ping your backend every 5 minutes
2. **Environment variables**: Never commit .env files to GitHub
3. **Monitoring**: Set up health check monitoring
4. **Backups**: MongoDB Atlas has automatic backups
5. **Logs**: Check Render logs regularly for errors

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section
2. Review deployment logs
3. Verify all environment variables
4. Test locally first
5. Check service status pages

---

**Happy Deploying! 🚀**
