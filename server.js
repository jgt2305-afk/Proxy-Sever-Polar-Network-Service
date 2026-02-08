const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Log the public directory path for debugging
const publicPath = path.join(__dirname, 'public');
console.log('📁 Looking for public folder at:', publicPath);

// Check if public folder exists
if (fs.existsSync(publicPath)) {
  console.log('✅ Public folder found!');
  
  // Check for index.html
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found!');
  } else {
    console.log('❌ index.html NOT found at:', indexPath);
  }
  
  // List all files in public folder
  const files = fs.readdirSync(publicPath);
  console.log('📄 Files in public folder:', files);
} else {
  console.log('❌ Public folder NOT found at:', publicPath);
  console.log('📂 Current directory:', __dirname);
  console.log('📂 Files in current directory:', fs.readdirSync(__dirname));
}

// Serve static files from public directory
app.use(express.static(publicPath));

// Serve main page
app.get('/', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>❌ Error: index.html not found</h1>
      <p>Looking at: ${indexPath}</p>
      <p>Public folder: ${publicPath}</p>
      <p>Files in public: ${fs.existsSync(publicPath) ? fs.readdirSync(publicPath).join(', ') : 'Folder does not exist'}</p>
    `);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    publicPath: publicPath,
    publicExists: fs.existsSync(publicPath),
    indexExists: fs.existsSync(path.join(publicPath, 'index.html'))
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
});
