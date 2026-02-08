// ❄️ POLAR PROXY - COMPLETE FIX
// Fixed: Removed ALL iframe restrictions, Google search (only one that works), working apps/movies

// ==================== STATE MANAGEMENT ====================
let currentPage = 'home';
let tabs = [];
let activeTabId = null;
let tabCounter = 0;
let allGames = [];
let filteredGames = [];
let allMovies = [];
let currentGameUrl = '';

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
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const title = document.getElementById('cloakTitle').value;
            const favicon = document.getElementById('cloakFavicon').value;
            applyCloak(title, favicon);
            modal.classList.remove('active');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            applyCloak('Polar Proxy', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🌐</text></svg>');
            modal.classList.remove('active');
        });
    }
    
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

// ==================== SEARCH SYSTEM (GOOGLE - ONLY ONE THAT WORKS IN IFRAMES) ====================
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
            // Google is the ONLY search that works reliably in iframes
            finalUrl = `https://www.google.com/search?q=${encodeURIComponent(input)}&igu=1`;
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
    
    // NO SANDBOX! This was breaking everything.
    // Full permissions for maximum compatibility
    browser.innerHTML = `<iframe src="${url}" allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; usb" allowfullscreen></iframe>`;
    
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
        openInBrowser('https://www.google.com');
    });
}

// ==================== APPS SYSTEM ====================
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

// ==================== GAMES SYSTEM (1258 GAMES) ====================
async function loadGamesData() {
    const loadingIndicator = document.getElementById('gamesLoading');
    if (loadingIndicator) loadingIndicator.classList.add('active');
    
    try {
        const response = await fetch('games_data.json');
        allGames = await response.json();
        console.log(`🎮 Loaded ${allGames.length} games!`);
    } catch (error) {
        console.log('Using fallback games data');
        allGames = FALLBACK_GAMES_DATA;
    }
    
    filteredGames = allGames;
    renderGames(filteredGames.slice(0, 50));
    
    if (loadingIndicator) loadingIndicator.classList.remove('active');
    initGameSearch();
    initGameCategories();
    initLazyLoad();
}

function renderGames(games) {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    grid.innerHTML = games.map(game => `
        <div class="game-card" onclick="openGame('${escapeHtml(game.url)}', '${escapeHtml(game.name)}')">
            <div class="game-icon">🎮</div>
            <div class="game-name">${escapeHtml(game.name)}</div>
        </div>
    `).join('');
}

function escapeHtml(text) {
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
            g.name.toLowerCase().includes(query)
        );
        renderGames(filteredGames.slice(0, 50));
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
                filteredGames = allGames;
            } else {
                filteredGames = allGames.filter(g => {
                    const name = g.name.toLowerCase();
                    switch(category) {
                        case 'action':
                            return name.includes('shoot') || name.includes('war') || name.includes('battle') || name.includes('fight');
                        case 'puzzle':
                            return name.includes('puzzle') || name.includes('2048') || name.includes('candy') || name.includes('match');
                        case 'sports':
                            return name.includes('basket') || name.includes('football') || name.includes('soccer') || name.includes('tennis');
                        case 'retro':
                            return name.includes('pac') || name.includes('tetris') || name.includes('snake') || name.includes('mario');
                        default:
                            return true;
                    }
                });
            }
            renderGames(filteredGames.slice(0, 50));
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

let currentlyLoaded = 50;
function loadMoreGames() {
    if (currentlyLoaded >= filteredGames.length) return;
    
    const nextBatch = filteredGames.slice(currentlyLoaded, currentlyLoaded + 50);
    const grid = document.getElementById('gamesGrid');
    
    grid.innerHTML += nextBatch.map(game => `
        <div class="game-card" onclick="openGame('${escapeHtml(game.url)}', '${escapeHtml(game.name)}')">
            <div class="game-icon">🎮</div>
            <div class="game-name">${escapeHtml(game.name)}</div>
        </div>
    `).join('');
    
    currentlyLoaded += 50;
}

window.openGame = function(url, name) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    const gameTitle = document.getElementById('gameTitle');
    
    if (!modal || !gameFrame || !gameTitle) return;
    
    gameTitle.textContent = name;
    currentGameUrl = url;
    
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
            const fileId = currentGameUrl.match(/\/d\/([^/]+)\//)?.[1];
            if (fileId) {
                window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
            }
        }
    });
}

// ==================== MOVIES SYSTEM ====================
function loadMoviesData() {
    allMovies = [
        { title: "Harry Potter - Sorcerer's Stone", year: 2001, url: "https://vidsrc.xyz/embed/movie/tt0241527", icon: "⚡" },
        { title: "Harry Potter - Chamber of Secrets", year: 2002, url: "https://vidsrc.xyz/embed/movie/tt0295297", icon: "⚡" },
        { title: "Harry Potter - Prisoner of Azkaban", year: 2004, url: "https://vidsrc.xyz/embed/movie/tt0304141", icon: "⚡" },
        { title: "Harry Potter - Goblet of Fire", year: 2005, url: "https://vidsrc.xyz/embed/movie/tt0330373", icon: "⚡" },
        { title: "Harry Potter - Order of Phoenix", year: 2007, url: "https://vidsrc.xyz/embed/movie/tt0373889", icon: "⚡" },
        { title: "Harry Potter - Half-Blood Prince", year: 2009, url: "https://vidsrc.xyz/embed/movie/tt0417741", icon: "⚡" },
        { title: "Harry Potter - Deathly Hallows 1", year: 2010, url: "https://vidsrc.xyz/embed/movie/tt0926084", icon: "⚡" },
        { title: "Harry Potter - Deathly Hallows 2", year: 2011, url: "https://vidsrc.xyz/embed/movie/tt1201607", icon: "⚡" },
        { title: "Avengers: Endgame", year: 2019, url: "https://vidsrc.xyz/embed/movie/tt4154796", icon: "💥" },
        { title: "Avengers: Infinity War", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt4154756", icon: "💥" },
        { title: "Spider-Man: No Way Home", year: 2021, url: "https://vidsrc.xyz/embed/movie/tt10872600", icon: "🕷️" },
        { title: "Spider-Man: Homecoming", year: 2017, url: "https://vidsrc.xyz/embed/movie/tt2250912", icon: "🕷️" },
        { title: "Spider-Man: Far From Home", year: 2019, url: "https://vidsrc.xyz/embed/movie/tt6320628", icon: "🕷️" },
        { title: "Black Panther", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt1825683", icon: "🐆" },
        { title: "Thor: Ragnarok", year: 2017, url: "https://vidsrc.xyz/embed/movie/tt3501632", icon: "⚡" },
        { title: "Guardians of the Galaxy", year: 2014, url: "https://vidsrc.xyz/embed/movie/tt2015381", icon: "🚀" },
        { title: "The Polar Express", year: 2004, url: "https://vidsrc.xyz/embed/movie/tt0338348", icon: "🚂" },
        { title: "Moana", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt3521164", icon: "🌊" },
        { title: "Moana 2", year: 2024, url: "https://vidsrc.xyz/embed/movie/tt13622776", icon: "🌊" },
        { title: "Finding Nemo", year: 2003, url: "https://vidsrc.xyz/embed/movie/tt0266543", icon: "🐠" },
        { title: "Finding Dory", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt2277860", icon: "🐠" },
        { title: "Inside Out", year: 2015, url: "https://vidsrc.xyz/embed/movie/tt2096673", icon: "🧠" },
        { title: "Frozen", year: 2013, url: "https://vidsrc.xyz/embed/movie/tt2294629", icon: "❄️" },
        { title: "Frozen 2", year: 2019, url: "https://vidsrc.xyz/embed/movie/tt4520988", icon: "❄️" },
        { title: "Home Alone", year: 1990, url: "https://vidsrc.xyz/embed/movie/tt0099785", icon: "🏠" },
        { title: "Home Alone 2", year: 1992, url: "https://vidsrc.xyz/embed/movie/tt0104431", icon: "🏠" },
        { title: "Elf", year: 2003, url: "https://vidsrc.xyz/embed/movie/tt0319343", icon: "🎅" },
        { title: "The Grinch", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt2709692", icon: "🎄" },
        { title: "Deadpool", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt1431045", icon: "💀" },
        { title: "Deadpool 2", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt5463162", icon: "💀" },
        { title: "The LEGO Movie", year: 2014, url: "https://vidsrc.xyz/embed/movie/tt1490017", icon: "🧱" },
        { title: "The Super Mario Bros Movie", year: 2023, url: "https://vidsrc.xyz/embed/movie/tt6718170", icon: "🍄" },
        { title: "Five Nights at Freddy's", year: 2023, url: "https://vidsrc.xyz/embed/movie/tt4589218", icon: "🐻" }
    ];
    
    renderMovies(allMovies);
    initMovieSearch();
}

function renderMovies(movies) {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    
    grid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="openMovie('${escapeHtml(movie.url)}', '${escapeHtml(movie.title)}')">
            <div class="movie-poster">${movie.icon}</div>
            <div class="movie-info">
                <div class="movie-title">${escapeHtml(movie.title)}</div>
                <div class="movie-year">${movie.year}</div>
            </div>
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
        renderMovies(filtered);
    });
}

window.openMovie = function(url, title) {
    openInBrowser(url);
};

// ==================== FALLBACK GAMES DATA ====================
const FALLBACK_GAMES_DATA = [
    {name: "1v1.lol", url: "https://drive.google.com/file/d/16SVHF4XRFjv5WCqlLHJZhF6nkBM7q4ex/view"},
    {name: "2048", url: "https://drive.google.com/file/d/13xSrRMeCad0nyxRTPaaTQIMzVHk5Cd_s/view"},
    {name: "Among Us", url: "https://drive.google.com/file/d/1ZCT6pr5pp3ci0-qKWjH1ccJ9N-bF5KWL/view"},
    {name: "Basketball Stars", url: "https://drive.google.com/file/d/1STiVnrYpDeZPtHQxbB8a6wPpiwP3ZgEU/view"},
    {name: "Minecraft Classic", url: "https://classic.minecraft.net"},
    {name: "Slope", url: "https://slope-game.github.io/roto"},
    {name: "Run 3", url: "https://player03.com/run/3/beta/"},
    {name: "Subway Surfers", url: "https://poki.com/en/g/subway-surfers"}
];

console.log('✅ Polar Proxy Loaded - ALL RESTRICTIONS REMOVED');
console.log(`🎮 ${allGames.length || FALLBACK_GAMES_DATA.length} games | 🎬 ${allMovies.length} movies`);
console.log('🔓 No sandbox, no iframe restrictions - everything should work now!');
