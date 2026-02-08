const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from ROOT directory (not public folder)
app.use(express.static(__dirname));

// Serve main page
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>❌ Error: index.html not found</h1>
      <p>Looking at: ${indexPath}</p>
      <p>Root directory: ${__dirname}</p>
      <p>Files in root: ${fs.existsSync(__dirname) ? fs.readdirSync(__dirname).join(', ') : 'Cannot read directory'}</p>
    `);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    rootPath: __dirname,
    indexExists: fs.existsSync(path.join(__dirname, 'index.html'))
  });
});

// Simple proxy endpoint (for future enhancement)
app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (url) {
    res.redirect(url);
  } else {
    res.status(400).json({ error: 'URL parameter required' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`❄️  Polar Proxy running on port ${PORT}`);
  console.log(`🔗 Access at: http://localhost:${PORT}`);
  console.log(`📁 Serving files from ROOT: ${__dirname}`);
});
