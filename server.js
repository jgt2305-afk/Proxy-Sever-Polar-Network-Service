const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from ROOT directory
app.use(express.static(__dirname));

// ==================== PROXY MIDDLEWARE ====================
app.use('/proxy', createProxyMiddleware({
    router: (req) => {
        const targetUrl = req.query.url;
        if (!targetUrl) return 'https://www.google.com';
        
        try {
            const url = new URL(targetUrl);
            return `${url.protocol}//${url.host}`;
        } catch (e) {
            return 'https://www.google.com';
        }
    },
    changeOrigin: true,
    ws: true,
    pathRewrite: (path, req) => {
        const targetUrl = req.query.url;
        if (!targetUrl) return '/';
        
        try {
            const url = new URL(targetUrl);
            return url.pathname + url.search + url.hash;
        } catch (e) {
            return '/';
        }
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader('origin');
        proxyReq.removeHeader('referer');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    },
    onProxyRes: (proxyRes, req, res) => {
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
        proxyRes.headers['access-control-allow-origin'] = '*';
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).send(`
            <div style="padding: 40px; text-align: center; font-family: Arial; background: #000; color: #00d9ff; height: 100vh; display: flex; align-items: center; justify-content: center;">
                <div>
                    <h1 style="font-size: 48px;">⚠️ Proxy Error</h1>
                    <p style="font-size: 18px;">Could not load this website</p>
                    <p style="font-size: 14px; opacity: 0.6;">${err.message}</p>
                </div>
            </div>
        `);
    }
}));

// ==================== MAIN ROUTES ====================
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <h1>❌ Error: index.html not found</h1>
            <p>Looking at: ${indexPath}</p>
        `);
    }
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        proxy: 'enabled',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║         ❄️  POLAR PROXY - REAL PROXY MODE ❄️            ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log('📡 Proxy: /proxy?url=YOUR_URL');
    console.log('✅ Server-side proxy (works in iframes, bypasses Opera)');
});
