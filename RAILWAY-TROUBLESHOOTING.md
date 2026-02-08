# 🚨 Railway Deployment Troubleshooting Guide

## Common Railway Deployment Errors & Fixes

### Error 1: "Build Failed" or "Application Failed to Respond"

**Causes:**
- Missing dependencies
- Port configuration issues
- File structure problems

**Solutions:**

#### Fix 1: Verify File Structure
Make sure your files are organized EXACTLY like this:
```
polar-browser/
├── package.json
├── server.js
├── railway.json
├── nixpacks.toml
├── Procfile
├── .gitignore
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

#### Fix 2: Check Railway Logs
1. Go to your Railway project dashboard
2. Click on your service
3. Click "Deployments" tab
4. Click on the failed deployment
5. Check the logs for specific errors

#### Fix 3: Manual Railway Setup
If auto-deploy fails, try manual configuration:

1. **Go to Railway Dashboard**
2. **Click "New Project"**
3. **Select "Empty Project"**
4. **Click "Deploy from GitHub repo"**
5. **Connect your repository**
6. **In Settings, configure:**
   - **Root Directory**: `/` (or leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Custom Build File**: railway.json

---

### Error 2: "Module Not Found"

**Fix:**
1. Make sure `package.json` exists in the root directory
2. Check that all dependencies are listed:
   ```json
   "dependencies": {
     "express": "^4.18.2",
     "http-proxy-middleware": "^2.0.6",
     "cors": "^2.8.5",
     "compression": "^1.7.4"
   }
   ```
3. Railway will auto-run `npm install` during build

---

### Error 3: "Application Error" or "503 Service Unavailable"

**Causes:**
- Server not listening on correct port
- Server crash on startup

**Fix:**

Verify `server.js` has this line:
```javascript
const PORT = process.env.PORT || 3000;
```

Railway automatically sets the `PORT` environment variable.

---

### Error 4: "Cannot find module './public/index.html'"

**Fix:**
Make sure the `public` folder is uploaded with all files:
- public/index.html
- public/styles.css
- public/app.js

---

## 🎯 Step-by-Step Railway Deployment

### Method 1: Via GitHub (Recommended)

1. **Create GitHub Repository**
   ```bash
   # Initialize git in your polar-browser folder
   cd polar-browser
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   ```bash
   # Create a new repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/polar-browser.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js and deploy!

4. **Get Your URL**
   - Click on your service
   - Go to "Settings" → "Domains"
   - Click "Generate Domain"
   - Your site will be live at: `your-app.railway.app`

---

### Method 2: Via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd polar-browser
   railway init
   ```

4. **Link to Project**
   ```bash
   railway link
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Open Your App**
   ```bash
   railway open
   ```

---

### Method 3: Direct Upload (If GitHub Fails)

1. **Create New Project** on Railway dashboard
2. **Click "Empty Service"**
3. **Go to Settings**
4. **Under "Source"**, click "Connect Repo"
5. If GitHub fails, use Railway CLI method instead

---

## 🔍 Debugging Checklist

Before deploying, verify:

- [ ] `package.json` exists in root
- [ ] `server.js` exists in root
- [ ] `public/` folder exists with all 3 files
- [ ] `.gitignore` doesn't exclude important files
- [ ] No syntax errors in JavaScript files
- [ ] All files use UTF-8 encoding
- [ ] Git repository is initialized
- [ ] All files are committed to git

---

## 📋 Railway Environment Variables

Railway automatically provides:
- `PORT` - The port your app should listen on
- `RAILWAY_ENVIRONMENT` - Production/staging indicator
- `RAILWAY_PROJECT_ID` - Your project ID

**No manual environment variables needed for this project!**

---

## 🛠️ Alternative: Deploy to Render Instead

If Railway keeps failing, try Render.com (also free):

1. **Go to https://render.com**
2. **Sign up/Login**
3. **New → Web Service**
4. **Connect your GitHub repo**
5. **Configure:**
   - Name: polar-browser
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: Free
6. **Click "Create Web Service"**

Render is more forgiving with deployments!

---

## 🆘 Still Having Issues?

### Check These Common Mistakes:

1. **Wrong folder uploaded?**
   - Make sure you upload the `polar-browser` folder, not a parent folder
   - The `package.json` should be in the root

2. **Files not pushed to git?**
   ```bash
   git status  # Check what's tracked
   git add .   # Add all files
   git commit -m "Add all files"
   git push
   ```

3. **Incorrect file names?**
   - Must be exactly: `server.js` (not `Server.js`)
   - Must be exactly: `public` (not `Public`)
   - File names are case-sensitive on servers!

4. **Missing the public folder?**
   ```bash
   # Verify it exists
   ls -la
   # You should see the 'public' folder
   ```

---

## 💡 Quick Test Locally First

Before deploying, test locally:

```bash
cd polar-browser
npm install
npm start
```

Open `http://localhost:3000`

If it works locally, it should work on Railway!

---

## 🎯 Railway-Specific Files Included

I've created these files to help Railway deployment:

1. **railway.json** - Railway configuration
2. **nixpacks.toml** - Build configuration  
3. **Procfile** - Process configuration
4. **.gitignore** - Ignore node_modules

All are already in your folder!

---

## 📞 Getting Railway Logs

If deployment fails:

1. Railway Dashboard → Your Project
2. Click the failed deployment
3. Look at "Build Logs" and "Deploy Logs"
4. The error message will tell you exactly what's wrong

**Common log errors and fixes:**

- `Error: Cannot find module 'express'` → Run `npm install`
- `EADDRINUSE` → Port issue (shouldn't happen on Railway)
- `404 Not Found` → Check file paths in server.js
- `SyntaxError` → Check your JavaScript for typos

---

## ✅ Success Indicators

You'll know it worked when:

1. ✅ Build logs show: "Build successful"
2. ✅ Deploy logs show: "❄️ Polar Proxy running on port XXXX"
3. ✅ The generated URL opens your site
4. ✅ Front page loads correctly
5. ✅ You can click around and use features

---

## 🔄 Redeploying After Fixes

After fixing issues:

```bash
git add .
git commit -m "Fixed deployment issues"
git push
```

Railway will automatically redeploy!

---

## 📧 Last Resort

If nothing works:

1. Delete the Railway project
2. Create a fresh project
3. Use Render.com instead (easier for beginners)
4. Or deploy to Vercel/Netlify with serverless functions

---

**Most common fix: Make sure ALL files are in the repository and the folder structure is correct!** 🎯
