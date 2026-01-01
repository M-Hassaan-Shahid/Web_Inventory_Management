# 🚀 Deployment Quick Reference Card

## 📋 Checklist

```
□ MongoDB Atlas account
□ GitHub repository
□ Render.com account
□ Vercel account
□ 5 minutes of time
```

## 🔗 Important Links

| Service       | URL                       | Purpose          |
| ------------- | ------------------------- | ---------------- |
| MongoDB Atlas | https://cloud.mongodb.com | Database         |
| Render        | https://render.com        | Backend hosting  |
| Vercel        | https://vercel.com        | Frontend hosting |
| GitHub        | https://github.com        | Code repository  |

## 🔑 Environment Variables

### Backend (Render)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=32+_random_characters
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Frontend (Vercel)

```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 📝 Quick Commands

### Local Development

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm start
```

### Git Push

```bash
git init
git add .
git commit -m "Deploy"
git push origin main
```

### Seed Database

```bash
cd backend && npm run seed
```

## 🎯 Default Credentials

After seeding:

```
Admin:   admin@inventory.com / admin123
Manager: manager@inventory.com / manager123
Staff:   staff@inventory.com / staff123
```

## 🔧 Troubleshooting

| Problem             | Solution                |
| ------------------- | ----------------------- |
| Backend won't start | Check Render logs       |
| CORS error          | Update FRONTEND_URL     |
| Can't connect to DB | Check MongoDB whitelist |
| Frontend 404        | Check REACT_APP_API_URL |
| Cold start delay    | Normal, wait 30s        |

## 📊 Free Tier Limits

```
Render:   750 hours/month (enough for 1 app)
MongoDB:  512MB storage
Vercel:   100GB bandwidth/month
```

## 🎉 Success URLs

After deployment:

```
Frontend: https://your-app.vercel.app
Backend:  https://your-backend.onrender.com
Health:   https://your-backend.onrender.com/health
```

## 💡 Pro Tips

1. Use UptimeRobot to keep backend awake
2. Enable auto-deploy from GitHub
3. Monitor logs regularly
4. Change default passwords
5. Add custom domain (optional)

## 📚 Full Guides

- **Quick (5 min)**: QUICK_DEPLOY.md
- **Detailed**: DEPLOYMENT_GUIDE.md
- **Summary**: DEPLOYMENT_SUMMARY.md

---

**Print this page for quick reference! 📄**
