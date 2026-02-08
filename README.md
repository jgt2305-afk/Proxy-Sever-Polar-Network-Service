# ❄️ POLAR BROWSER - Next Level Proxy

A fully-featured browser-style proxy with games, movies, apps, and unrestricted web access.

## 🚀 Features

### 🌐 Browser Features
- **Tab System**: Create, close, and switch between multiple tabs like a real browser
- **Navigation Controls**: Back, forward, refresh, and home buttons
- **Address Bar**: Search or enter URLs directly
- **Sidebar Navigation**: Quick access to all sections
- **Browser History**: Navigate through your browsing history

### 🎮 Games Library
Access popular browser games directly:
- Minecraft Classic
- 2048, Tetris, Chess
- Cookie Clicker
- Slither.io, Agar.io
- Run 3, Subway Surfers
- Temple Run 2, Geometry Dash
- Crossy Road, Flappy Bird
- Pac-Man, Snake
- And more!

### 🎬 Movies Library
Watch 70+ movies and TV shows:
- **Movies**: Harry Potter series, Marvel movies, Disney classics, and more
- **TV Series**: Stranger Things, Garfield & Friends, The CupHead Show, Murder Drones
- **Recent Releases**: Moana 2, Despicable Me 4, Five Nights at Freddy's
- All videos stream directly in the browser using Google Drive embeds

### 📱 Web Apps
Quick access to popular services:
- **Social**: YouTube, Discord, Reddit, Twitter
- **Development**: GitHub, Stack Overflow, CodePen, JSFiddle
- **Productivity**: Gmail, Google Drive, Notion, Trello, Slack
- **Creative**: Canva, Figma
- **Entertainment**: Spotify, Twitch, Netflix

### 🤝 Partners
Educational and development resources:
- Google Search
- Wikipedia
- W3Schools, MDN Web Docs
- And more!

## 📦 Installation

### Prerequisites
- Node.js 14.x or higher
- npm

### Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Run Production Server**
```bash
npm start
```

The server will start on port 3000 (or the PORT environment variable).

## 🎨 Design

- **Neon Cyan Theme**: Futuristic cyber aesthetic
- **Dark Mode**: Easy on the eyes
- **Responsive**: Works on desktop and mobile
- **Smooth Animations**: Particle explosions, hover effects, and transitions
- **Custom Cursor**: Neon-themed cursor trail

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Proxy**: http-proxy-middleware
- **Styling**: Custom CSS with neon effects
- **Animations**: CSS animations and JavaScript particle effects

## 🎯 Usage

### Browsing the Web
1. Enter a URL or search term in the address bar
2. Click "Go" or press Enter
3. The site loads in a proxied iframe

### Watching Movies
1. Click "Movies" in the sidebar
2. Browse or search for a movie
3. Click to watch - it opens in a new tab with Google Drive player

### Playing Games
1. Click "Games" in the sidebar
2. Browse or search for a game
3. Click to play - it opens in a new tab

### Using Apps
1. Click "Apps" in the sidebar or use quick access buttons
2. Click any app to open it in a proxied view

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + T`: New tab
- `Ctrl/Cmd + W`: Close current tab
- `Ctrl/Cmd + L`: Focus address bar
- `Enter`: Navigate to URL or search

## 🌟 Additional Apps You Can Host

Here are more apps you can add to your proxy:

### Streaming & Entertainment
- Hulu, Disney+, Prime Video
- SoundCloud, Pandora
- Vimeo, Dailymotion

### Communication
- WhatsApp Web, Telegram Web
- Microsoft Teams
- Facebook Messenger

### Productivity
- Monday.com, Asana, ClickUp
- Evernote, OneNote
- Calendly, Doodle

### Creative Tools
- Adobe Express, Photopea
- Blender (web version)
- Soundtrap, Bandlab

### Development Tools
- Replit, Glitch
- Heroku Dashboard
- VS Code Web

### Education
- Khan Academy, Coursera
- Duolingo, Memrise
- Quizlet, Kahoot

### File Storage
- Dropbox, OneDrive
- iCloud, Box
- MEGA, pCloud

### Gaming Platforms
- Poki, Miniclip
- Y8, Kongregate
- Armor Games

## 🚀 Deployment

### Railway
Already configured with `railway.json`:
```bash
railway up
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel/Netlify
May require additional configuration for Node.js backend.

## 🔒 Security Notes

- This is a web proxy and may not work with all sites
- Some sites actively block proxy access
- Use responsibly and respect website terms of service
- Not recommended for accessing sites with sensitive data

## 🎨 Customization

### Adding New Games
Edit `app.js` and add to `gamesDatabase`:
```javascript
{
    title: "Your Game",
    url: "https://game-url.com",
    icon: "🎮",
    description: "Game description"
}
```

### Adding New Movies
Edit `app.js` and add to `moviesDatabase`:
```javascript
{
    title: "Movie Name",
    url: "https://drive.google.com/file/d/FILE_ID/view",
    type: "movie" // or "series"
}
```

### Adding New Apps
Edit `app.js` and add to `webAppsDatabase`:
```javascript
{
    title: "App Name",
    url: "https://app-url.com",
    icon: "📱",
    description: "App description"
}
```

### Changing Theme Colors
Edit `styles.css` CSS variables:
```css
:root {
    --neon-cyan: #00ffff;
    --dark-bg: #0a0a0a;
    --accent-purple: #b030ff;
}
```

## 📝 License

MIT License - Feel free to use and modify!

## 🙏 Credits

- Movies hosted on Google Drive (various sources)
- Games from various free browser game platforms
- Icon emojis from Unicode standard

## 🐛 Known Issues

- Some sites may block iframe embedding
- Google Drive may have view limits
- Proxy may not work with sites requiring authentication

## 💡 Tips

- Use the search feature to quickly find content
- Create multiple tabs for multitasking
- Bookmark frequently used apps in your browser
- Some games work better than others depending on their hosting

---

**Made with ❄️ by the Polar Team**

Enjoy unrestricted web access! 🚀
