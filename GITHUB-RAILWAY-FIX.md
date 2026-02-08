# 🔧 GitHub + Railway Deployment - Step-by-Step Fix

## 🚨 Common GitHub + Railway Issues

### Issue 1: "Failed to Deploy" - Build Failed

**Most Common Cause:** Files not in the repository root

#### ✅ CORRECT Structure on GitHub:
```
your-repo/
├── package.json          ← Must be here (repo root)
├── server.js
├── railway.json
├── Procfile
├── nixpacks.toml
├── .gitignore
├── README.md
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

#### ❌ WRONG Structure:
```
your-repo/
└── polar-browser/        ← Extra folder = FAIL
    ├── package.json      ← Railway can't find this
    ├── server.js
    └── public/
```

**Fix:** Files must be in the repository ROOT, not in a subfolder.

---

## 🎯 Step-by-Step: GitHub + Railway (Correct Way)

### Step 1: Prepare Your Files

Extract the ZIP and you should see:
```
polar-browser/
├── package.json
├── server.js
├── railway.json
└── public/
```

### Step 2: Create GitHub Repository

1. **Go to GitHub.com**
2. **Click "New repository"**
3. **Name it:** `polar-browser` (or any name)
4. **Don't add README, .gitignore, or license** (we have these)
5. **Click "Create repository"**

### Step 3: Upload Files to GitHub

**Option A: Using Command Line (Recommended)**

```bash
# 1. Navigate to the polar-browser folder
cd polar-browser

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit"

# 5. Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/polar-browser.git

# 6. Push to main branch
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Desktop**

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose the `polar-browser` folder
4. Click "Publish repository"

**Option C: Upload via GitHub Website**

⚠️ **WARNING:** This can cause issues!

If you use "Add file" → "Upload files" on GitHub:
1. **DON'T** drag the whole `polar-browser` folder
2. **DO** drag the CONTENTS (package.json, server.js, public folder, etc.)

### Step 4: Verify Files on GitHub

After pushing, check your GitHub repository page:

✅ **You should see (at the root):**
- package.json
- server.js
- railway.json
- Procfile
- nixpacks.toml
- .gitignore
- public/ (folder)

❌ **You should NOT see:**
- polar-browser/ (folder containing everything)

### Step 5: Deploy to Railway

1. **Go to railway.app**
2. **Click "New Project"**
3. **Click "Deploy from GitHub repo"**
4. **Authorize Railway** to access your GitHub
5. **Select your repository** (`polar-browser`)
6. **Railway will start deploying automatically**

### Step 6: Check Deployment Status

Watch the deployment logs:
1. Click on your project
2. Click on the service
3. Click "Deployments"
4. Watch the build logs

**What you should see:**
```
Installing dependencies...
npm install
...
Build successful!
Starting server...
❄️ Polar Proxy running on port 3000
```

### Step 7: Get Your Live URL

1. In Railway, go to your service
2. Click "Settings"
3. Scroll to "Domains"
4. Click "Generate Domain"
5. Your site is live at: `your-app.railway.app`

---

## 🔍 Debugging Railway Errors

### Error: "No package.json found"

**Cause:** Files are in a subfolder

**Fix:**
```bash
# If you uploaded the whole polar-browser folder
# You need to move files to root

# 1. Clone your repo
git clone https://github.com/YOUR_USERNAME/polar-browser.git
cd polar-browser

# 2. Check if files are in a subfolder
ls -la
# If you see a 'polar-browser' folder here, that's the problem

# 3. Move files to root
mv polar-browser/* .
mv polar-browser/.gitignore .
rmdir polar-browser

# 4. Commit and push
git add .
git commit -m "Fix file structure"
git push
```

Railway will auto-redeploy!

---

### Error: "Build Failed" - Module not found

**Cause:** Missing dependencies or wrong Node version

**Fix:**

Make sure `package.json` has:
```json
{
  "engines": {
    "node": ">=14.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "cors": "^2.8.5",
    "compression": "^1.7.4"
  }
}
```

Railway Settings → Add Environment Variable:
- **Name:** `NODE_VERSION`
- **Value:** `18`

---

### Error: "Application failed to respond"

**Cause:** Port configuration

**Check server.js has:**
```javascript
const PORT = process.env.PORT || 3000;
```

This is already correct in the files I gave you!

---

### Error: "Cannot find public/index.html"

**Cause:** `public` folder not uploaded

**Fix:**
```bash
# Make sure public folder exists
ls -la public/

# You should see:
# index.html
# styles.css
# app.js

# If missing, add it:
git add public/
git commit -m "Add public folder"
git push
```

---

## 🎯 Railway Configuration

### In Railway Settings:

**Root Directory:** `/` (or leave blank)

**Build Command:** 
```
npm install
```

**Start Command:**
```
node server.js
```

**Watch Paths:** (leave default)

These should be auto-detected from your files!

---

## 📋 Checklist Before Deploying

- [ ] All files pushed to GitHub root (not in subfolder)
- [ ] `package.json` visible on GitHub repo main page
- [ ] `public/` folder visible on GitHub
- [ ] Railway connected to correct repository
- [ ] No syntax errors in code
- [ ] Works locally (`npm start`)

---

## 🔄 After Fixing Issues

Railway automatically redeploys when you push to GitHub:

```bash
# After fixing files
git add .
git commit -m "Fix deployment issues"
git push
```

Watch Railway dashboard - it will start building automatically!

---

## 🎨 Alternative: Manual Railway Setup

If auto-detection fails:

1. **Railway Dashboard → Your Project**
2. **Settings → Service**
3. **Manually configure:**
   - **Start Command:** `node server.js`
   - **Build Command:** `npm install`
   - **Root Directory:** `/`

4. **Redeploy:**
   - Deployments → Three dots → Redeploy

---

## 💡 Pro Tips

### Tip 1: Check Railway Logs in Real-Time
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Watch logs
railway logs
```

### Tip 2: Local Testing
```bash
# Set PORT like Railway does
PORT=3000 node server.js
```

### Tip 3: Force Redeploy
Sometimes Railway gets stuck:
1. Go to Deployments
2. Click on latest deployment
3. Three dots menu → "Redeploy"

---

## 🆘 Still Not Working?

### Copy This Info and Tell Me:

1. **What error message do you see?**
   - Check Railway → Deployments → Build Logs
   - Look for red error text

2. **What does your GitHub repo look like?**
   - Go to your repo page
   - What files/folders do you see?

3. **Railway Settings:**
   - What's the Start Command?
   - What's the Build Command?

With this info, I can tell you exactly what's wrong!

---

## ✅ Success Looks Like This

**GitHub:**
```
✓ package.json (in root)
✓ server.js (in root)
✓ public/ folder (in root)
```

**Railway Logs:**
```
✓ "Installing dependencies"
✓ "Build successful"
✓ "❄️ Polar Proxy running on port..."
✓ "Deployment successful"
```

**Browser:**
```
✓ Can access your-app.railway.app
✓ Front page loads
✓ Can navigate and use features
```

---

## 🚀 Quick Commands Reference

```bash
# Check your current structure
ls -la

# See what's tracked by git
git status

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# View Railway logs
railway logs

# Redeploy Railway
railway up --detach
```

---

**Most common fix: Make sure files are in GitHub root, not in a subfolder!** 🎯
