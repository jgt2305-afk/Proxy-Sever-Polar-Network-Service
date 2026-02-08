# 🚀 Deployment Guide - Polar Browser

## Deploy to Railway (EASIEST - Free Tier Available)

### Method 1: Using Railway CLI

1. **Install Railway CLI**
```bash
npm install -g railway
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Deploy**
```bash
railway up
```

5. **Get your URL**
```bash
railway open
```

### Method 2: Using Railway Dashboard

1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your GitHub account
6. Push this folder to a GitHub repo
7. Select the repo in Railway
8. Railway will auto-detect and deploy!

Your site will be live at: `your-app.railway.app`

---

## Deploy to Heroku (Popular Choice)

1. **Install Heroku CLI**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku**
```bash
heroku login
```

3. **Create a new app**
```bash
heroku create your-polar-browser
```

4. **Initialize Git (if not already)**
```bash
git init
git add .
git commit -m "Initial commit"
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open your app**
```bash
heroku open
```

Your site will be live at: `your-polar-browser.herokuapp.com`

---

## Deploy to Render (Free Tier)

1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select your repository
6. Configure:
   - **Name**: polar-browser
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. Click "Create Web Service"

Your site will be live at: `your-app.onrender.com`

---

## Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow prompts**
   - Set up and deploy: Y
   - Which scope: (your account)
   - Link to existing project: N
   - Project name: polar-browser
   - Directory: ./
   - Override settings: N

4. **Production deploy**
```bash
vercel --prod
```

Your site will be live at: `your-app.vercel.app`

---

## Deploy to Netlify

**Note**: Netlify is primarily for static sites. You'll need to use Netlify Functions for the proxy.

### Alternative for Netlify:
1. Use one of the above services (Railway, Heroku, Render)
2. They're better suited for Node.js applications with proxies

---

## Environment Variables (if needed)

If you want to customize the port or add other settings:

### Railway/Heroku/Render:
They automatically set the PORT environment variable. No action needed!

### For custom port locally:
Create a `.env` file:
```
PORT=3000
```

Then install dotenv:
```bash
npm install dotenv
```

Update server.js (first line):
```javascript
require('dotenv').config();
```

---

## Post-Deployment Checklist

✅ Server is running
✅ Can access the URL
✅ Front page loads
✅ Movies play in iframe
✅ Games load in iframe
✅ Proxy works for websites
✅ Tabs can be created/closed
✅ Search functionality works

---

## Troubleshooting Deployment

### Issue: "Application Error"
**Solution**: Check logs
```bash
# Railway
railway logs

# Heroku
heroku logs --tail

# Render
Check dashboard logs
```

### Issue: "Module not found"
**Solution**: Make sure package.json is correct
```bash
# Reinstall dependencies
npm install
```

### Issue: "Port already in use"
**Solution**: The hosting service sets the port automatically. Make sure server.js uses:
```javascript
const PORT = process.env.PORT || 3000;
```

### Issue: "Proxy not working"
**Solution**: 
- Some sites block iframe embedding (normal)
- Try different sites
- Check if the hosting service allows proxying

---

## Custom Domain (Optional)

### Railway:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as shown

### Heroku:
```bash
heroku domains:add www.yourdomain.com
```
Then update your DNS records

### Render:
1. Go to Settings
2. Click "Custom Domains"
3. Add domain and follow DNS instructions

---

## Recommended: Railway

**Why Railway?**
- ✅ Easiest to deploy
- ✅ Free tier available
- ✅ Auto-detects Node.js
- ✅ Great for proxies
- ✅ Fast deployment
- ✅ Good free bandwidth

**Alternatives:**
- Heroku (popular but charges for dynos now)
- Render (good free tier)
- Vercel (requires functions setup)

---

## Cost Comparison

| Service | Free Tier | Best For |
|---------|-----------|----------|
| Railway | 500 hrs/month | Quick deploys |
| Heroku | $0 (with credit card) | Production apps |
| Render | 750 hrs/month | Free hosting |
| Vercel | Unlimited | Static + Serverless |

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Heroku Docs: https://devcenter.heroku.com
- Render Docs: https://render.com/docs

---

**Ready to deploy? Just pick a service and follow the steps above!** 🚀

Your Polar Browser will be live on the internet in minutes! ❄️
