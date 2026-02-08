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

// ==================== STATIC FILES ====================
// Serve static files from public directory with proper headers
app.use(express.static(publicPath, {
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
    const indexPath = path.join(publicPath, 'index.html');
    
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
                <p>Public folder: <code>${publicPath}</code></p>
                <p>Files in public: ${fs.existsSync(publicPath) ? fs.readdirSync(publicPath).join(', ') : 'Folder does not exist'}</p>
                <hr>
                <p>Make sure the 'public' folder contains: index.html, styles.css, app.js</p>
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
        publicPath: publicPath,
        publicExists: fs.existsSync(publicPath),
        indexExists: fs.existsSync(path.join(publicPath, 'index.html')),
        files: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : []
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
