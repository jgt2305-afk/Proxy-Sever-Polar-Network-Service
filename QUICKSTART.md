# 🚀 Quick Start Guide - Polar Browser

## Installation (3 steps)

1. **Install packages**
```bash
npm install
```

2. **Start the server**
```bash
npm start
```

3. **Open your browser**
Navigate to: `http://localhost:3000`

That's it! 🎉

## Quick Tour

### Main Sections (Sidebar)
- **Front Page** 🏠 - Homepage with search and quick apps
- **Games** 🎮 - 15+ browser games
- **Movies** 🎬 - 70+ movies and TV shows
- **Apps** 📱 - Popular web applications
- **Partners** 🤝 - Educational resources

### How to Use

**Browse the Web:**
- Type URL in top address bar → Click "Go"
- Or search anything → It will Google it

**Watch a Movie:**
- Sidebar → Movies → Click any movie
- It opens in a new tab automatically

**Play a Game:**
- Sidebar → Games → Click any game
- Plays directly in browser

**Use Quick Apps:**
- Click icons on Front Page
- Or use sidebar Quick Apps section

### Browser Controls
- **◀** Back button
- **▶** Forward button
- **⟳** Refresh page
- **🏠** Go to homepage
- **+** New tab
- **×** Close tab (on each tab)

### Keyboard Shortcuts
- `Ctrl+T` or `Cmd+T` - New tab
- `Ctrl+W` or `Cmd+W` - Close tab
- `Ctrl+L` or `Cmd+L` - Focus address bar
- `Enter` - Navigate/Search

## Features Checklist

✅ Multi-tab browsing like real browsers  
✅ Full web proxy (bypass restrictions)  
✅ 70+ movies streaming  
✅ 15+ instant browser games  
✅ Quick access to 16+ popular apps  
✅ Google Drive movie player built-in  
✅ Search movies and games  
✅ Neon cyan theme with animations  
✅ Particle explosion effects  
✅ Mobile responsive  

## Troubleshooting

**Server won't start?**
- Make sure you ran `npm install` first
- Check if port 3000 is available

**Movies won't play?**
- Check internet connection
- Some Google Drive links may have view limits
- Try refreshing the page

**Games won't load?**
- Some game sites may block iframes
- Try opening in a regular browser to verify

**Proxy not working for certain sites?**
- Some sites actively block proxy access
- This is normal - try different sites

## Adding Your Own Content

### Add a Game
In `public/app.js`, find `gamesDatabase` and add:
```javascript
{
    title: "Your Game",
    url: "https://your-game-url.com",
    icon: "🎮",
    description: "Description"
}
```

### Add a Movie
In `public/app.js`, find `moviesDatabase` and add:
```javascript
{
    title: "Movie Name",
    url: "https://drive.google.com/file/d/FILE_ID/view"
}
```

### Add an App
In `public/app.js`, find `webAppsDatabase` and add:
```javascript
{
    title: "App Name",
    url: "https://app-url.com",
    icon: "📱",
    description: "What it does"
}
```

Then refresh your browser!

## Deployment

**Railway:**
```bash
railway login
railway up
```

**Heroku:**
```bash
heroku create
git push heroku main
```

## Need Help?

Check the full README.md for detailed documentation.

Enjoy! ❄️✨
