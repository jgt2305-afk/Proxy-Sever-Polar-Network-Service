// ❄️ POLAR PROXY - Fixed Version
// All Issues Fixed: Apps, Movies, Games, Search

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
    
    cloakBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    applyBtn.addEventListener('click', () => {
        const title = document.getElementById('cloakTitle').value;
        const favicon = document.getElementById('cloakFavicon').value;
        applyCloak(title, favicon);
        modal.classList.remove('active');
    });
    
    resetBtn.addEventListener('click', () => {
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
    faviconEl.href = faviconUrl;
    console.log(`🎭 Tab cloaked as: ${title}`);
}

// ==================== SEARCH SYSTEM (USING GOOGLE) ====================
function initSearch() {
    const urlInput = document.getElementById('urlInput');
    const goBtn = document.getElementById('goBtn');
    
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
            // Search on Google (works better in iframe than Startpage)
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
    const browserTabsContainer = document.getElementById('browserTabs');
    
    // Show the browser tabs container
    if (browserTabsContainer) {
        browserTabsContainer.style.display = 'flex';
    }
    
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
    document.querySelector('[data-page="home"]').classList.add('active');
    document.getElementById('home').classList.add('active');
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
    
    // Direct embed with proper permissions
    browser.innerHTML = `<iframe src="${url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"></iframe>`;
    
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
    } else if (tabs.length === 0) {
        // Hide browser tabs container when no tabs
        const browserTabsContainer = document.getElementById('browserTabs');
        if (browserTabsContainer) {
            browserTabsContainer.style.display = 'none';
        }
    }
};

// New Tab Button
document.getElementById('newTabBtn')?.addEventListener('click', () => {
    openInBrowser('https://www.google.com');
});

// ==================== APPS SYSTEM (FIXED) ====================
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

// ==================== GAMES SYSTEM (FIXED - SHOWS ALL GAMES) ====================
async function loadGamesData() {
    const loadingIndicator = document.getElementById('gamesLoading');
    if (loadingIndicator) loadingIndicator.classList.add('active');
    
    try {
        // Load games from JSON file
        const response = await fetch('games_data.json');
        if (!response.ok) throw new Error('Failed to load games');
        allGames = await response.json();
        console.log(`🎮 Loaded ${allGames.length} games!`);
    } catch (error) {
        console.log('Using fallback games data:', error);
        allGames = FALLBACK_GAMES_DATA;
    }
    
    filteredGames = [...allGames]; // Create copy
    renderGames(filteredGames.slice(0, 50)); // Show first 50 initially
    
    if (loadingIndicator) loadingIndicator.classList.remove('active');
    initGameSearch();
    initGameCategories();
    initLazyLoad();
}

function renderGames(games, append = false) {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    const html = games.map(game => `
        <div class="game-card" onclick="openGame('${escapeHtml(game.url)}', '${escapeHtml(game.name)}')">
            <div class="game-icon">🎮</div>
            <div class="game-name">${escapeHtml(game.name)}</div>
        </div>
    `).join('');
    
    if (append) {
        grid.innerHTML += html;
    } else {
        grid.innerHTML = html;
        currentlyLoadedGames = Math.min(games.length, 50);
    }
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
                filteredGames = [...allGames]; // FIXED: Show all games
            } else {
                // Simple categorization
                filteredGames = allGames.filter(g => {
                    const name = g.name.toLowerCase();
                    switch(category) {
                        case 'action':
                            return name.includes('shoot') || name.includes('war') || name.includes('battle') || name.includes('fight') || name.includes('gun');
                        case 'puzzle':
                            return name.includes('puzzle') || name.includes('2048') || name.includes('candy') || name.includes('match') || name.includes('block');
                        case 'sports':
                            return name.includes('basket') || name.includes('football') || name.includes('soccer') || name.includes('tennis') || name.includes('sport');
                        case 'retro':
                            return name.includes('pac') || name.includes('tetris') || name.includes('snake') || name.includes('mario') || name.includes('classic');
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
    const gamesGrid = document.getElementById('gamesGrid');
    const gamesPage = document.getElementById('games');
    
    if (!gamesGrid || !gamesPage) return;
    
    gamesPage.addEventListener('scroll', () => {
        const scrollPos = gamesPage.scrollTop + gamesPage.clientHeight;
        const scrollHeight = gamesPage.scrollHeight;
        
        if (scrollPos >= scrollHeight - 200) {
            loadMoreGames();
        }
    });
}

function loadMoreGames() {
    if (currentlyLoadedGames >= filteredGames.length) return;
    
    const nextBatch = filteredGames.slice(currentlyLoadedGames, currentlyLoadedGames + 50);
    renderGames(nextBatch, true); // Append mode
    currentlyLoadedGames += 50;
}

window.openGame = function(url, name) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    const gameTitle = document.getElementById('gameTitle');
    
    gameTitle.textContent = name;
    currentGameUrl = url;
    
    // Convert Google Drive view link to embed/preview link
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

document.getElementById('closeGameBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    document.getElementById('gameFrame').src = '';
    currentGameUrl = '';
});

document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    const frame = document.getElementById('gameFrame');
    if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
});

document.getElementById('downloadGameBtn')?.addEventListener('click', () => {
    if (currentGameUrl) {
        const fileId = currentGameUrl.match(/\/d\/([^/]+)\//)?.[1];
        if (fileId) {
            window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
        } else {
            window.open(currentGameUrl, '_blank');
        }
    }
});

// ==================== MOVIES SYSTEM (USING VIDSRC - WORKING) ====================
function loadMoviesData() {
    allMovies = [
        // Harry Potter Complete Series
        { title: "Harry Potter - Sorcerer's Stone", year: 2001, url: "https://vidsrc.xyz/embed/movie/tt0241527", icon: "⚡" },
        { title: "Harry Potter - Chamber of Secrets", year: 2002, url: "https://vidsrc.xyz/embed/movie/tt0295297", icon: "⚡" },
        { title: "Harry Potter - Prisoner of Azkaban", year: 2004, url: "https://vidsrc.xyz/embed/movie/tt0304141", icon: "⚡" },
        { title: "Harry Potter - Goblet of Fire", year: 2005, url: "https://vidsrc.xyz/embed/movie/tt0330373", icon: "⚡" },
        { title: "Harry Potter - Order of Phoenix", year: 2007, url: "https://vidsrc.xyz/embed/movie/tt0373889", icon: "⚡" },
        { title: "Harry Potter - Half-Blood Prince", year: 2009, url: "https://vidsrc.xyz/embed/movie/tt0417741", icon: "⚡" },
        { title: "Harry Potter - Deathly Hallows 1", year: 2010, url: "https://vidsrc.xyz/embed/movie/tt0926084", icon: "⚡" },
        { title: "Harry Potter - Deathly Hallows 2", year: 2011, url: "https://vidsrc.xyz/embed/movie/tt1201607", icon: "⚡" },
        
        // Marvel MCU
        { title: "Avengers: Endgame", year: 2019, url: "https://vidsrc.xyz/embed/movie/tt4154796", icon: "💥" },
        { title: "Avengers: Infinity War", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt4154756", icon: "💥" },
        { title: "Spider-Man: No Way Home", year: 2021, url: "https://vidsrc.xyz/embed/movie/tt10872600", icon: "🕷️" },
        { title: "Spider-Man: Homecoming", year: 2017, url: "https://vidsrc.xyz/embed/movie/tt2250912", icon: "🕷️" },
        { title: "Spider-Man: Far From Home", year: 2019, url: "https://vidsrc.xyz/embed/movie/tt6320628", icon: "🕷️" },
        { title: "Black Panther", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt1825683", icon: "🐆" },
        { title: "Thor: Ragnarok", year: 2017, url: "https://vidsrc.xyz/embed/movie/tt3501632", icon: "⚡" },
        { title: "Guardians of the Galaxy", year: 2014, url: "https://vidsrc.xyz/embed/movie/tt2015381", icon: "🚀" },
        { title: "Doctor Strange", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt1211837", icon: "🔮" },
        
        // Disney/Pixar Classics
        { title: "The Polar Express", year: 2004, url: "https://vidsrc.xyz/embed/movie/tt0338348", icon: "🚂" },
        { title: "Moana", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt3521164", icon: "🌊" },
        { title: "Moana 2", year: 2024, url: "https://vidsrc.xyz/embed/movie/tt13622776", icon: "🌊" },
        { title: "Finding Nemo", year: 2003, url: "https://vidsrc.xyz/embed/movie/tt0266543", icon: "🐠" },
        { title: "Finding Dory", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt2277860", icon: "🐠" },
        { title: "Inside Out", year: 2015, url: "https://vidsrc.xyz/embed/movie/tt2096673", icon: "🧠" },
        { title: "Frozen", year: 2013, url: "https://vidsrc.xyz/embed/movie/tt2294629", icon: "❄️" },
        { title: "Frozen 2", year: 2019, url: "https://vidsrc.xyz/embed/movie/tt4520988", icon: "❄️" },
        { title: "Toy Story", year: 1995, url: "https://vidsrc.xyz/embed/movie/tt0114709", icon: "🤠" },
        { title: "Toy Story 3", year: 2010, url: "https://vidsrc.xyz/embed/movie/tt0435761", icon: "🤠" },
        { title: "The Lion King", year: 1994, url: "https://vidsrc.xyz/embed/movie/tt0110357", icon: "🦁" },
        { title: "Coco", year: 2017, url: "https://vidsrc.xyz/embed/movie/tt2380307", icon: "🎸" },
        
        // Family Favorites  
        { title: "Home Alone", year: 1990, url: "https://vidsrc.xyz/embed/movie/tt0099785", icon: "🏠" },
        { title: "Home Alone 2", year: 1992, url: "https://vidsrc.xyz/embed/movie/tt0104431", icon: "🏠" },
        { title: "Elf", year: 2003, url: "https://vidsrc.xyz/embed/movie/tt0319343", icon: "🎅" },
        { title: "The Grinch", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt2709692", icon: "🎄" },
        { title: "Shrek", year: 2001, url: "https://vidsrc.xyz/embed/movie/tt0126029", icon: "🧌" },
        { title: "Shrek 2", year: 2004, url: "https://vidsrc.xyz/embed/movie/tt0298148", icon: "🧌" },
        
        // Action/Adventure
        { title: "Deadpool", year: 2016, url: "https://vidsrc.xyz/embed/movie/tt1431045", icon: "💀" },
        { title: "Deadpool 2", year: 2018, url: "https://vidsrc.xyz/embed/movie/tt5463162", icon: "💀" },
        { title: "The LEGO Movie", year: 2014, url: "https://vidsrc.xyz/embed/movie/tt1490017", icon: "🧱" },
        { title: "The Super Mario Bros Movie", year: 2023, url: "https://vidsrc.xyz/embed/movie/tt6718170", icon: "🍄" },
        { title: "Sonic the Hedgehog", year: 2020, url: "https://vidsrc.xyz/embed/movie/tt3794354", icon: "💨" },
        { title: "Sonic 2", year: 2022, url: "https://vidsrc.xyz/embed/movie/tt12412888", icon: "💨" },
        { title: "Five Nights at Freddy's", year: 2023, url: "https://vidsrc.xyz/embed/movie/tt4589218", icon: "🐻" },
        { title: "Jurassic World", year: 2015, url: "https://vidsrc.xyz/embed/movie/tt0369610", icon: "🦖" },
        { title: "Top Gun: Maverick", year: 2022, url: "https://vidsrc.xyz/embed/movie/tt1745960", icon: "✈️" },
        
        // Animated
        { title: "Despicable Me", year: 2010, url: "https://vidsrc.xyz/embed/movie/tt1323594", icon: "🍌" },
        { title: "Minions", year: 2015, url: "https://vidsrc.xyz/embed/movie/tt2293640", icon: "🍌" },
        { title: "Kung Fu Panda", year: 2008, url: "https://vidsrc.xyz/embed/movie/tt0441773", icon: "🐼" },
        { title: "How to Train Your Dragon", year: 2010, url: "https://vidsrc.xyz/embed/movie/tt0892769", icon: "🐉" },
        { title: "Ratatouille", year: 2007, url: "https://vidsrc.xyz/embed/movie/tt0382932", icon: "🐀" },
        { title: "WALL-E", year: 2008, url: "https://vidsrc.xyz/embed/movie/tt0910970", icon: "🤖" },
        { title: "Up", year: 2009, url: "https://vidsrc.xyz/embed/movie/tt1049413", icon: "🎈" }
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
    // Open movie in new browser tab (VidSrc embeds work great!)
    openInBrowser(url);
};

// ==================== FALLBACK GAMES DATA ====================
const FALLBACK_GAMES_DATA = [
    {name: "1v1.lol", url: "https://1v1.lol"},
    {name: "2048", url: "https://play2048.co"},
    {name: "Among Us", url: "https://www.crazygames.com/game/among-us"},
    {name: "Basketball Stars", url: "https://www.crazygames.com/game/basketball-stars"},
    {name: "Minecraft Classic", url: "https://classic.minecraft.net"},
    {name: "Slope", url: "https://slope-game.github.io/roto"},
    {name: "Run 3", url: "https://player03.com/run/3/beta/"},
    {name: "Subway Surfers", url: "https://poki.com/en/g/subway-surfers"},
    {name: "Tetris", url: "https://tetris.com/play-tetris"},
    {name: "Snake", url: "https://www.google.com/fbx?fbx=snake_arcade"}
];

// Show total counts
setTimeout(() => {
    console.log('✅ Polar Proxy Loaded Successfully!');
    console.log(`🎮 ${allGames.length} games available`);
    console.log(`🎬 ${allMovies.length} movies available`);
}, 1000);
