const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from root directory
app.use(express.static(__dirname));

// Log what we're serving
console.log('📁 Serving files from:', __dirname);
console.log('📂 Files in root:', fs.readdirSync(__dirname).filter(f => !f.startsWith('.')));

// Serve main page
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('✅ Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found at:', indexPath);
    res.status(404).send(`
      <h1>❌ Error: index.html not found</h1>
      <p>Looking at: ${indexPath}</p>
      <p>Files in directory: ${fs.readdirSync(__dirname).join(', ')}</p>
    `);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    rootPath: __dirname,
    indexExists: fs.existsSync(path.join(__dirname, 'index.html')),
    files: fs.readdirSync(__dirname).filter(f => !f.startsWith('.'))
  });
});

// Simple proxy endpoint
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
});
