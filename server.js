const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(express.json());

// CORS headers for iframe embedding
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Don't set X-Frame-Options to allow embedding
    next();
});

// Serve files from ROOT directory (no public folder)
const staticPath = __dirname;
console.log('📁 Serving files from:', staticPath);

// Check if index.html exists in root
const indexPath = path.join(staticPath, 'index.html');
if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found in root!');
} else {
    console.log('❌ index.html NOT found at:', indexPath);
}

// List all files in root directory
try {
    const files = fs.readdirSync(staticPath);
    console.log('📄 Files in root directory:', files.filter(f => !f.startsWith('.')).join(', '));
} catch(e) {
    console.log('Error listing files:', e.message);
}

// ==================== STATIC FILES ====================
// Serve static files from ROOT directory with proper headers
app.use(express.static(staticPath, {
    setHeaders: (res, path) => {
        // Set proper MIME types
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// ==================== ROUTES ====================
// Serve main page
app.get('/', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        background: #000; 
                        color: #00d9ff; 
                        padding: 40px;
                        text-align: center;
                    }
                    h1 { font-size: 48px; }
                    code { background: #111; padding: 5px 10px; border-radius: 3px; }
                </style>
            </head>
            <body>
                <h1>❌ Error: index.html not found</h1>
                <p>Looking at: <code>${indexPath}</code></p>
                <p>Root directory: <code>${staticPath}</code></p>
                <p>Files in root: ${fs.existsSync(staticPath) ? fs.readdirSync(staticPath).filter(f => !f.startsWith('.')).join(', ') : 'Cannot read directory'}</p>
                <hr>
                <p>Make sure these files are in the ROOT directory: index.html, styles.css, app.js, games_data.json</p>
            </body>
            </html>
        `);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        rootPath: staticPath,
        indexExists: fs.existsSync(path.join(staticPath, 'index.html')),
        files: fs.existsSync(staticPath) ? fs.readdirSync(staticPath).filter(f => !f.startsWith('.')) : []
    });
});

// Simple proxy endpoint for future enhancement (not currently used)
app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (url) {
        res.redirect(url);
    } else {
        res.status(400).json({ error: 'URL parameter required' });
    }
});

// ==================== ERROR HANDLING ====================
// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 Not Found</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #000; 
                    color: #00d9ff; 
                    padding: 40px;
                    text-align: center;
                }
                h1 { font-size: 48px; }
                a { color: #00d9ff; }
            </style>
        </head>
        <body>
            <h1>404 - Page Not Found</h1>
            <p>The requested URL <code>${req.url}</code> was not found.</p>
            <p><a href="/">Go to Home</a></p>
        </body>
        </html>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Server Error</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #000; 
                    color: #ff0000; 
                    padding: 40px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>500 - Internal Server Error</h1>
            <p>Something went wrong on the server.</p>
        </body>
        </html>
    `);
});

// ==================== START SERVER ====================
app.listen(PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║         ❄️  POLAR PROXY - STABLE VERSION ❄️             ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    console.log('');
    console.log('✅ Features Active:');
    console.log('   • DuckDuckGo Search (Privacy-Focused)');
    console.log('   • Direct App Embedding');
    console.log('   • All Games Display Fixed');
    console.log('   • Google Drive Movies (Simplified)');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('══════════════════════════════════════════════════════════');
});
