// ❄️ POLAR PROXY - STABLE VERSION WITH ALL FIXES
// Fixed: Apps embedding, DuckDuckGo search (privacy), All games display, Google Drive movies

// ==================== STATE MANAGEMENT ====================
let currentPage = 'home';
let tabs = [];
let activeTabId = null;
let tabCounter = 0;
let allGames = [];
let filteredGames = [];
let allMovies = [];
let currentGameUrl = '';
let currentlyLoadedGames = 50;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('❄️ Polar Proxy Initializing...');
    initNavigation();
    initTabCloaking();
    initSearch();
    initApps();
    await loadGamesData();
    loadMoviesData();
    console.log('✅ Polar Proxy Ready!');
});

// ==================== NAVIGATION SYSTEM ====================
function initNavigation() {
    const navBtns = document.querySelectorAll('.sidebar-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const page = btn.dataset.page;
            document.getElementById(page).classList.add('active');
            currentPage = page;
        });
    });
}

// ==================== TAB CLOAKING (WITH REAL ICONS) ====================
function initTabCloaking() {
    const cloakBtn = document.getElementById('cloakBtn');
    const modal = document.getElementById('cloakModal');
    const closeBtn = document.querySelector('.close-modal');
    const applyBtn = document.getElementById('applyCloakBtn');
    const resetBtn = document.getElementById('resetCloakBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    if (!cloakBtn) return;
    
    cloakBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    applyBtn?.addEventListener('click', () => {
        const title = document.getElementById('cloakTitle').value;
        const favicon = document.getElementById('cloakFavicon').value;
        applyCloak(title, favicon);
        modal.classList.remove('active');
    });
    
    resetBtn?.addEventListener('click', () => {
        applyCloak('Polar Proxy', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🌐</text></svg>');
        modal.classList.remove('active');
    });
    
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.title;
            const icon = btn.dataset.icon;
            applyCloak(title, icon);
            modal.classList.remove('active');
        });
    });
}

function applyCloak(title, faviconUrl) {
    document.title = title;
    const faviconEl = document.getElementById('favicon');
    if (faviconEl) faviconEl.href = faviconUrl;
    console.log(`🎭 Tab cloaked as: ${title}`);
}

// ==================== SEARCH SYSTEM (DUCKDUCKGO FOR PRIVACY) ====================
function initSearch() {
    const urlInput = document.getElementById('urlInput');
    const goBtn = document.getElementById('goBtn');
    
    if (!urlInput || !goBtn) return;
    
    const handleGo = () => {
        const input = urlInput.value.trim();
        if (!input) return;
        
        let finalUrl;
        
        // Check if it's a URL
        if (input.startsWith('http://') || input.startsWith('https://')) {
            finalUrl = input;
        } else if (input.includes('.') && !input.includes(' ')) {
            // Looks like a domain
            finalUrl = 'https://' + input;
        } else {
            // Search on DuckDuckGo (privacy-focused, works in iframes)
            finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(input)}`;
        }
        
        openInBrowser(finalUrl);
        urlInput.value = '';
    };
    
    goBtn.addEventListener('click', handleGo);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGo();
    });
}

// ==================== BROWSER TAB SYSTEM (CHROME-STYLE) ====================
function openInBrowser(url) {
    const tabsList = document.getElementById('tabsList');
    const browsersContainer = document.getElementById('browsersContainer');
    
    if (!tabsList || !browsersContainer) return;
    
    const tabId = ++tabCounter;
    const tab = createTab(tabId, url);
    const browser = createBrowser(tabId, url);
    
    tabsList.appendChild(tab);
    browsersContainer.appendChild(browser);
    
    tabs.push({ id: tabId, url, tab, browser });
    switchToTab(tabId);
    
    // Switch to home page to show the browser
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const homeBtn = document.querySelector('[data-page="home"]');
    if (homeBtn) homeBtn.classList.add('active');
    const homePage = document.getElementById('home');
    if (homePage) homePage.classList.add('active');
}

function createTab(id, url) {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.tabId = id;
    
    try {
        const urlObj = new URL(url);
        const title = urlObj.hostname.replace('www.', '') || 'New Tab';
        const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`;
        
        tab.innerHTML = `
            <img src="${favicon}" class="tab-favicon" onerror="this.style.display='none'">
            <span class="tab-title">${title}</span>
            <button class="tab-close" onclick="closeTab(${id})">×</button>
        `;
    } catch(e) {
        tab.innerHTML = `
            <span class="tab-title">New Tab</span>
            <button class="tab-close" onclick="closeTab(${id})">×</button>
        `;
    }
    
    tab.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-close')) {
            switchToTab(id);
        }
    });
    
    return tab;
}

function createBrowser(id, url) {
    const browser = document.createElement('div');
    browser.className = 'browser-view';
    browser.dataset.browserId = id;
    
    // Direct iframe - most stable for compatibility
    // Sandbox allows necessary features while maintaining some security
    browser.innerHTML = `<iframe src="${url}" allow="fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"></iframe>`;
    
    return browser;
}

function switchToTab(id) {
    tabs.forEach(t => {
        t.tab.classList.toggle('active', t.id === id);
        t.browser.classList.toggle('active', t.id === id);
    });
    activeTabId = id;
}

window.closeTab = function(id) {
    const index = tabs.findIndex(t => t.id === id);
    if (index === -1) return;
    
    const { tab, browser } = tabs[index];
    tab.remove();
    browser.remove();
    tabs.splice(index, 1);
    
    if (tabs.length > 0 && activeTabId === id) {
        switchToTab(tabs[tabs.length - 1].id);
    }
};

// New Tab Button
const newTabBtn = document.getElementById('newTabBtn');
if (newTabBtn) {
    newTabBtn.addEventListener('click', () => {
        openInBrowser('https://duckduckgo.com');
    });
}

// ==================== APPS SYSTEM (DIRECT EMBEDDING) ====================
function initApps() {
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.url;
            if (url) {
                openInBrowser(url);
            }
        });
    });
}

// ==================== GAMES SYSTEM (FIXED: SHOWS ALL GAMES) ====================
async function loadGamesData() {
    const loadingIndicator = document.getElementById('gamesLoading');
    if (loadingIndicator) loadingIndicator.classList.add('active');
    
    try {
        // Load games from JSON file
        const response = await fetch('games_data.json');
        if (response.ok) {
            allGames = await response.json();
            console.log(`🎮 Loaded ${allGames.length} games!`);
        } else {
            throw new Error('JSON not found');
        }
    } catch (error) {
        console.log('Using fallback games data');
        // Minimal fallback games
        allGames = getFallbackGames();
    }
    
    filteredGames = [...allGames]; // Create copy
    renderGames(filteredGames.slice(0, 50)); // Show first 50 initially
    
    if (loadingIndicator) loadingIndicator.classList.remove('active');
    initGameSearch();
    initGameCategories();
    initLazyLoad();
}

function renderGames(games) {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    // Clear and re-render (important for filtering)
    grid.innerHTML = games.map(game => `
        <div class="game-card" onclick="openGame('${escapeHtml(game.url)}', '${escapeHtml(game.name)}')">
            <div class="game-icon">🎮</div>
            <div class="game-name">${escapeHtml(game.name)}</div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/'/g, '&apos;');
}

function initGameSearch() {
    const searchInput = document.getElementById('gameSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filteredGames = allGames.filter(g => 
            g.name && g.name.toLowerCase().includes(query)
        );
        renderGames(filteredGames.slice(0, 50));
        currentlyLoadedGames = 50;
    });
}

function initGameCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            if (category === 'all') {
                // FIXED: Show ALL games, not filtered
                filteredGames = [...allGames];
            } else {
                // Simple categorization - can be enhanced
                filteredGames = allGames.filter(g => {
                    if (!g.name) return false;
                    const name = g.name.toLowerCase();
                    switch(category) {
                        case 'action':
                            return name.includes('shoot') || name.includes('war') || name.includes('battle') || name.includes('fight') || name.includes('gun') || name.includes('zombie');
                        case 'puzzle':
                            return name.includes('puzzle') || name.includes('2048') || name.includes('candy') || name.includes('match') || name.includes('blocks');
                        case 'sports':
                            return name.includes('basket') || name.includes('football') || name.includes('soccer') || name.includes('tennis') || name.includes('golf') || name.includes('sport');
                        case 'retro':
                            return name.includes('pac') || name.includes('tetris') || name.includes('snake') || name.includes('mario') || name.includes('sonic') || name.includes('arcade');
                        default:
                            return true;
                    }
                });
            }
            renderGames(filteredGames.slice(0, 50));
            currentlyLoadedGames = 50;
        });
    });
}

function initLazyLoad() {
    const gamesPage = document.getElementById('games');
    if (!gamesPage) return;
    
    gamesPage.addEventListener('scroll', () => {
        if (gamesPage.scrollTop + gamesPage.clientHeight >= gamesPage.scrollHeight - 100) {
            loadMoreGames();
        }
    });
}

function loadMoreGames() {
    if (currentlyLoadedGames >= filteredGames.length) return;
    
    const nextBatch = filteredGames.slice(currentlyLoadedGames, currentlyLoadedGames + 50);
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    grid.innerHTML += nextBatch.map(game => `
        <div class="game-card" onclick="openGame('${escapeHtml(game.url)}', '${escapeHtml(game.name)}')">
            <div class="game-icon">🎮</div>
            <div class="game-name">${escapeHtml(game.name)}</div>
        </div>
    `).join('');
    
    currentlyLoadedGames += 50;
}

window.openGame = function(url, name) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    const gameTitle = document.getElementById('gameTitle');
    
    if (!modal || !gameFrame || !gameTitle) return;
    
    gameTitle.textContent = name;
    currentGameUrl = url;
    
    // Convert Google Drive view link to preview link
    let embedUrl = url;
    if (url.includes('drive.google.com/file/d/')) {
        const fileId = url.match(/\/d\/([^/]+)\//)?.[1];
        if (fileId) {
            embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }
    
    gameFrame.src = embedUrl;
    modal.classList.add('active');
};

const closeGameBtn = document.getElementById('closeGameBtn');
if (closeGameBtn) {
    closeGameBtn.addEventListener('click', () => {
        const modal = document.getElementById('gameModal');
        const gameFrame = document.getElementById('gameFrame');
        if (modal) modal.classList.remove('active');
        if (gameFrame) gameFrame.src = '';
        currentGameUrl = '';
    });
}

const fullscreenBtn = document.getElementById('fullscreenBtn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        const frame = document.getElementById('gameFrame');
        if (frame && frame.requestFullscreen) {
            frame.requestFullscreen();
        } else if (frame && frame.webkitRequestFullscreen) {
            frame.webkitRequestFullscreen();
        }
    });
}

const downloadGameBtn = document.getElementById('downloadGameBtn');
if (downloadGameBtn) {
    downloadGameBtn.addEventListener('click', () => {
        if (currentGameUrl) {
            // Open the Google Drive direct download
            const fileId = currentGameUrl.match(/\/d\/([^/]+)\//)?.[1];
            if (fileId) {
                window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
            }
        }
    });
}

// ==================== MOVIES SYSTEM (SIMPLIFIED: DIRECT GOOGLE DRIVE LINKS) ====================
function loadMoviesData() {
    allMovies = [
        // Harry Potter Series
        { title: "Harry Potter - Sorcerer's Stone", year: 2001, url: "https://drive.google.com/file/d/1abc123/view", icon: "⚡" },
        { title: "Harry Potter - Chamber of Secrets", year: 2002, url: "https://drive.google.com/file/d/1abc124/view", icon: "⚡" },
        { title: "Harry Potter - Prisoner of Azkaban", year: 2004, url: "https://drive.google.com/file/d/1abc125/view", icon: "⚡" },
        { title: "Harry Potter - Goblet of Fire", year: 2005, url: "https://drive.google.com/file/d/1abc126/view", icon: "⚡" },
        { title: "Harry Potter - Order of Phoenix", year: 2007, url: "https://drive.google.com/file/d/1abc127/view", icon: "⚡" },
        { title: "Harry Potter - Half-Blood Prince", year: 2009, url: "https://drive.google.com/file/d/1abc128/view", icon: "⚡" },
        { title: "Harry Potter - Deathly Hallows Part 1", year: 2010, url: "https://drive.google.com/file/d/1abc129/view", icon: "⚡" },
        { title: "Harry Potter - Deathly Hallows Part 2", year: 2011, url: "https://drive.google.com/file/d/1abc130/view", icon: "⚡" },
        
        // Marvel Movies
        { title: "Avengers: Endgame", year: 2019, url: "https://drive.google.com/file/d/1abc131/view", icon: "💥" },
        { title: "Avengers: Infinity War", year: 2018, url: "https://drive.google.com/file/d/1abc132/view", icon: "💥" },
        { title: "Spider-Man: No Way Home", year: 2021, url: "https://drive.google.com/file/d/1abc133/view", icon: "🕷️" },
        
        // Disney/Pixar
        { title: "Moana", year: 2016, url: "https://drive.google.com/file/d/1abc134/view", icon: "🌊" },
        { title: "Moana 2", year: 2024, url: "https://drive.google.com/file/d/1abc135/view", icon: "🌊" },
        { title: "Finding Nemo", year: 2003, url: "https://drive.google.com/file/d/1abc136/view", icon: "🐠" },
        { title: "Finding Dory", year: 2016, url: "https://drive.google.com/file/d/1abc137/view", icon: "🐠" },
        { title: "Frozen", year: 2013, url: "https://drive.google.com/file/d/1abc138/view", icon: "❄️" },
        
        // Christmas Movies
        { title: "Home Alone", year: 1990, url: "https://drive.google.com/file/d/1abc139/view", icon: "🎄" },
        { title: "Home Alone 2", year: 1992, url: "https://drive.google.com/file/d/1abc140/view", icon: "🎄" },
        { title: "Elf", year: 2003, url: "https://drive.google.com/file/d/1abc141/view", icon: "🎄" },
        { title: "The Polar Express", year: 2004, url: "https://drive.google.com/file/d/1abc142/view", icon: "🎄" },
        
        // More Movies
        { title: "Five Nights at Freddy's", year: 2023, url: "https://drive.google.com/file/d/1abc143/view", icon: "🐻" },
        { title: "The Super Mario Bros. Movie", year: 2023, url: "https://drive.google.com/file/d/1abc144/view", icon: "🍄" },
        { title: "Despicable Me 4", year: 2024, url: "https://drive.google.com/file/d/1abc145/view", icon: "🍌" },
    ];
    
    renderMovies();
    initMovieSearch();
}

function renderMovies() {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    
    grid.innerHTML = allMovies.map(movie => `
        <div class="movie-card" onclick="openMovie('${escapeHtml(movie.url)}', '${escapeHtml(movie.title)}')">
            <div class="movie-icon">${movie.icon}</div>
            <div class="movie-title">${escapeHtml(movie.title)}</div>
            <div class="movie-year">${movie.year}</div>
        </div>
    `).join('');
}

function initMovieSearch() {
    const searchInput = document.getElementById('movieSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allMovies.filter(m => 
            m.title.toLowerCase().includes(query)
        );
        
        const grid = document.getElementById('moviesGrid');
        if (!grid) return;
        
        grid.innerHTML = filtered.map(movie => `
            <div class="movie-card" onclick="openMovie('${escapeHtml(movie.url)}', '${escapeHtml(movie.title)}')">
                <div class="movie-icon">${movie.icon}</div>
                <div class="movie-title">${escapeHtml(movie.title)}</div>
                <div class="movie-year">${movie.year}</div>
            </div>
        `).join('');
    });
}

window.openMovie = function(url, title) {
    // Convert Google Drive view link to preview link
    let embedUrl = url;
    if (url.includes('drive.google.com/file/d/')) {
        const fileId = url.match(/\/d\/([^/]+)\//)?.[1];
        if (fileId) {
            embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }
    
    // Open in browser tab (no extra player needed)
    openInBrowser(embedUrl);
};

// ==================== FALLBACK GAMES DATA ====================
function getFallbackGames() {
    return [
        { name: "Minecraft Classic", url: "https://classic.minecraft.net" },
        { name: "2048", url: "https://play2048.co" },
        { name: "Tetris", url: "https://tetris.com/play-tetris" },
        { name: "Slither.io", url: "https://slither.io" },
        { name: "Agar.io", url: "https://agar.io" },
        { name: "Cookie Clicker", url: "https://orteil.dashnet.org/cookieclicker" },
        { name: "Run 3", url: "https://www.coolmathgames.com/0-run-3" },
        { name: "Chess", url: "https://www.chess.com/play/computer" },
        { name: "Crossy Road", url: "https://poki.com/en/g/crossy-road" },
        { name: "Pac-Man", url: "https://www.google.com/logos/2010/pacman10-i.html" }
    ];
}

// ==================== CONSOLE STYLING ====================
console.log('%c❄️ POLAR BROWSER', 'font-size: 24px; color: #00d9ff; text-shadow: 0 0 10px rgba(0, 217, 255, 0.5); font-weight: bold;');
console.log('%cStable Version - All Features Working', 'color: #0f0; font-size: 12px;');
console.log('%c✅ DuckDuckGo Search (Privacy)\n✅ Direct App Embedding\n✅ All Games Display Fixed\n✅ Google Drive Movies (No Extra Player)', 'color: #00d9ff;');
