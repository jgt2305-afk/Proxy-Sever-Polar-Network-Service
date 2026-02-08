# 🎨 Customization Guide - Polar Browser

## Easy Customizations (No Coding Skills Needed!)

### 📽️ Adding Movies

**File to edit:** `public/app.js`

**Find this section:** (around line 2-70)
```javascript
const moviesDatabase = [
```

**Add your movie:**
```javascript
{title: "Your Movie Title", url: "https://drive.google.com/file/d/FILE_ID/view"},
```

**Example:**
```javascript
{title: "Frozen", url: "https://drive.google.com/file/d/ABC123XYZ/view"},
```

**For TV Series, add:**
```javascript
{title: "Breaking Bad S1", url: "https://drive.google.com/drive/folders/FOLDER_ID", type: "series"},
```

---

### 🎮 Adding Games

**File to edit:** `public/app.js`

**Find this section:** (around line 72-88)
```javascript
const gamesDatabase = [
```

**Add your game:**
```javascript
{title: "Game Name", url: "https://game-url.com", icon: "🎮", description: "Game description"},
```

**Example:**
```javascript
{title: "Mario Kart", url: "https://mariokart.io", icon: "🏎️", description: "Racing game"},
```

**Popular game icons:**
- 🎮 General game
- ⚔️ Action game
- 🧩 Puzzle game
- 🏃 Runner game
- 🎯 Target game
- 🎲 Board game
- 🃏 Card game
- 🏀 Sports game

---

### 📱 Adding Web Apps

**File to edit:** `public/app.js`

**Find this section:** (around line 90-106)
```javascript
const webAppsDatabase = [
```

**Add your app:**
```javascript
{title: "App Name", url: "https://app-url.com", icon: "📱", description: "What it does"},
```

**Example:**
```javascript
{title: "TikTok", url: "https://www.tiktok.com", icon: "🎵", description: "Short videos"},
```

---

### 🤝 Adding Partners

**File to edit:** `public/app.js`

**Find this section:** (around line 108-115)
```javascript
const partnersDatabase = [
```

**Add your partner:**
```javascript
{title: "Site Name", url: "https://site-url.com", icon: "🔗", description: "Site description"},
```

---

## 🎨 Changing Colors

**File to edit:** `public/styles.css`

**Find this section:** (around line 9-17)
```css
:root {
    --neon-cyan: #00ffff;
    --dark-bg: #0a0a0a;
    --accent-purple: #b030ff;
}
```

**Color options:**

**Neon Cyan (current):**
```css
--neon-cyan: #00ffff;  /* Cyan */
```

**Other neon colors:**
```css
--neon-cyan: #ff00ff;  /* Magenta */
--neon-cyan: #00ff00;  /* Green */
--neon-cyan: #ff0066;  /* Pink */
--neon-cyan: #ffff00;  /* Yellow */
--neon-cyan: #ff6600;  /* Orange */
--neon-cyan: #6600ff;  /* Purple */
```

**Background colors:**
```css
--dark-bg: #0a0a0a;    /* Almost black (current) */
--dark-bg: #000000;    /* Pure black */
--dark-bg: #1a1a2e;    /* Dark blue */
--dark-bg: #16213e;    /* Navy */
--dark-bg: #0f0f0f;    /* Dark gray */
```

---

## 🔤 Changing Browser Name

**File 1:** `public/index.html` (line 5)
```html
<title>Polar Browser - Next Level Proxy</title>
```
Change to:
```html
<title>Your Name Browser - Your Tagline</title>
```

**File 2:** `public/index.html` (line 41-42)
```html
<span class="logo-icon">❄️</span>
<span class="neon-text">POLAR</span>
```
Change to:
```html
<span class="logo-icon">🚀</span>
<span class="neon-text">YOUR NAME</span>
```

**File 3:** `public/index.html` (line 98)
```html
<h1 class="neon-title">❄️ POLAR BROWSER</h1>
```

**File 4:** `public/app.js` (last line)
```javascript
console.log('%c❄️ POLAR BROWSER', ...);
```

---

## 🏠 Changing Homepage Content

**File to edit:** `public/index.html`

**Find:** (around line 98-100)
```html
<h1 class="neon-title">❄️ POLAR BROWSER</h1>
<p class="subtitle">Your Gateway to the Unrestricted Web</p>
```

**Change to your text:**
```html
<h1 class="neon-title">🚀 MY AWESOME BROWSER</h1>
<p class="subtitle">Browse Anything, Anywhere</p>
```

---

## 🎯 Adding Quick Access Apps on Homepage

**File to edit:** `public/index.html`

**Find:** (around line 108-145)
```html
<div class="app-grid">
```

**Add a new tile:**
```html
<div class="app-tile" data-url="https://your-site.com">
    <div class="app-tile-icon">🔥</div>
    <div class="app-tile-name">Your App</div>
</div>
```

---

## 🔧 Advanced Customizations

### Adding a New Sidebar Section

**File to edit:** `public/index.html`

**Find the sidebar section** (around line 50-88)

**Add after existing sections:**
```html
<div class="sidebar-section">
    <div class="section-title">MY SECTION</div>
    <button class="sidebar-btn" data-page="mypage">
        <span class="sidebar-icon">⭐</span>
        <span>My Page</span>
    </button>
</div>
```

**Then add the page content** (after line 145):
```html
<div class="page-content hidden" id="mypage">
    <div class="page-header">
        <h1>⭐ My Custom Page</h1>
        <p>Your custom content here</p>
    </div>
    <div class="content-grid">
        <!-- Your content here -->
    </div>
</div>
```

---

### Changing Fonts

**File to edit:** `public/styles.css`

**Find:** (line 22)
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

**Change to:**
```css
font-family: 'Arial', sans-serif;
/* or */
font-family: 'Courier New', monospace;
/* or */
font-family: 'Georgia', serif;
```

**For custom fonts (like Google Fonts):**

**Step 1:** Add to `public/index.html` (in `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
```

**Step 2:** Update `public/styles.css`:
```css
font-family: 'Orbitron', sans-serif;
```

---

### Changing Animation Speed

**File to edit:** `public/styles.css`

**Find animations:**
```css
animation: neon-pulse 2s infinite;
```

**Change the number:**
```css
animation: neon-pulse 1s infinite;  /* Faster */
animation: neon-pulse 5s infinite;  /* Slower */
```

---

### Changing Particle Explosion Colors

**File to edit:** `public/app.js`

**Find:** (around line 537)
```javascript
const colors = ['#00ffff', '#00cccc', '#0099ff'];
```

**Change to:**
```javascript
const colors = ['#ff00ff', '#ff00aa', '#ff0066'];  /* Pink/Magenta */
const colors = ['#00ff00', '#00cc00', '#00aa00'];  /* Green */
const colors = ['#ffff00', '#ffcc00', '#ff9900'];  /* Yellow/Orange */
```

---

### Disabling Click Explosions

**File to edit:** `public/app.js`

**Find:** (around line 531-535)
```javascript
document.addEventListener('click', (e) => {
    if (e.target.closest('button, .app-tile, .content-card, .sidebar-btn')) {
        createExplosion(e.clientX, e.clientY);
    }
});
```

**Comment it out:**
```javascript
// document.addEventListener('click', (e) => {
//     if (e.target.closest('button, .app-tile, .content-card, .sidebar-btn')) {
//         createExplosion(e.clientX, e.clientY);
//     }
// });
```

---

### Changing Server Port

**File to edit:** `server.js`

**Find:** (line 7)
```javascript
const PORT = process.env.PORT || 3000;
```

**Change to:**
```javascript
const PORT = process.env.PORT || 8080;  /* Or any port you want */
```

---

## 🎬 Getting Google Drive Movie Links

1. Upload movie to Google Drive
2. Right-click → "Get link"
3. Change from "Restricted" to "Anyone with the link"
4. Copy the link
5. Use in moviesDatabase

**Link format:**
```
https://drive.google.com/file/d/FILE_ID_HERE/view
```

---

## ⚠️ Important Notes

### After Making Changes:

1. **If you edited files while server is running:**
   - Stop server: Press `Ctrl + C`
   - Restart: `npm start`

2. **Refresh your browser:**
   - Hard refresh: `Ctrl + Shift + R` (Windows/Linux)
   - Hard refresh: `Cmd + Shift + R` (Mac)

3. **If changes don't appear:**
   - Clear browser cache
   - Try in incognito/private mode

---

## 🎨 Pre-Made Color Themes

### Matrix Theme (Green)
```css
--neon-cyan: #00ff00;
--dark-bg: #000000;
--accent-purple: #00aa00;
```

### Cyberpunk Theme (Magenta/Purple)
```css
--neon-cyan: #ff00ff;
--dark-bg: #0a0a0a;
--accent-purple: #b030ff;
```

### Ocean Theme (Blue)
```css
--neon-cyan: #00ddff;
--dark-bg: #001a2e;
--accent-purple: #0066ff;
```

### Sunset Theme (Orange/Pink)
```css
--neon-cyan: #ff6600;
--dark-bg: #1a0a00;
--accent-purple: #ff0066;
```

### Toxic Theme (Lime)
```css
--neon-cyan: #ccff00;
--dark-bg: #0a1a00;
--accent-purple: #88ff00;
```

---

## 🆘 Quick Fixes

**Problem:** Changed something and now it's broken

**Solution:**
1. Download fresh copy of files
2. Copy your movies/games/apps data
3. Paste into fresh files

**Problem:** Colors look weird

**Solution:**
Make sure hex codes start with # and have 6 characters
```css
--neon-cyan: #00ffff;  /* Correct */
--neon-cyan: 00ffff;   /* Wrong - missing # */
--neon-cyan: #0ff;     /* Wrong - too short */
```

---

## 📝 Editing Tips

1. **Use a code editor:**
   - VS Code (recommended)
   - Sublime Text
   - Notepad++

2. **Don't use:**
   - Microsoft Word
   - Regular Notepad (on Windows)

3. **Make backups:**
   - Copy the whole folder before major changes
   - Save as "polar-browser-backup"

4. **Test locally first:**
   - Test on localhost:3000
   - Once working, deploy online

---

**Happy customizing! 🎨 Make it your own!** ❄️
