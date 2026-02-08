const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
