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
    
    // Use server-side proxy to bypass Opera/browser blocking
    const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
    
    // Full iframe with all permissions, using proxy
    browser.innerHTML = `<iframe src="${proxyUrl}" allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; usb" allowfullscreen></iframe>`;
    
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

// ==================== MOVIES SYSTEM (ALL 573 MOVIES!) ====================
function loadMoviesData() {
    allMovies = [
        { title: "The Polar Express.avi", year: 2024, url: "https://drive.google.com/file/d/0B1j88lrqI04beE5Wa0Y3OVBFMUU/view?resourcekey%3D0-GszVvGJigG07BTSjUsAWig", icon: "🎬" },
        { title: "Frosty\'s Winter Wonderland", year: 2024, url: "https://drive.google.com/file/d/0B1j88lrqI04beVJqY0RmZkZhWG8/view?resourcekey%3D0-99H-s3a6M3UcuH-rh8MeRA", icon: "🎬" },
        { title: "The SpongeBob SquarePants Movie (US DVD) (Widescreen) [2004].mp4", year: 2004, url: "https://drive.google.com/file/d/11mVla6Y3qLX4pplfnxMavSczJ200_8dl/view", icon: "🎬" },
        { title: "Hotel.Transylvania.3.Summer.Vacation.2018.720p.BluRay.x264-[YTS.AM].mp4", year: 2018, url: "https://drive.google.com/file/d/1aS3rHee1w5zNTGGmSFM57DSVlC1hSvIs/view", icon: "🎬" },
        { title: "Garfield & Friends Full Series", year: 2024, url: "https://drive.google.com/drive/folders/1u9Pr61UADQ2cTYvkIkqpEjCzJf9bM9Ic", icon: "🎬" },
        { title: "The CupHead Show", year: 2024, url: "https://drive.google.com/drive/folders/1j_K1YV4w_sHAzwEAaUMl-qSk4qjrYSJ_", icon: "🎬" },
        { title: "SpongeBob Movie- Sponge Out of Water 2017 720p HD.mp4", year: 2017, url: "https://drive.google.com/file/d/1YasC1VXzjwNrR-gYL71waDSV8YK7zdTO/view", icon: "🎬" },
        { title: "Plankton! The Movie.Mp4", year: 2024, url: "https://drive.google.com/file/d/1lWqkPZ9BmdZhhRnrBz2WwcnAoL3Bn6WI/view", icon: "🎬" },
        { title: "Saving Bikini Bottom- The Sandy Cheeks Movie full movie", year: 2024, url: "https://drive.google.com/file/d/17fAM9sipu3BPElFpqFrG3ukYahbUEZQJ/view", icon: "🎬" },
        { title: "KPop.Demon.Hunters.2025.720p.WEB.x264.ESub.Hollymoviehd.mp4", year: 2025, url: "https://drive.google.com/file/d/19oPIqainxDbxGh10jtCGg9p405cLsiwq/view", icon: "🎬" },
        { title: "Woody Woodpecker Goes to Camp 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1rbeUdLuf25ywVxfbP42JDQuvFIoHqGkQ/view", icon: "🎬" },
        { title: "The.Smurfs.2.2013.720p.BluRay.x264.YIFY.mp4", year: 2013, url: "https://drive.google.com/file/d/1FYgtU8rAKF32RjDRgYqODXzOHV0mQuBy/view", icon: "🎬" },
        { title: "Legos.mp4", year: 2024, url: "https://drive.google.com/file/d/1-qYoH6b8KPyMpSlTwGKiWQHy4nDb3HoZ/view", icon: "🎬" },
        { title: "Penguins of Madagascar 2014 360p.ts", year: 2014, url: "https://drive.google.com/file/d/1FhmVu6-NhOXoY12O7qbmLfpugGU2GtVR/view", icon: "🎬" },
        { title: "Alvin and the Chipmunks.mp4", year: 2024, url: "https://drive.google.com/file/d/1uCRRJZj1GAaweX996uHbF2zxPoessmGW/view", icon: "🎬" },
        { title: "Squeakuel.mp4", year: 2024, url: "https://drive.google.com/file/d/1em55qHTtdrWD4Dox9CXs9r1042TLu_cu/view", icon: "🎬" },
        { title: "Chipwrecked.mp4", year: 2024, url: "https://drive.google.com/file/d/1LTKy48IbusfXsl5nSNDTd0M3A8B3aPke/view", icon: "🎬" },
        { title: "A.Goofy.Movie.1995.720p.BluRay.x264-[YTS.AM].mp4", year: 1995, url: "https://drive.google.com/file/d/1ify_EMaQW-ZAn2F0STztn2AGU-jE7aHL/view", icon: "🎬" },
        { title: "Good.Burger.1997.720p.WEBRip.x264-[YTS.AM].mp4", year: 1997, url: "https://drive.google.com/file/d/1jucPocCb8aq23Bh-GFLcniAk-k5UU-wC/view", icon: "🎬" },
        { title: "Good.Burger.2.2023.720p.AMZN.WEBRip.800MB.x264-GalaxyRG.mkv", year: 2023, url: "https://drive.google.com/file/d/1TOjPbqSF5UqnPrn1zFqEWvkUeBNiyMax/view", icon: "🎬" },
        { title: "Mean Girls 2004.mp4", year: 2004, url: "https://drive.google.com/file/d/1Hab49OuPK37MngOtQolLsVIzJ4AK9cNA/view", icon: "🎬" },
        { title: "Henry Danger_ The Movie - [2025].mp4", year: 2025, url: "https://drive.google.com/file/d/1RKY4IZ77naupHixUf6QTMJiVUeBxeOFO/view", icon: "🎬" },
        { title: "Ghostbusters II2.theatricalDVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1VPN-P5xWjbEHv-VtlzjryjyV-nx7Z_w_/view", icon: "🎬" },
        { title: "Santa Claus Is Comin\' to Town 1970 480p.mp4", year: 1970, url: "https://drive.google.com/file/d/1cDy0ctB5vWHQncktpH3lcR0k0HNQXF2A/view", icon: "🎄" },
        { title: "Looney Tunes- Back in Action full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1PA5vcjbxZ9114U77pV4canJ_7xNwMhHm/view", icon: "🎬" },
        { title: "Gremlins 2.theatrical DVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1rrs7I7yn1V2HJdQHooGhnpI-yVwYccj6/view", icon: "🎬" },
        { title: "Ted 2012 720p.mp4", year: 2012, url: "https://drive.google.com/file/d/1L2VeVmHqz7ORuLVsjUgRyxCwxYJUIDK1/view", icon: "🎬" },
        { title: "Ted 2 2015 720p.mp4", year: 2015, url: "https://drive.google.com/file/d/1NUcOKG5lw0wOApPIBMyVAZgsHMti7OfB/view", icon: "🎬" },
        { title: "Harry Potter and the Sorcerer\'s Stone (2001).mp4", year: 2001, url: "https://drive.google.com/file/d/1bJMKhvzwuVfAYECLheyA_h38T9oYvkgX/view", icon: "⚡" },
        { title: "Harry Potter and the Chamber of Secrets (2002).mp4", year: 2002, url: "https://drive.google.com/file/d/1AC6j5pNVDl6fcvdT3e3hsAUkkBU-o3xD/view", icon: "⚡" },
        { title: "Harry Potter and the Prisoner of Azkaban (2004).mp4", year: 2004, url: "https://drive.google.com/file/d/1Zu15ykGtc1xxKIKfAeUV_L1vAbCt--zO/view", icon: "⚡" },
        { title: "Harry Potter and the Goblet of Fire (2005).mp4", year: 2005, url: "https://drive.google.com/file/d/1yYxqmSv99zFBsJkT0cZYd4C4PTNC9bUU/view", icon: "⚡" },
        { title: "Harry Potter and the Order of the Phoenix (2007).mp4", year: 2007, url: "https://drive.google.com/file/d/1eVK_s8Sp-Gvv1J65ocyLbwyqC7vkuoFK/view", icon: "⚡" },
        { title: "Harry Potter and the Half Blood Prince (2009).mp4", year: 2009, url: "https://drive.google.com/file/d/1QfAnvJtU3oR7IV2CrN2qRx4vFThjbbe1/view", icon: "⚡" },
        { title: "Harry Potter and the Deathly Hallows - Part 1 (2010).mp4", year: 2010, url: "https://drive.google.com/file/d/17UlhT2qVX10O8AksEEdWuaUqoVF78-oH/view", icon: "⚡" },
        { title: "Harry Potter and the Deathly Hallows - Part 2 (2011).mp4", year: 2011, url: "https://drive.google.com/file/d/16jXkeJny6L8MrC_7issz4AtANAzNDJqw/view", icon: "⚡" },
        { title: "04 Transformers Age Of Extinction - IMAX 2014 Eng Rus Multi-Subs 720p [H264-mp4].mp4", year: 2014, url: "https://drive.google.com/file/d/1evgnLc_0TRlHQ8_tcMcZYaYY-2_RmKWZ/view", icon: "🎬" },
        { title: "Stranger Thing S1", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1ivEnKhKMN0sZzWhp-L6VgT-7PRi1iYFY", icon: "🎬" },
        { title: "Stranger Things S2", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1NmYcLFjMT3ZkD8SV_oKmPQbz4AzlG_jy", icon: "🎬" },
        { title: "Stranger Things S3", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1BWKjz8w-faHKtWl1qSf0pyaRhreoAXVP", icon: "🎬" },
        { title: "Stranger Things S4", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1aO-IcC1Rmr7d-hDsfCVXLg97QkzzBptz", icon: "🎬" },
        { title: "Season 5", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1y2ynRtvKVJFoOiXtNxPj098z33ymZquc", icon: "🎬" },
        { title: "the Amazing Digital Circus Series (Netflix Ripped)", year: 2024, url: "https://drive.google.com/drive/folders/1OPRfaVkM8MPcLLXmjAa24krAZCr0kHEO", icon: "🎬" },
        { title: "Avengers.Endgame.2019.1080p.BluRay.x264-[YTS.LT].mp4", year: 2019, url: "https://drive.google.com/file/d/1UsxNtlBxGFp955GwEB-s8wYJCA6bXt7e/view", icon: "🎬" },
        { title: "Air Buddies 2006 360p.ts", year: 2006, url: "https://drive.google.com/file/d/11kIA5YMOUUPgNsNJWsiXSIXS7hIK04uj/view", icon: "🎬" },
        { title: "Beetlejuice Beetlejuice CAM HD 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1WnfCHnjlcN7joibU1e0RieYJNFBPgXRn/view", icon: "🎬" },
        { title: "Back to the Future.mp4", year: 2024, url: "https://drive.google.com/file/d/1ZwP0FLdFdAoeskqGvQYX5CwqEeSFWS1G/view", icon: "🎬" },
        { title: "Boyz.n.The.Hood.1991.1080p.BRrip.x264.YIFY.mp4", year: 1991, url: "https://drive.google.com/file/d/1fCv2dJuy8k_NQWAxbNRxqW0_zKetF-uy/view", icon: "🎬" },
        { title: "Captain America- The First Avenger 2011 720p.mp4", year: 2011, url: "https://drive.google.com/file/d/1a-vhj45NB5D36Fw8RSoqj4Cra16e2tyC/view", icon: "🎬" },
        { title: "Finding Nemo.mp4", year: 2024, url: "https://drive.google.com/file/d/11CN0fT7CwCHgz__mY4FWjcoT5w_wZD9S/view", icon: "🎬" },
        { title: "Spider-Man- Far from Home 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1YFUpSLmxb6xIlbdJXScIkRYvwYxvJ_18/view", icon: "🕷️" },
        { title: "The.LEGO.Batman.Movie.2017.720p.BluRay.x264.VPPV.mkv", year: 2017, url: "https://drive.google.com/file/d/1Xn4F4GNvfKOljko2ZE_JUQcBWIHhO0ql/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Finding Dory.mp4", year: 2024, url: "https://drive.google.com/file/d/1uDOp65KtEnID520JjNC_kMOm91mNfGq6/view", icon: "🎬" },
        { title: "spidermanhomecoming.mp4", year: 2024, url: "https://drive.google.com/file/d/1I9PYrrRLo1m_5Wtfq59L6gHGa3NaUXDv/view", icon: "🕷️" },
        { title: "Full Fight Ripped From Netflix Jake Paul vs. Mike Tyson.mp4", year: 2024, url: "https://drive.google.com/file/d/1z_SQU-8-fE-GDUrOAjWZBEhVPlRE7Bra/view", icon: "🎬" },
        { title: "The Amazing Spider-Man 2 full movie", year: 2024, url: "https://drive.google.com/file/d/1GLmG41OhRt9YfRa4r5nwvw8hCIS1Sofv/view", icon: "🕷️" },
        { title: "ghostbustersDVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1OY7HZkep77B12l4wRYCN_D23gR9M2G9m/view", icon: "🎬" },
        { title: "The Super Mario Bros. Movie 720p HD 2023.mp4", year: 2023, url: "https://drive.google.com/file/d/1OsyF2LKJqjtv0b2Xd9GWOLcYkzny3VZo/view?t%3D4", icon: "🎬" },
        { title: "Home alone 2 lost in New York 1992 360p DVDRIP.mp4", year: 1992, url: "https://drive.google.com/file/d/1Aj4Ys3ofogKhxEAMh6PUncpYF_OHZ_ZK/view", icon: "🎬" },
        { title: "Indiana Jones and the Dial of Destiny full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1VlBSRt845v8pZeGozXzlvaNtHst7ecQ5/view", icon: "🎬" },
        { title: "Home Alone 1990 720p.mp4", year: 1990, url: "https://drive.google.com/file/d/18YKNCTokG3B7ZWzCE3thunyDJMktLxnm/view", icon: "🎬" },
        { title: "Moana 2 2024 1080p HD CAM.mp4", year: 2024, url: "https://drive.google.com/file/d/1iVJq1FsNG577gesP7CaTWPLgdqAtnaEg/view", icon: "❄️" },
        { title: "The Underdoggs 2024 HD.mp4", year: 2024, url: "https://drive.google.com/file/d/18qSFllMJr4gLotZx7-XIhMxLXlU2l1UD/view?t%3D1", icon: "🎬" },
        { title: "Napoleon full movie cam.mp4", year: 2024, url: "https://drive.google.com/file/d/1wBXYvvXlGsI7g6h-cMMZQ1YhoJ4SxHpl/view", icon: "🎬" },
        { title: "Five Nights at Freddy\'s full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1OyO1OdhtfwR883Uvi0QPP5iooGcxTVSY/view", icon: "🎬" },
        { title: "The Goonies 1985 360p DVDRIPPED.mp4", year: 1985, url: "https://drive.google.com/file/d/18sSKADZamG3w8ZaanP93XU4yHSVKzApM/view?t%3D4221", icon: "🎬" },
        { title: "SONIC THE HEDGEHOG 2 - 1080P (ENGLISH).mp4", year: 2024, url: "https://drive.google.com/file/d/13YPdlfR1BTzXfqwmfbzfiuPycjQsh0Yb/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "The Lorax 2017 720p HD.mp4", year: 2017, url: "https://drive.google.com/file/d/1Kl4ieKALPoEYbllsRy7V8AYiPtJATg7W/view", icon: "🎬" },
        { title: "Five Nights at Freddy\'s full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1OyO1OdhtfwR883Uvi0QPP5iooGcxTVSY/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Deadpool 2016 720p HD.ts", year: 2016, url: "https://drive.google.com/file/d/17QTeEVPc-E4YsWm-tQ4toG-DpLefpx4E/view?t%3D19", icon: "🎬" },
        { title: "Everybody Hates Chris S01-S04 (2005-)", year: 2005, url: "https://drive.google.com/drive/folders/1RUZj9WQzdEBYYLeKhD_Y9GRcZbNZMSEy", icon: "🎬" },
        { title: "Despicable Me 4 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1siki1wYP3LpfjFpUT8Z9lJuJzl7MdBhX/view?t%3D3", icon: "🎬" },
        { title: "tRANSFORMERS", year: 2024, url: "https://drive.google.com/file/d/1epYCAJMFrmUBlId2wWFI0lcC1UvbX-Ez/view", icon: "🎬" },
        { title: "The Garfield Movie 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1W0OfyIS_7f0DKjC6x1bVLI4WBFabZXis/view", icon: "🎬" },
        { title: "Spider-Man- No Way Home.theatrical 2021 DVDRIPPED.mp4", year: 2021, url: "https://drive.google.com/file/d/1oddQM8w-8UqQIvB-fPpy1h-7xvAbklmA/view", icon: "🕷️" },
        { title: "Top Gun Maverick.mp4", year: 2024, url: "https://drive.google.com/file/d/1nmGDHktR96jkaYl2lf-d-XTtNtFh4PTv/view", icon: "🎬" },
        { title: "Avengers- Infinity War 2018 1080p HD.mkv", year: 2018, url: "https://drive.google.com/file/d/1zpl7Dngm7ESW_yLZvcQMm9AhmR1izyus/view?t%3D2204", icon: "🎬" },
        { title: "Garfield & Friends Full Series", year: 2024, url: "https://drive.google.com/drive/folders/1u9Pr61UADQ2cTYvkIkqpEjCzJf9bM9Ic", icon: "🎬" },
        { title: "StarWarsEpIVnewhope.mp4", year: 2024, url: "https://drive.google.com/file/d/1aiJD6uDyAq9fQN2prN50djHHxmjTwQOC/view", icon: "🎬" },
        { title: "Murder Drones full Season", year: 2024, url: "https://drive.google.com/drive/folders/1QAiFXO6iG-IB2A2oGModfBP74aVHa6S8?usp%3Ddrive_link", icon: "🎬" },
        { title: "Halloween Kills 2021 360p.ts", year: 2021, url: "https://drive.google.com/file/d/1CdhzdqiTQvWMCvmLE_zFLuc2jHvTMqq8/view?t%3D3", icon: "😱" },
        { title: "Diary.Of.A.Wimpy.Kid.Rodrick.Rules.2011.720p.BluRay.x264-[YTS.AG].mp4", year: 2011, url: "https://drive.google.com/file/d/1rKRsgdNioFs3rtkZai7Gz97FtAX0jdJ_/view", icon: "🎬" },
        { title: "Halloween Ends 2022 720p HD.ts", year: 2022, url: "https://drive.google.com/file/d/1Lsjj8VceEJMM4mvav7WOwhAH1X56-woA/view", icon: "😱" },
        { title: "Diary Wimpy Kid Dog Day 2012.mp4", year: 2012, url: "https://drive.google.com/file/d/0B6fv-OkwXRTzZ090UHlWcHY2dkk/view?resourcekey%3D0-TgoMzBEyMorySYhDqB9uGA", icon: "🎬" },
        { title: "TRON_Steven Lisberger_1982.mkv", year: 1982, url: "https://drive.google.com/file/d/1hbhWcI11gA5EcXAxXGJkIjzq7VQIpZGp/view", icon: "🎬" },
        { title: "the Amazing Digital Circus Series (Netflix Ripped)", year: 2024, url: "https://drive.google.com/drive/folders/1OPRfaVkM8MPcLLXmjAa24krAZCr0kHEO?usp%3Ddrive_link", icon: "🎬" },
        { title: "wILD rOBOT", year: 2024, url: "https://drive.google.com/file/d/1SRZU-WaeYNHMvHNEwl3uAIuMSOJ4R1jY/view", icon: "🎬" },
        { title: "Bee Movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1AiuhAubyrKVmqpu3OfM1sonhRJrzw5v6/view", icon: "🎬" },
        { title: "Top Gun Maverick.mp4", year: 2024, url: "https://drive.google.com/file/d/1nmGDHktR96jkaYl2lf-d-XTtNtFh4PTv/view", icon: "🎬" },
        { title: "SpongeBob Movie- Sponge on the Run full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1RCiXmbRfWyMQnJLa5vNTvSiIxZFG1mq5/view?t%3D5", icon: "🎬" },
        { title: "The Garfield Movie 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1W0OfyIS_7f0DKjC6x1bVLI4WBFabZXis/view", icon: "🎬" },
        { title: "Barbie - Life in the Dreamhouse", year: 2024, url: "https://drive.google.com/drive/folders/16XksTOld5HoYI8uCgOU8aCHtlAFgERQR", icon: "🎬" },
        { title: "SpongeBob Movie- Sponge on the Run full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1RCiXmbRfWyMQnJLa5vNTvSiIxZFG1mq5/view?t%3D5", icon: "🎬" },
        { title: "A.Bugs.Life.1998.1080p.BluRay.x265.CZFxP.mp4", year: 1998, url: "https://drive.google.com/file/d/1AIq4OqiMWiY9zZSayF5VID7pfTwSH6BM/view", icon: "🎬" },
        { title: "Moana 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1EsX8k7nfYQrzC6apqJqnyfH7HLAHl31G/view?t%3D2810", icon: "❄️" },
        { title: "Avatar.mp4", year: 2024, url: "https://drive.google.com/file/d/16tKuEYtxi7EeKtX3yZZR-nXgZ_oGTxXS/view", icon: "🎬" },
        { title: "Inside Out 2015 360p.ts", year: 2015, url: "https://drive.google.com/file/d/1e0OdhlzTKWie6TDXNDOKjKYXbfYfmz6t/view?t%3D3777", icon: "🎬" },
        { title: "Transformers- Dark of the Moon 2011 360p.ts", year: 2011, url: "https://drive.google.com/file/d/1P3AU9onyXEKK03hRH63SKPoHbjPwMOFB/view", icon: "🎬" },
        { title: "Avatar.mp4", year: 2024, url: "https://drive.google.com/file/d/16tKuEYtxi7EeKtX3yZZR-nXgZ_oGTxXS/view", icon: "🎬" },
        { title: "GOOFY.mp4", year: 2024, url: "https://drive.google.com/file/d/1e4NzmeC84qest_9Wzmtvmi80brGPYnsN/view", icon: "🎬" },
        { title: "Copy of Harry Potter And The Sorcerer\'s Stone.mp4", year: 2024, url: "https://drive.google.com/file/d/1W1XCvoR94ujHF_Oy9lMMAZEPAzBhYqsk/view?usp%3Ddrivesdk", icon: "⚡" },
        { title: "Despicable Me 4 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1_Lbll9HEdgCPJW4fkYZSLakCYnoRDMyl/view?usp%3Ddrivesdk", icon: "🎬" },
        { title: "Spider-Man- Across the Spider-Verse full movie", year: 2024, url: "https://drive.google.com/file/d/1dSeZ1c4_p8T_lW7z0qpKsebKYN-R3zHR/view", icon: "🕷️" },
        { title: "Deadpool & Wolverine 720p HD 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1aBzsoTJAjhZeFFDkIV2SN7p7ZHagUEDc/view?t%3D375", icon: "🎬" },
        { title: "Sonic the Hedgehog full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1HaXeNylNfZXhRudGTNLUWtrN-oAmone4/view", icon: "🎬" },
        { title: "Space Jam A New Legacy.mp4", year: 2024, url: "https://drive.google.com/file/d/1v2xqKQcAvndfcqsctZH73NR2AjFXsrUr/view", icon: "🎬" },
        { title: "Spider-Man- Far from Home 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1YFUpSLmxb6xIlbdJXScIkRYvwYxvJ_18/view", icon: "🕷️" },
        { title: "spidermanhomecoming.mp4", year: 2024, url: "https://drive.google.com/file/d/1I9PYrrRLo1m_5Wtfq59L6gHGa3NaUXDv/view", icon: "🕷️" },
        { title: "The Super Mario Bros. Movie full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1OsyF2LKJqjtv0b2Xd9GWOLcYkzny3VZo/view?t%3D4", icon: "🎬" },
        { title: "Terrifier 2 2022 720p HD.mp4", year: 2022, url: "https://drive.google.com/file/d/1_Jjo7rOcCkYt3UryVkV2XvTfrL4QvHTE/view", icon: "😱" },
        { title: "Home alone 2 lost in New York.mp4", year: 2024, url: "https://drive.google.com/file/d/1Aj4Ys3ofogKhxEAMh6PUncpYF_OHZ_ZK/view", icon: "🎬" },
        { title: "The Lorax full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1Kl4ieKALPoEYbllsRy7V8AYiPtJATg7W/view", icon: "🎬" },
        { title: "Home Alone full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/18YKNCTokG3B7ZWzCE3thunyDJMktLxnm/view", icon: "🎬" },
        { title: "The Underdoggs 2024 HD.mp4", year: 2024, url: "https://drive.google.com/file/d/18qSFllMJr4gLotZx7-XIhMxLXlU2l1UD/view?t%3D1", icon: "🎬" },
        { title: "Five Nights at Freddy\'s full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1OyO1OdhtfwR883Uvi0QPP5iooGcxTVSY/view", icon: "🎬" },
        { title: "Scream VI.mp4", year: 2024, url: "https://drive.google.com/file/d/1kph0MTxbIHWar5DVkqmrZWiy5LuF9--A/view?t%3D3838", icon: "😱" },
        { title: "The Goonies Full Moive DVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/18sSKADZamG3w8ZaanP93XU4yHSVKzApM/view?t%3D4221", icon: "🎬" },
        { title: "Deadpool 2016 720p HD.ts", year: 2016, url: "https://drive.google.com/file/d/17QTeEVPc-E4YsWm-tQ4toG-DpLefpx4E/view?t%3D19", icon: "🎬" },
        { title: "Despicable Me 4 2024 HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1siki1wYP3LpfjFpUT8Z9lJuJzl7MdBhX/view?t%3D3", icon: "🎬" },
        { title: "Cult of Chucky full movie", year: 2024, url: "https://drive.google.com/file/d/1qPipvrYaINji65Pr6U9Wb8eLXR1PcggX/view?t%3D1", icon: "🎬" },
        { title: "saw x full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/10Wn3otVUN00Sfc6sRZSnDFfaYDJ5VTNR/view?t%3D3039", icon: "🎬" },
        { title: "Transformers- Rise of the Beasts full movie", year: 2024, url: "https://drive.google.com/file/d/1epYCAJMFrmUBlId2wWFI0lcC1UvbX-Ez/view", icon: "🎬" },
        { title: "Spider-Man- No Way Home.theatrical 2021 DVDRIPPED.mp4", year: 2021, url: "https://drive.google.com/file/d/1oddQM8w-8UqQIvB-fPpy1h-7xvAbklmA/view", icon: "🕷️" },
        { title: "Avengers- Infinity War 2018 1080p HD.mkv", year: 2018, url: "https://drive.google.com/file/d/1zpl7Dngm7ESW_yLZvcQMm9AhmR1izyus/view?t%3D2204", icon: "🎬" },
        { title: "StarWarsEpIVnewhope.mp4", year: 2024, url: "https://drive.google.com/file/d/1aiJD6uDyAq9fQN2prN50djHHxmjTwQOC/view", icon: "🎬" },
        { title: "Halloween Kills 2021 360p.ts", year: 2021, url: "https://drive.google.com/file/d/1CdhzdqiTQvWMCvmLE_zFLuc2jHvTMqq8/view?t%3D3", icon: "😱" },
        { title: "Halloween Ends 2022 720p HD.ts", year: 2022, url: "https://drive.google.com/file/d/1Lsjj8VceEJMM4mvav7WOwhAH1X56-woA/view", icon: "😱" },
        { title: "Zootopia 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1HYeIrbf8A-vfvJsvYP59AQzG9l8nt03h/view?t%3D2631", icon: "🎬" },
        { title: "Terrifier full movie", year: 2024, url: "https://drive.google.com/file/d/1_pQ3kbz_a8l3B7SKfdP9dYQwKax0WHUD/view", icon: "😱" },
        { title: "Freddy vs. Jason 2003 360p.mp4", year: 2003, url: "https://drive.google.com/file/d/1njTri-d6eamwa3AFwuVD9nORZ7K6-D-N/view", icon: "🎬" },
        { title: "IT 2017 720p full movie", year: 2017, url: "https://drive.google.com/file/d/1BhQDbp8lXDwS-Q-pq4axufeZI-5TklpR/view", icon: "🎬" },
        { title: "Joker 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1__wCd7uV9s7qY-o7qZ6F1lO9UQPV7B90/view", icon: "🎬" },
        { title: "The Garfield Movie 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1W0OfyIS_7f0DKjC6x1bVLI4WBFabZXis/view", icon: "🎬" },
        { title: "Inside Out 2 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1SABVZNMwHTME4hsFwL9IWyWZPKDTBSoT/view?t%3D2499", icon: "🎬" },
        { title: "It Chapter Two 720p 2019.mp4", year: 2019, url: "https://drive.google.com/file/d/1vLFTFzlvu9TJXbcL40gnag9Xart3pKQI/view", icon: "🎬" },
        { title: "Transformers- Dark of the Moon 2011 360p.ts", year: 2011, url: "https://drive.google.com/file/d/1P3AU9onyXEKK03hRH63SKPoHbjPwMOFB/view", icon: "🎬" },
        { title: "Salem\'s Lot 2024 HD.ts", year: 2024, url: "https://drive.google.com/file/d/1PzQJ5iQOKas1DnXPUFsDsHbjEhR_bu1z/view", icon: "🎬" },
        { title: "Kingdom of the Planet of the Apes 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1dZ30bamkNV7OP9bJRF9bscboD9aRYaPY/view", icon: "🎬" },
        { title: "Jurassic World Dominion full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1x84uwAQzm7-j9MhDdNF5sb_jCRQFhjIa/view", icon: "🎬" },
        { title: "Ghostbusters- Frozen Empire full movie.ts", year: 2024, url: "https://drive.google.com/file/d/115NMznT9rm8LGZzRzE0OvgqCbP-_y-Ia/view", icon: "❄️" },
        { title: "Beetlejuice Beetlejuice CAM HD 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1WnfCHnjlcN7joibU1e0RieYJNFBPgXRn/view", icon: "🎬" },
        { title: "Brightburn 2019 360p.ts", year: 2019, url: "https://drive.google.com/file/d/1j1cYjjEDqV8VcTJ3oSwaOeMHPglVd-um/view?t%3D18", icon: "🎬" },
        { title: "Teenage Mutant Ninja Turtles- Mutant Mayhem 2023 720p.mp4", year: 2023, url: "https://drive.google.com/file/d/1emX4CShNejqhStNK-b0xDVBBMA0t2gcE/view", icon: "🎬" },
        { title: "Pet Sematary- Bloodlines full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/122OjLQhI6uIS_qThRkLgUcgJh-U7PxBE/view", icon: "🎬" },
        { title: "The Nun II 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1CPZj45zQd1Ih-G0I7Ifo8dACj-4jbOJa/view?t%3D7", icon: "🎬" },
        { title: "Shrek full movie full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1ohXNP73ZyD2VISZZ0aV_rL2MSWskf9NX/view", icon: "🎬" },
        { title: "Shrek 2 full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1xtr5zFmpt6iD89Tn8VthzEiBij89J9pZ/view", icon: "🎬" },
        { title: "Scream 3 2000.ts", year: 2000, url: "https://drive.google.com/file/d/1IzaFo-PmeI3AiQ_qoDdjCbUdiu8Ohs-w/view", icon: "😱" },
        { title: "Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/14BaJhmDRr3veoH436CKdPDp9r-j5214I/view", icon: "🕷️" },
        { title: "Spider-Man 2 2004.ts", year: 2004, url: "https://drive.google.com/file/d/1BJTsBEOeTbpv3fqU0ejzb44aQGrdLhyN/view", icon: "🕷️" },
        { title: "Spider-Man 3 2007.ts", year: 2007, url: "https://drive.google.com/file/d/1vi0w7U65XeR-u00AQ8uS9s3C-IoiV-_1/view", icon: "🕷️" },
        { title: "SpongeBob Movie- Sponge on the Run full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1RCiXmbRfWyMQnJLa5vNTvSiIxZFG1mq5/view?t%3D5", icon: "🎬" },
        { title: "The Wolverine (2013) BluRay 720p.mp4", year: 2013, url: "https://drive.google.com/file/d/0BzeqnwcztH5cRERqUGl6TFkyc3M/view?resourcekey%3D0--S8rnshNZ6cP5uYrkFu3WA", icon: "🎬" },
        { title: "Terrifier 3 2024 HD.mkv", year: 2024, url: "https://drive.google.com/file/d/1sAj4FqfEIzHPIW7ZUPGGSOFTTaJr5AGI/view", icon: "😱" },
        { title: "Annabelle 2014 DVDRIPPED.mp4", year: 2014, url: "https://drive.google.com/file/d/12sQn1gxallBigyxC2aDFUWsKqX_g-e-7/view", icon: "🎬" },
        { title: "Cars 2006 360p.ts", year: 2006, url: "https://drive.google.com/file/d/106N7zd611ShtPMOx97XwFSxkg8theQLN/view", icon: "🎬" },
        { title: "Toy Story 1995 720p.ts", year: 1995, url: "https://drive.google.com/file/d/1fW6Ov5NIaRh4h78-qBpWeln_Vs9oEXOQ/view?t%3D1", icon: "🎬" },
        { title: "Toy Story 2 1999.mp4", year: 1999, url: "https://drive.google.com/file/d/1k3RVDc_Vah1H9lFsXQZJ6mE3KqdDcK_T/view", icon: "🎬" },
        { title: "Leatherface- The Texas Chainsaw Massacre III 1990.ts", year: 1990, url: "https://drive.google.com/file/d/1l1v62IhzGxBVZ8h4u8-8z3qyQ0LMHLDs/view", icon: "🎬" },
        { title: "The First Purge 2018 720p HD.ts", year: 2018, url: "https://drive.google.com/file/d/1Br63apD1pglhHIvSR2zLJ5p27nAxVG0Z/view?t%3D1", icon: "🎬" },
        { title: "Elf.mp4", year: 2024, url: "https://drive.google.com/file/d/1aus7IcL_iSNmvkKohgiZCjNoCmztRehu/view", icon: "🎄" },
        { title: "Texas Chainsaw Massacre 720p 2022.ts", year: 2022, url: "https://drive.google.com/file/d/1DX2PS1WKMKTBCcdwxzbjapo7He1OHTFb/view", icon: "🎬" },
        { title: "Deadpool 2 2018 720p HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1tF1C-2tktolFSAJaLG0C2sE_2sGyH3YI/view?t%3D1", icon: "🎬" },
        { title: "Star Wars- Episode II - Attack of the Clones 2002 360p.ts", year: 2002, url: "https://drive.google.com/file/d/1u0ZRN7s8rgAMYtvnGf3zTjpM7Fu6TmW_/view", icon: "🎬" },
        { title: "Star Wars- Episode III - Revenge of the Sith 2005 360p.ts", year: 2005, url: "https://drive.google.com/file/d/1lEszWnr2BinTfzBGqtoDV1W9wMIlTQtb/view", icon: "🎬" },
        { title: "Iron Man 3 2013.ts", year: 2013, url: "https://drive.google.com/file/d/1I3cDTsDBihDYId6KuKS6ighOcJ5g6oyC/view", icon: "🎬" },
        { title: "Baghead 2023 720p HD.ts", year: 2023, url: "https://drive.google.com/file/d/17Tfb1RDtFZ8fJGIKi0qWrQxnaP-mG97A/view", icon: "🎬" },
        { title: "Saw- The Final Chapter 2010.ts", year: 2010, url: "https://drive.google.com/file/d/1zXFh6WfdjGFEVgMNrIbsvAfO6j6yLw-W/view", icon: "🎬" },
        { title: "Venom- Let There Be Carnage 2021 720p HD.mkv", year: 2021, url: "https://drive.google.com/file/d/1bcJ4X5WvyimpbB8U15Mb1j-kzct-nFIZ/view", icon: "🎬" },
        { title: "Venom 2018 HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1XoN0B1rsNKDDRphmI8bM606r4wRQ6JUH/view", icon: "🎬" },
        { title: "Doctor Strange 2018 720p HD.mkv", year: 2018, url: "https://drive.google.com/file/d/11PAFLA_D94t0ZbSqcy-ggyl2DU7g0Ay2/view", icon: "🎬" },
        { title: "2012 (2009) [1080p] {5.1}.mp4", year: 2012, url: "https://drive.google.com/file/d/0B69h6W6sv5LIRGZhb0NUTF9pMVk/view?resourcekey%3D0-W0j9qqJACbM16iPs_zKHww", icon: "🎬" },
        { title: "A Dog\'s Purpose (2017) [Full Unblocked Movies 24].m4v", year: 2017, url: "https://drive.google.com/file/d/0B-uFeCO4yCFISTFmNlE3akNDbU0/view?t%3D1%26resourcekey%3D0-RNIEk2RiGAR76Qv_ACNU8g", icon: "🎬" },
        { title: "Dodgeball.avi", year: 2024, url: "https://drive.google.com/file/d/0B8oerU1d9p_ta2lHekdKeDQxekE/view?resourcekey%3D0-fu98BCeLfAdWKtFRewzNig", icon: "🎬" },
        { title: "Forrest Gump (1994) [Full Unblocked Movies 24].m4v", year: 1994, url: "https://drive.google.com/file/d/0B-uFeCO4yCFIa3hNRDc5eVlBSjQ/view?t%3D6%26resourcekey%3D0-rOslYKb17fIDWtuiy8P2ag", icon: "🎬" },
        { title: "Gulliver\'s.Travels.2010.BluRay.720p.DTS.x264-CHD.mkv", year: 2010, url: "https://drive.google.com/file/d/0B6lIkxTshK4KTTh0RDlsSzN3Z0U/view?resourcekey%3D0-XfjX5Cc6t5WQVrVGr2Rrrg", icon: "🎬" },
        { title: "King Kong (2005) - HD.mp4", year: 2005, url: "https://drive.google.com/file/d/0By5b6VRVheoWUmNTcEJiOXdJdjQ/view?resourcekey%3D0-S6FZYivo19MI9Z4h-ZRrOw", icon: "🎬" },
        { title: "kung fu panda.mp4", year: 2024, url: "https://drive.google.com/file/d/0B5QJgBuViQvxMExwdFd4LXp1cjQ/view?resourcekey%3D0--AymX6yocYDSRtZ5jQFm1g", icon: "🎬" },
        { title: "Passengers.2016.720p.HC.HDRip.X264.mkv.mp4", year: 2016, url: "https://drive.google.com/file/d/0BzXAXZUeO4UPc2YxOGlYX3NCdms/view?resourcekey%3D0-ik09RV3OF595hMk2yQeNvA", icon: "🎬" },
        { title: "pitch perfect.flv", year: 2024, url: "https://drive.google.com/file/d/0B_CAII75-qyKRHF6QjhFUXlPUEk/view?resourcekey%3D0-4he88shdafZGGNVAkyVrxg", icon: "🎬" },
        { title: "Rocky 1.mp4", year: 2024, url: "https://drive.google.com/file/d/0B7Z9hjzLxrtXZDBEZ29wOG90MGs/view?resourcekey%3D0-gY-cJTrxfMxIDBbPX33HyA", icon: "🎬" },
        { title: "The Angry Birds Movie 2016.mp4", year: 2016, url: "https://drive.google.com/file/d/0B4hN7fniyzpwalFxaEl3Tm5nLVU/view?resourcekey%3D0-ANoY0MoL3TgANh4nqeyZtQ", icon: "🎬" },
        { title: "The Wolverine (2013) BluRay 720p.mp4", year: 2013, url: "https://drive.google.com/file/d/0BzeqnwcztH5cRERqUGl6TFkyc3M/view?resourcekey%3D0--S8rnshNZ6cP5uYrkFu3WA", icon: "🎬" },
        { title: "Trolls.2016.720p.BluRay (1).mp4", year: 2016, url: "https://drive.google.com/file/d/0B3Oy5ahf02mFZU1KMG0xM0FYQXM/view?resourcekey%3D0-Mq9TLnk81W8W37eLt6Qelw", icon: "🎬" },
        { title: "Watch Kill Zone 2 2015 Free Full​.mp4", year: 2015, url: "https://drive.google.com/file/d/0B1vIGLoz_v3ndkFxT3NuR1REZTg/view?resourcekey%3D0--rOOhqAKVqB-6mHMQNa6-Q", icon: "🎬" },
        { title: "Why.him.2016.720p.web-dl.mkv", year: 2016, url: "https://drive.google.com/file/d/0B-J9Gkw1iO85Nkd3Q2RsUUJJdzg/view?resourcekey%3D0-v1Dp_otfjjY-lhP5vnuSAg", icon: "🎬" },
        { title: "X-Men- Apocalypse - HD.mp4", year: 2024, url: "https://drive.google.com/file/d/0B-J9Gkw1iO85XzhPMEN5LUVJakk/view?resourcekey%3D0-CM_D9L5sDkTcPNzyuXItiw", icon: "🎬" },
        { title: "Grown Ups 2 (2013) Full Movie.mp4", year: 2013, url: "https://drive.google.com/file/d/1igY-5wivsgwpd3tKUNZ_wcAmAbPpwMcz/view?usp%3Dsharing", icon: "🎬" },
        { title: "Godzilla x Kong The New Empire (2024) (Awafim.tv).mkv", year: 2024, url: "https://drive.google.com/file/d/1h5vNxBZhabSuZdPvbGcFQN1x-xfURsfO/view?usp%3Dsharing", icon: "🎬" },
        { title: "Halloween 2018 720p HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1DDDguEoUyXUIPUmNoodW1X0iftIKdZgv/view", icon: "😱" },
        { title: "Halloween II 1981 720p.mp4", year: 1981, url: "https://drive.google.com/file/d/1j9iwPUFdMSsu0hDSCUEwP7Gz17xuf-lS/view", icon: "😱" },
        { title: "The Nun 2018 720p HD.ts", year: 2018, url: "https://drive.google.com/file/d/1XiM8ECdnhTl6uCEIW8s4MMlQFBs4x-j-/view", icon: "🎬" },
        { title: "Friday the 13th full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1pf3faVonicfbhSDfIviaEWsvKquERczR/view", icon: "🎬" },
        { title: "A Nightmare on Elm Street 1 1984.mp4", year: 1984, url: "https://drive.google.com/file/d/1Tsmb_pRgleOTXo6bAltJ6VDWDmf25Jwa/view", icon: "🎬" },
        { title: "A Nightmare on Elm Street 2# Freddy\'s Revenge (1985) # Full Movie.mp4", year: 1985, url: "https://drive.google.com/file/d/17HLx_cEKFN_CwSGSoCjX27bB-Ynz8xRq/view", icon: "🎬" },
        { title: "Freddy\'s Dead- The Final Nightmare 1991.ts", year: 1991, url: "https://drive.google.com/file/d/1I8o1GaH9-0qMZYuHPj_yGMUw-zTdQS0n/view", icon: "🎬" },
        { title: "Freddy vs. Jason 2003 360p.mp4", year: 2003, url: "https://drive.google.com/file/d/1njTri-d6eamwa3AFwuVD9nORZ7K6-D-N/view", icon: "🎬" },
        { title: "Halloween 1978 720p HD.ts", year: 1978, url: "https://drive.google.com/file/d/1dd4z_ykIghvDgVE0YX7v4RK1zfMxH52r/view", icon: "😱" },
        { title: "Halloween 2007 360p.ts", year: 2007, url: "https://drive.google.com/file/d/1oy9kIOC9bY3U217MWxlac9EDLQmcpFBh/view", icon: "😱" },
        { title: "Child\'s Play 2 DVDRIPPED.mp4", year: 2024, url: "https://drive.google.com/file/d/1IOoeJUBb83Vai480J3iuZsoQSuBC_mnQ/view", icon: "🎬" },
        { title: "The Purge 2013 720p HD.mp4", year: 2013, url: "https://drive.google.com/file/d/1PFz-u8_kVFY8Z--NyloACB1DUwiT0oK4/view", icon: "🎬" },
        { title: "Smile 2 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1PeOUtsdJfWRqJvGwBhRmeBc2fLiQyTJY/view", icon: "🎬" },
        { title: "Paranormal Activity 2009 720p HD.mp4", year: 2009, url: "https://drive.google.com/file/d/1zfEW0gCWjqGslS6TN59edtaiy2JUX929/view", icon: "🎬" },
        { title: "Paranormal Activity 2 2010 720p HD.mp4", year: 2010, url: "https://drive.google.com/file/d/1PCy4KRox73lWIwITH7iQPKP-Wr3bdEGB/view", icon: "🎬" },
        { title: "ghostbustersDVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1OY7HZkep77B12l4wRYCN_D23gR9M2G9m/view", icon: "🎬" },
        { title: "", year: 2024, url: "https://drive.google.com/file/d/1VPN-P5xWjbEHv-VtlzjryjyV-nx7Z_w_/view", icon: "🎬" },
        { title: "Ghostbusters II2.theatricalDVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1VPN-P5xWjbEHv-VtlzjryjyV-nx7Z_w_/view", icon: "🎬" },
        { title: "The Conjuring 2 2016 720p HD.mp4", year: 2016, url: "https://drive.google.com/file/d/1zECVNreFAl8LNGcOrlPqtMzw_Su1S3AC/view", icon: "🎬" },
        { title: "Scooby-Doo! And Krypto, Too! full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1A3KkhmxtAok0WhO2iaSR4GPwOWBs_T6w/view", icon: "🎬" },
        { title: "Wicked 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1EiT5_VDJyMbrG5ezazVyzzOu1nWAkmE8/view", icon: "🎬" },
        { title: "Venom- The Last Dance 2024 CAM 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1C6aUcmJeLpm8ysdYwnt7HRZFAT6k0oQs/view", icon: "🎬" },
        { title: "Dog Man 2025 720p HD CAM.mp4", year: 2025, url: "https://drive.google.com/file/d/1aXHiOSQjs7rCj933p22WnVSHOsVnv7IB/view", icon: "🎬" },
        { title: "Sonic the Hedgehog 3 2024 1080p Camd.mkv", year: 2024, url: "https://drive.google.com/file/d/13pgT7HSDRXYeXvkU0RAEqbdrHrFxPiIm/preview", icon: "🎬" },
        { title: "The Wild Robot 2024 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1_N9iHDAM3RbU2a0GTfgcNXDGuZDT_yZ-/view", icon: "🎬" },
        { title: "Apocalypse Z- The Beginning of the End 2024 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1GusERaoP4GxoQuoxPtcNHAPyT816FwOD/view", icon: "🎬" },
        { title: "Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/14BaJhmDRr3veoH436CKdPDp9r-j5214I/view", icon: "🕷️" },
        { title: "The Amazing Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1jom1D1Dc3eF3ZmCXVzh8lhlXrFGOBpXK/view", icon: "🕷️" },
        { title: "Sonic the Hedgehog 1 2020 1080p HD.mp4", year: 2020, url: "https://drive.google.com/file/d/1HaXeNylNfZXhRudGTNLUWtrN-oAmone4/view", icon: "🎬" },
        { title: "Interstellar 2014 1080p HD.mkv", year: 2014, url: "https://drive.google.com/file/d/1rjx6-12dB11LWwj5jFEFX2QMuZiEVUFk/view?t%3D5", icon: "🎬" },
        { title: "Red One 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1QQx9ogqUJzS3G8GIZXLBAhgx2s2Ol2zZ/view", icon: "🎬" },
        { title: "Minions 2015 720p HD.avi", year: 2015, url: "https://drive.google.com/file/d/1Ly6kH4RMc1kHLQJ1sdejKZHeA58oaKOZ/view", icon: "🎬" },
        { title: "Annie 2014 360p.ts", year: 2014, url: "https://drive.google.com/file/d/1mHYQrlCCmOUjKJTWaSMeQWJTVmND80Z3/view", icon: "🎬" },
        { title: "My Hero Academia Series +Movies (Netflix Ripped)", year: 2024, url: "https://drive.google.com/drive/folders/1UTVnF3QEgQSaj5ZkOU8UiGlG2nJGPVXN", icon: "🎬" },
        { title: "Squid Games Full Series netflix ripped", year: 2024, url: "https://drive.google.com/drive/folders/1Zs2H3Nxl-yQHm21RJNbh2bIAesJ5ouY9", icon: "🎬" },
        { title: "Pokémon series", year: 2024, url: "https://drive.google.com/drive/folders/1I7-ZUInlg9jb4R6LGq0qX3n7bjGKPFFO", icon: "🎬" },
        { title: "Family Guy Season 1-23 Complete!-peterGrffin", year: 2024, url: "https://drive.google.com/drive/folders/11W6C-Jqv9iQVasqjfiaYz77puax1UTjH", icon: "👨‍👩‍👧‍👦" },
        { title: "Sonic X full series DVD Ripped", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1rM_wiU6k3TbIDvrp3kt72-4BFWO4GC7G", icon: "🎬" },
        { title: "Moana 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1EsX8k7nfYQrzC6apqJqnyfH7HLAHl31G/view", icon: "❄️" },
        { title: "The Three Caballeros 1944 360p.ts", year: 1944, url: "https://drive.google.com/file/d/12HuPI63H5GYROrTucCyldzJBdmm9S5mc/view", icon: "🎬" },
        { title: "Toy Story 1995 720p.ts", year: 1995, url: "https://drive.google.com/file/d/1fW6Ov5NIaRh4h78-qBpWeln_Vs9oEXOQ/view", icon: "🎬" },
        { title: "Toy Story 2 1999.mp4", year: 1999, url: "https://drive.google.com/file/d/1k3RVDc_Vah1H9lFsXQZJ6mE3KqdDcK_T/view", icon: "🎬" },
        { title: "Toy Story 3.mp4", year: 2024, url: "https://drive.google.com/file/d/13msxxmyEco7CRBkO_Ju1SMx5KK4r4Su8/view", icon: "🎬" },
        { title: "Pinocchio 1940 360p.ts", year: 1940, url: "https://drive.google.com/file/d/1psiZOj26mD6DZzCn0CmK2jncoLvuOg3g/view", icon: "🎬" },
        { title: "Cars 2006 360p.ts", year: 2006, url: "https://drive.google.com/file/d/106N7zd611ShtPMOx97XwFSxkg8theQLN/view", icon: "🎬" },
        { title: "The Jungle Book 1967 1080p HD.mkv", year: 1967, url: "https://drive.google.com/file/d/1-FXYaGyNS9PDT1b2loTUnLFx9Rp3O2qk/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Lady and the Tramp 1955 360p.ts", year: 1955, url: "https://drive.google.com/file/d/1G717YCDsn8d9alLW2bwJDHSZfTCPi-sF/view", icon: "🎬" },
        { title: "Inside Out 2015 360p.ts", year: 2015, url: "https://drive.google.com/file/d/1e0OdhlzTKWie6TDXNDOKjKYXbfYfmz6t/view", icon: "🎬" },
        { title: "Inside Out 2 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1SABVZNMwHTME4hsFwL9IWyWZPKDTBSoT/view", icon: "🎬" },
        { title: "Finding Nemo.mp4", year: 2024, url: "https://drive.google.com/file/d/11CN0fT7CwCHgz__mY4FWjcoT5w_wZD9S/view", icon: "🎬" },
        { title: "Avatar.mp4", year: 2024, url: "https://drive.google.com/file/d/16tKuEYtxi7EeKtX3yZZR-nXgZ_oGTxXS/view", icon: "🎬" },
        { title: "The Mask 1994 720p HD.mp4", year: 1994, url: "https://drive.google.com/file/d/1ExVaSRcps4wvIcRczczvBPSGYxUkfvXE/view", icon: "🎬" },
        { title: "Spy X Family Season 1", year: 2024, url: "https://drive.google.com/drive/folders/16wy42AB2KsdqcfVCNKadDg8JPNtTFmur?usp%3Ddrive_link", icon: "🎬" },
        { title: "gravity Falls Full Series", year: 2024, url: "https://drive.google.com/drive/folders/1Q6s6AB7BAOndbFy4xcnuX4FjO8uHnqaZ", icon: "🎬" },
        { title: "One Piece EP 1 - EP5", year: 2024, url: "https://drive.google.com/drive/folders/1lgDdn58H8BoRI0kzGo910YF1Fm2QSu_p", icon: "🎬" },
        { title: "Jujutsu Kaisen seasons 1-2 netflix ripped", year: 2024, url: "https://drive.google.com/drive/folders/1eqNcKK02wEdRV7RnfrmDRZf2s2QZHUyj", icon: "🎬" },
        { title: "season 1", year: 2024, url: "https://drive.google.com/drive/folders/1ZGPUs3433E9KdIAjRnOH3gfEXaq1rmcw", icon: "🎬" },
        { title: "Knuckles Series", year: 2024, url: "https://drive.google.com/drive/folders/1P08W5o2K-hyR7w5F11mWo9ltAw3ZLbkA", icon: "🎬" },
        { title: "Regular Show Episodes +Movie", year: 2024, url: "https://drive.google.com/drive/folders/1tedaT2-lJvdIToqgsBx7lDo4tJl3TY-U?usp%3Ddrive_link", icon: "🎬" },
        { title: "Poltergeist 1982.mp4", year: 1982, url: "https://drive.google.com/file/d/1ycfMX3q8QUTs9G_ua74tz_PHHVa-7xXj/view", icon: "🎬" },
        { title: "South Park full series", year: 2024, url: "https://drive.google.com/drive/folders/1PzKaoaK4blzlaoxnwC20gZoeYE5mDxWL", icon: "🎿" },
        { title: "A Minecraft movie 2025 720p HD CAMADS.mp4", year: 2025, url: "https://drive.google.com/file/d/1bAf71el9hSRwObQF-P79tuE2tLDK67EL/view", icon: "🎬" },
        { title: "Bee Movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1AiuhAubyrKVmqpu3OfM1sonhRJrzw5v6/view", icon: "🎬" },
        { title: "A.Charlie.Brown.Christmas.1965.720p.WEBRip.x264-[YTS.AM].mp4", year: 1965, url: "https://drive.google.com/file/d/1e2UIrJdsz_0k5tp2v0EnPZiPv2ZQSTzg/view", icon: "🎄" },
        { title: "Barbie.2023.720p.iT.HC.WEBRip.800MB.x264-GalaxyRG.mkv", year: 2023, url: "https://drive.google.com/file/d/1K88LvZ6q9KRwsdiVQ72Wrh5DQqWVLkd3/view", icon: "🎬" },
        { title: "Chipwrecked.mp4", year: 2024, url: "https://drive.google.com/file/d/1LTKy48IbusfXsl5nSNDTd0M3A8B3aPke/view", icon: "🎬" },
        { title: "Squeakuel.mp4", year: 2024, url: "https://drive.google.com/file/d/1em55qHTtdrWD4Dox9CXs9r1042TLu_cu/view", icon: "🎬" },
        { title: "Despicable.Me.2010.720p.BluRay.x264.YIFY.mp4", year: 2010, url: "https://drive.google.com/file/d/1upRWBqPKcQjviBjAgYkzkWZuVjQ1SAWF/view", icon: "🎬" },
        { title: "Despicable.Me.2.2013.720p.BluRay.x264.YIFY.mp4", year: 2013, url: "https://drive.google.com/file/d/1qWNcu7uPAUqh0SaBlL4rEhcH1QaKIfgf/view", icon: "🎬" },
        { title: "Despicable.Me.3.2017.720p.BluRay.x264.VPPV.mkv", year: 2017, url: "https://drive.google.com/file/d/1mT5BU-DLMI0kDVjEIk7kBNL55ETuNyGN/view", icon: "🎬" },
        { title: "Despicable.Me.4.2024.720p.WEBRip.x264.AAC-[YTS.MX].mp4", year: 2024, url: "https://drive.google.com/file/d/1ggXkdigLOzQQgelB8exwzjVFb8bbef7d/view", icon: "🎬" },
        { title: "Oppenheimer full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1GLqywDPqfZSLmLAiKC8j2l0o52cAGP8S/view", icon: "🎬" },
        { title: "Cocaine Bear 2023 360p.ts", year: 2023, url: "https://drive.google.com/file/d/1vrClp3nIYkdIBRPzZDxxq7ICIOWHioAh/view", icon: "🎬" },
        { title: "Kpop demon hunters 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1RVjF4Uxxwpg2ZeCxP_05geypDcL6AHb-/view", icon: "🎬" },
        { title: "Family Guy Season 1-23 Complete!-peterGrffin", year: 2024, url: "https://drive.google.com/drive/folders/11W6C-Jqv9iQVasqjfiaYz77puax1UTjH", icon: "👨‍👩‍👧‍👦" },
        { title: "Iron Man 2008 360p.ts", year: 2008, url: "https://drive.google.com/file/d/1hXLafjnc_ersgtAKJeU8QX4siWEtDmv9/view", icon: "🎬" },
        { title: "Iron Man 2 2010 360p.ts", year: 2010, url: "https://drive.google.com/file/d/1u1glpdPyZvJ1MAgTrxAnTrS8Wvys3Bdt/view", icon: "🎬" },
        { title: "Iron Man 3 2013 360p.mp4", year: 2013, url: "https://drive.google.com/file/d/1I3cDTsDBihDYId6KuKS6ighOcJ5g6oyC/view", icon: "🎬" },
        { title: "Zootopia 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1HYeIrbf8A-vfvJsvYP59AQzG9l8nt03h/view", icon: "🎬" },
        { title: "Zootopia.2.2025.1080p.By Delta.mp4", year: 2025, url: "https://drive.google.com/file/d/1Wh1xBiKMiUf4CkY7vfNc71lGWb_VQz3M/view?usp%3Dsharing", icon: "🎬" },
        { title: "Moana 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1EsX8k7nfYQrzC6apqJqnyfH7HLAHl31G/view", icon: "❄️" },
        { title: "The Lorax 2017 720p HD.mp4", year: 2017, url: "https://drive.google.com/file/d/1Kl4ieKALPoEYbllsRy7V8AYiPtJATg7W/view", icon: "🎬" },
        { title: "Willy.Wonka.&.the.Chocolate.Factory.1971.Blu-ray.720p.x264.YIFY.mp4", year: 1971, url: "https://drive.google.com/file/d/1oeD_wjeRQck_3uRIOw9ZXIxG5PuUIPVD/view", icon: "🎬" },
        { title: "Joker 2019 360p.mp4", year: 2019, url: "https://drive.google.com/file/d/1__wCd7uV9s7qY-o7qZ6F1lO9UQPV7B90/view", icon: "🎬" },
        { title: "Spider-Man- Far from Home 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1YFUpSLmxb6xIlbdJXScIkRYvwYxvJ_18/view", icon: "🕷️" },
        { title: "Back to the Future.mp4", year: 2024, url: "https://drive.google.com/file/d/1ZwP0FLdFdAoeskqGvQYX5CwqEeSFWS1G/view", icon: "🎬" },
        { title: "Five Nights at Freddys Movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1U9iKneXKo4ViYy4bFQIvE_yY6V7RlLVK/view?usp%3Dsharing", icon: "🎬" },
        { title: "South Park full series", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1PzKaoaK4blzlaoxnwC20gZoeYE5mDxWL", icon: "🎿" },
        { title: "Spider-Man- Across the Spider-Verse full movie", year: 2024, url: "https://drive.google.com/file/d/1dSeZ1c4_p8T_lW7z0qpKsebKYN-R3zHR/view", icon: "🕷️" },
        { title: "Deadpool & Wolverine 720p HD 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1aBzsoTJAjhZeFFDkIV2SN7p7ZHagUEDc/view?t%3D375", icon: "🎬" },
        { title: "Sonic the Hedgehog full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1HaXeNylNfZXhRudGTNLUWtrN-oAmone4/view", icon: "🎬" },
        { title: "Space Jam A New Legacy.mp4", year: 2024, url: "https://drive.google.com/file/d/1v2xqKQcAvndfcqsctZH73NR2AjFXsrUr/view", icon: "🎬" },
        { title: "Spider-Man- Far from Home 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1YFUpSLmxb6xIlbdJXScIkRYvwYxvJ_18/view", icon: "🕷️" },
        { title: "spidermanhomecoming.mp4", year: 2024, url: "https://drive.google.com/file/d/1I9PYrrRLo1m_5Wtfq59L6gHGa3NaUXDv/view", icon: "🕷️" },
        { title: "The Super Mario Bros. Movie full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1OsyF2LKJqjtv0b2Xd9GWOLcYkzny3VZo/view?t%3D4", icon: "🎬" },
        { title: "Terrifier 2 2022 720p HD.mp4", year: 2022, url: "https://drive.google.com/file/d/1_Jjo7rOcCkYt3UryVkV2XvTfrL4QvHTE/view", icon: "😱" },
        { title: "Home alone 2 lost in New York.mp4", year: 2024, url: "https://drive.google.com/file/d/1Aj4Ys3ofogKhxEAMh6PUncpYF_OHZ_ZK/view", icon: "🎬" },
        { title: "The Lorax full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1Kl4ieKALPoEYbllsRy7V8AYiPtJATg7W/view", icon: "🎬" },
        { title: "Home Alone full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/18YKNCTokG3B7ZWzCE3thunyDJMktLxnm/view", icon: "🎬" },
        { title: "The Underdoggs 2024 HD.mp4", year: 2024, url: "https://drive.google.com/file/d/18qSFllMJr4gLotZx7-XIhMxLXlU2l1UD/view?t%3D1", icon: "🎬" },
        { title: "Five Nights at Freddy\'s full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1OyO1OdhtfwR883Uvi0QPP5iooGcxTVSY/view", icon: "🎬" },
        { title: "Scream VI.mp4", year: 2024, url: "https://drive.google.com/file/d/1kph0MTxbIHWar5DVkqmrZWiy5LuF9--A/view?t%3D3838", icon: "😱" },
        { title: "The Goonies Full Moive DVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/18sSKADZamG3w8ZaanP93XU4yHSVKzApM/view?t%3D4221", icon: "🎬" },
        { title: "Deadpool 2016 720p HD.ts", year: 2016, url: "https://drive.google.com/file/d/17QTeEVPc-E4YsWm-tQ4toG-DpLefpx4E/view?t%3D19", icon: "🎬" },
        { title: "Despicable Me 4 2024 HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1siki1wYP3LpfjFpUT8Z9lJuJzl7MdBhX/view?t%3D3", icon: "🎬" },
        { title: "Cult of Chucky full movie", year: 2024, url: "https://drive.google.com/file/d/1qPipvrYaINji65Pr6U9Wb8eLXR1PcggX/view?t%3D1", icon: "🎬" },
        { title: "saw x full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/10Wn3otVUN00Sfc6sRZSnDFfaYDJ5VTNR/view?t%3D3039", icon: "🎬" },
        { title: "Transformers- Rise of the Beasts full movie", year: 2024, url: "https://drive.google.com/file/d/1epYCAJMFrmUBlId2wWFI0lcC1UvbX-Ez/view", icon: "🎬" },
        { title: "Spider-Man- No Way Home.theatrical 2021 DVDRIPPED.mp4", year: 2021, url: "https://drive.google.com/file/d/1oddQM8w-8UqQIvB-fPpy1h-7xvAbklmA/view", icon: "🕷️" },
        { title: "Avengers- Infinity War 2018 1080p HD.mkv", year: 2018, url: "https://drive.google.com/file/d/1zpl7Dngm7ESW_yLZvcQMm9AhmR1izyus/view?t%3D2204", icon: "🎬" },
        { title: "StarWarsEpIVnewhope.mp4", year: 2024, url: "https://drive.google.com/file/d/1aiJD6uDyAq9fQN2prN50djHHxmjTwQOC/view", icon: "🎬" },
        { title: "Halloween Kills 2021 360p.ts", year: 2021, url: "https://drive.google.com/file/d/1CdhzdqiTQvWMCvmLE_zFLuc2jHvTMqq8/view?t%3D3", icon: "😱" },
        { title: "Halloween Ends 2022 720p HD.ts", year: 2022, url: "https://drive.google.com/file/d/1Lsjj8VceEJMM4mvav7WOwhAH1X56-woA/view", icon: "😱" },
        { title: "Zootopia 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1HYeIrbf8A-vfvJsvYP59AQzG9l8nt03h/view?t%3D2631", icon: "🎬" },
        { title: "Terrifier full movie", year: 2024, url: "https://drive.google.com/file/d/1_pQ3kbz_a8l3B7SKfdP9dYQwKax0WHUD/view", icon: "😱" },
        { title: "Freddy vs. Jason 2003 360p.mp4", year: 2003, url: "https://drive.google.com/file/d/1njTri-d6eamwa3AFwuVD9nORZ7K6-D-N/view", icon: "🎬" },
        { title: "IT 2017 720p full movie", year: 2017, url: "https://drive.google.com/file/d/1BhQDbp8lXDwS-Q-pq4axufeZI-5TklpR/view", icon: "🎬" },
        { title: "Joker 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1__wCd7uV9s7qY-o7qZ6F1lO9UQPV7B90/view", icon: "🎬" },
        { title: "The Garfield Movie 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1W0OfyIS_7f0DKjC6x1bVLI4WBFabZXis/view", icon: "🎬" },
        { title: "Inside Out 2 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1SABVZNMwHTME4hsFwL9IWyWZPKDTBSoT/view?t%3D2499", icon: "🎬" },
        { title: "It Chapter Two 720p 2019.mp4", year: 2019, url: "https://drive.google.com/file/d/1vLFTFzlvu9TJXbcL40gnag9Xart3pKQI/view", icon: "🎬" },
        { title: "Transformers- Dark of the Moon 2011 360p.ts", year: 2011, url: "https://drive.google.com/file/d/1P3AU9onyXEKK03hRH63SKPoHbjPwMOFB/view", icon: "🎬" },
        { title: "Salem\'s Lot 2024 HD.ts", year: 2024, url: "https://drive.google.com/file/d/1PzQJ5iQOKas1DnXPUFsDsHbjEhR_bu1z/view", icon: "🎬" },
        { title: "Kingdom of the Planet of the Apes 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1dZ30bamkNV7OP9bJRF9bscboD9aRYaPY/view", icon: "🎬" },
        { title: "Jurassic World Dominion full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1x84uwAQzm7-j9MhDdNF5sb_jCRQFhjIa/view", icon: "🎬" },
        { title: "Ghostbusters- Frozen Empire full movie.ts", year: 2024, url: "https://drive.google.com/file/d/115NMznT9rm8LGZzRzE0OvgqCbP-_y-Ia/view", icon: "❄️" },
        { title: "Beetlejuice Beetlejuice CAM HD 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1WnfCHnjlcN7joibU1e0RieYJNFBPgXRn/view", icon: "🎬" },
        { title: "Brightburn 2019 360p.ts", year: 2019, url: "https://drive.google.com/file/d/1j1cYjjEDqV8VcTJ3oSwaOeMHPglVd-um/view?t%3D18", icon: "🎬" },
        { title: "Teenage Mutant Ninja Turtles- Mutant Mayhem 2023 720p.mp4", year: 2023, url: "https://drive.google.com/file/d/1emX4CShNejqhStNK-b0xDVBBMA0t2gcE/view", icon: "🎬" },
        { title: "Pet Sematary- Bloodlines full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/122OjLQhI6uIS_qThRkLgUcgJh-U7PxBE/view", icon: "🎬" },
        { title: "The Nun II 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1CPZj45zQd1Ih-G0I7Ifo8dACj-4jbOJa/view?t%3D7", icon: "🎬" },
        { title: "Shrek full movie full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1ohXNP73ZyD2VISZZ0aV_rL2MSWskf9NX/view", icon: "🎬" },
        { title: "Shrek 2 full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1xtr5zFmpt6iD89Tn8VthzEiBij89J9pZ/view", icon: "🎬" },
        { title: "Scream 3 2000.ts", year: 2000, url: "https://drive.google.com/file/d/1IzaFo-PmeI3AiQ_qoDdjCbUdiu8Ohs-w/view", icon: "😱" },
        { title: "Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/14BaJhmDRr3veoH436CKdPDp9r-j5214I/view", icon: "🕷️" },
        { title: "Spider-Man 2 2004.ts", year: 2004, url: "https://drive.google.com/file/d/1BJTsBEOeTbpv3fqU0ejzb44aQGrdLhyN/view", icon: "🕷️" },
        { title: "Spider-Man 3 2007.ts", year: 2007, url: "https://drive.google.com/file/d/1vi0w7U65XeR-u00AQ8uS9s3C-IoiV-_1/view", icon: "🕷️" },
        { title: "SpongeBob Movie- Sponge on the Run full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1RCiXmbRfWyMQnJLa5vNTvSiIxZFG1mq5/view?t%3D5", icon: "🎬" },
        { title: "The Wolverine (2013) BluRay 720p.mp4", year: 2013, url: "https://drive.google.com/file/d/0BzeqnwcztH5cRERqUGl6TFkyc3M/view?resourcekey%3D0--S8rnshNZ6cP5uYrkFu3WA", icon: "🎬" },
        { title: "Terrifier 3 2024 HD.mkv", year: 2024, url: "https://drive.google.com/file/d/1sAj4FqfEIzHPIW7ZUPGGSOFTTaJr5AGI/view", icon: "😱" },
        { title: "Annabelle 2014 DVDRIPPED.mp4", year: 2014, url: "https://drive.google.com/file/d/12sQn1gxallBigyxC2aDFUWsKqX_g-e-7/view", icon: "🎬" },
        { title: "Cars 2006 360p.ts", year: 2006, url: "https://drive.google.com/file/d/106N7zd611ShtPMOx97XwFSxkg8theQLN/view", icon: "🎬" },
        { title: "Toy Story 1995 720p.ts", year: 1995, url: "https://drive.google.com/file/d/1fW6Ov5NIaRh4h78-qBpWeln_Vs9oEXOQ/view?t%3D1", icon: "🎬" },
        { title: "Toy Story 2 1999.mp4", year: 1999, url: "https://drive.google.com/file/d/1k3RVDc_Vah1H9lFsXQZJ6mE3KqdDcK_T/view", icon: "🎬" },
        { title: "Leatherface- The Texas Chainsaw Massacre III 1990.ts", year: 1990, url: "https://drive.google.com/file/d/1l1v62IhzGxBVZ8h4u8-8z3qyQ0LMHLDs/view", icon: "🎬" },
        { title: "The First Purge 2018 720p HD.ts", year: 2018, url: "https://drive.google.com/file/d/1Br63apD1pglhHIvSR2zLJ5p27nAxVG0Z/view?t%3D1", icon: "🎬" },
        { title: "Elf.mp4", year: 2024, url: "https://drive.google.com/file/d/1aus7IcL_iSNmvkKohgiZCjNoCmztRehu/view", icon: "🎄" },
        { title: "Texas Chainsaw Massacre 720p 2022.ts", year: 2022, url: "https://drive.google.com/file/d/1DX2PS1WKMKTBCcdwxzbjapo7He1OHTFb/view", icon: "🎬" },
        { title: "Deadpool 2 2018 720p HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1tF1C-2tktolFSAJaLG0C2sE_2sGyH3YI/view?t%3D1", icon: "🎬" },
        { title: "Star Wars- Episode II - Attack of the Clones 2002 360p.ts", year: 2002, url: "https://drive.google.com/file/d/1u0ZRN7s8rgAMYtvnGf3zTjpM7Fu6TmW_/view", icon: "🎬" },
        { title: "Star Wars- Episode III - Revenge of the Sith 2005 360p.ts", year: 2005, url: "https://drive.google.com/file/d/1lEszWnr2BinTfzBGqtoDV1W9wMIlTQtb/view", icon: "🎬" },
        { title: "Iron Man 3 2013.ts", year: 2013, url: "https://drive.google.com/file/d/1I3cDTsDBihDYId6KuKS6ighOcJ5g6oyC/view", icon: "🎬" },
        { title: "Baghead 2023 720p HD.ts", year: 2023, url: "https://drive.google.com/file/d/17Tfb1RDtFZ8fJGIKi0qWrQxnaP-mG97A/view", icon: "🎬" },
        { title: "Saw- The Final Chapter 2010.ts", year: 2010, url: "https://drive.google.com/file/d/1zXFh6WfdjGFEVgMNrIbsvAfO6j6yLw-W/view", icon: "🎬" },
        { title: "Venom- Let There Be Carnage 2021 720p HD.mkv", year: 2021, url: "https://drive.google.com/file/d/1bcJ4X5WvyimpbB8U15Mb1j-kzct-nFIZ/view", icon: "🎬" },
        { title: "Venom 2018 HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1XoN0B1rsNKDDRphmI8bM606r4wRQ6JUH/view", icon: "🎬" },
        { title: "Doctor Strange 2018 720p HD.mkv", year: 2018, url: "https://drive.google.com/file/d/11PAFLA_D94t0ZbSqcy-ggyl2DU7g0Ay2/view", icon: "🎬" },
        { title: "2012 (2009) [1080p] {5.1}.mp4", year: 2012, url: "https://drive.google.com/file/d/0B69h6W6sv5LIRGZhb0NUTF9pMVk/view?resourcekey%3D0-W0j9qqJACbM16iPs_zKHww", icon: "🎬" },
        { title: "A Dog\'s Purpose (2017) [Full Unblocked Movies 24].m4v", year: 2017, url: "https://drive.google.com/file/d/0B-uFeCO4yCFISTFmNlE3akNDbU0/view?t%3D1%26resourcekey%3D0-RNIEk2RiGAR76Qv_ACNU8g", icon: "🎬" },
        { title: "Dodgeball.avi", year: 2024, url: "https://drive.google.com/file/d/0B8oerU1d9p_ta2lHekdKeDQxekE/view?resourcekey%3D0-fu98BCeLfAdWKtFRewzNig", icon: "🎬" },
        { title: "Forrest Gump (1994) [Full Unblocked Movies 24].m4v", year: 1994, url: "https://drive.google.com/file/d/0B-uFeCO4yCFIa3hNRDc5eVlBSjQ/view?t%3D6%26resourcekey%3D0-rOslYKb17fIDWtuiy8P2ag", icon: "🎬" },
        { title: "Gulliver\'s.Travels.2010.BluRay.720p.DTS.x264-CHD.mkv", year: 2010, url: "https://drive.google.com/file/d/0B6lIkxTshK4KTTh0RDlsSzN3Z0U/view?resourcekey%3D0-XfjX5Cc6t5WQVrVGr2Rrrg", icon: "🎬" },
        { title: "King Kong (2005) - HD.mp4", year: 2005, url: "https://drive.google.com/file/d/0By5b6VRVheoWUmNTcEJiOXdJdjQ/view?resourcekey%3D0-S6FZYivo19MI9Z4h-ZRrOw", icon: "🎬" },
        { title: "kung fu panda.mp4", year: 2024, url: "https://drive.google.com/file/d/0B5QJgBuViQvxMExwdFd4LXp1cjQ/view?resourcekey%3D0--AymX6yocYDSRtZ5jQFm1g", icon: "🎬" },
        { title: "Passengers.2016.720p.HC.HDRip.X264.mkv.mp4", year: 2016, url: "https://drive.google.com/file/d/0BzXAXZUeO4UPc2YxOGlYX3NCdms/view?resourcekey%3D0-ik09RV3OF595hMk2yQeNvA", icon: "🎬" },
        { title: "pitch perfect.flv", year: 2024, url: "https://drive.google.com/file/d/0B_CAII75-qyKRHF6QjhFUXlPUEk/view?resourcekey%3D0-4he88shdafZGGNVAkyVrxg", icon: "🎬" },
        { title: "Rocky 1.mp4", year: 2024, url: "https://drive.google.com/file/d/0B7Z9hjzLxrtXZDBEZ29wOG90MGs/view?resourcekey%3D0-gY-cJTrxfMxIDBbPX33HyA", icon: "🎬" },
        { title: "The Angry Birds Movie 2016.mp4", year: 2016, url: "https://drive.google.com/file/d/0B4hN7fniyzpwalFxaEl3Tm5nLVU/view?resourcekey%3D0-ANoY0MoL3TgANh4nqeyZtQ", icon: "🎬" },
        { title: "The Wolverine (2013) BluRay 720p.mp4", year: 2013, url: "https://drive.google.com/file/d/0BzeqnwcztH5cRERqUGl6TFkyc3M/view?resourcekey%3D0--S8rnshNZ6cP5uYrkFu3WA", icon: "🎬" },
        { title: "Trolls.2016.720p.BluRay (1).mp4", year: 2016, url: "https://drive.google.com/file/d/0B3Oy5ahf02mFZU1KMG0xM0FYQXM/view?resourcekey%3D0-Mq9TLnk81W8W37eLt6Qelw", icon: "🎬" },
        { title: "Watch Kill Zone 2 2015 Free Full​.mp4", year: 2015, url: "https://drive.google.com/file/d/0B1vIGLoz_v3ndkFxT3NuR1REZTg/view?resourcekey%3D0--rOOhqAKVqB-6mHMQNa6-Q", icon: "🎬" },
        { title: "Why.him.2016.720p.web-dl.mkv", year: 2016, url: "https://drive.google.com/file/d/0B-J9Gkw1iO85Nkd3Q2RsUUJJdzg/view?resourcekey%3D0-v1Dp_otfjjY-lhP5vnuSAg", icon: "🎬" },
        { title: "X-Men- Apocalypse - HD.mp4", year: 2024, url: "https://drive.google.com/file/d/0B-J9Gkw1iO85XzhPMEN5LUVJakk/view?resourcekey%3D0-CM_D9L5sDkTcPNzyuXItiw", icon: "🎬" },
        { title: "Grown Ups 2 (2013) Full Movie.mp4", year: 2013, url: "https://drive.google.com/file/d/1igY-5wivsgwpd3tKUNZ_wcAmAbPpwMcz/view?usp%3Dsharing", icon: "🎬" },
        { title: "Godzilla x Kong The New Empire (2024) (Awafim.tv).mkv", year: 2024, url: "https://drive.google.com/file/d/1h5vNxBZhabSuZdPvbGcFQN1x-xfURsfO/view?usp%3Dsharing", icon: "🎬" },
        { title: "Halloween 2018 720p HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1DDDguEoUyXUIPUmNoodW1X0iftIKdZgv/view", icon: "😱" },
        { title: "Halloween II 1981 720p.mp4", year: 1981, url: "https://drive.google.com/file/d/1j9iwPUFdMSsu0hDSCUEwP7Gz17xuf-lS/view", icon: "😱" },
        { title: "The Nun 2018 720p HD.ts", year: 2018, url: "https://drive.google.com/file/d/1XiM8ECdnhTl6uCEIW8s4MMlQFBs4x-j-/view", icon: "🎬" },
        { title: "Friday the 13th full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1pf3faVonicfbhSDfIviaEWsvKquERczR/view", icon: "🎬" },
        { title: "A Nightmare on Elm Street 1 1984.mp4", year: 1984, url: "https://drive.google.com/file/d/1Tsmb_pRgleOTXo6bAltJ6VDWDmf25Jwa/view", icon: "🎬" },
        { title: "A Nightmare on Elm Street 2# Freddy\'s Revenge (1985) # Full Movie.mp4", year: 1985, url: "https://drive.google.com/file/d/17HLx_cEKFN_CwSGSoCjX27bB-Ynz8xRq/view", icon: "🎬" },
        { title: "Freddy\'s Dead- The Final Nightmare 1991.ts", year: 1991, url: "https://drive.google.com/file/d/1I8o1GaH9-0qMZYuHPj_yGMUw-zTdQS0n/view", icon: "🎬" },
        { title: "Freddy vs. Jason 2003 360p.mp4", year: 2003, url: "https://drive.google.com/file/d/1njTri-d6eamwa3AFwuVD9nORZ7K6-D-N/view", icon: "🎬" },
        { title: "Halloween 1978 720p HD.ts", year: 1978, url: "https://drive.google.com/file/d/1dd4z_ykIghvDgVE0YX7v4RK1zfMxH52r/view", icon: "😱" },
        { title: "Halloween 2007 360p.ts", year: 2007, url: "https://drive.google.com/file/d/1oy9kIOC9bY3U217MWxlac9EDLQmcpFBh/view", icon: "😱" },
        { title: "Child\'s Play 2 DVDRIPPED.mp4", year: 2024, url: "https://drive.google.com/file/d/1IOoeJUBb83Vai480J3iuZsoQSuBC_mnQ/view", icon: "🎬" },
        { title: "The Purge 2013 720p HD.mp4", year: 2013, url: "https://drive.google.com/file/d/1PFz-u8_kVFY8Z--NyloACB1DUwiT0oK4/view", icon: "🎬" },
        { title: "Smile 2 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1PeOUtsdJfWRqJvGwBhRmeBc2fLiQyTJY/view", icon: "🎬" },
        { title: "Paranormal Activity 2009 720p HD.mp4", year: 2009, url: "https://drive.google.com/file/d/1zfEW0gCWjqGslS6TN59edtaiy2JUX929/view", icon: "🎬" },
        { title: "Paranormal Activity 2 2010 720p HD.mp4", year: 2010, url: "https://drive.google.com/file/d/1PCy4KRox73lWIwITH7iQPKP-Wr3bdEGB/view", icon: "🎬" },
        { title: "ghostbustersDVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1OY7HZkep77B12l4wRYCN_D23gR9M2G9m/view", icon: "🎬" },
        { title: "", year: 2024, url: "https://drive.google.com/file/d/1VPN-P5xWjbEHv-VtlzjryjyV-nx7Z_w_/view", icon: "🎬" },
        { title: "Ghostbusters II2.theatricalDVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1VPN-P5xWjbEHv-VtlzjryjyV-nx7Z_w_/view", icon: "🎬" },
        { title: "The Conjuring 2 2016 720p HD.mp4", year: 2016, url: "https://drive.google.com/file/d/1zECVNreFAl8LNGcOrlPqtMzw_Su1S3AC/view", icon: "🎬" },
        { title: "Scooby-Doo! And Krypto, Too! full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1A3KkhmxtAok0WhO2iaSR4GPwOWBs_T6w/view", icon: "🎬" },
        { title: "Wicked 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1EiT5_VDJyMbrG5ezazVyzzOu1nWAkmE8/view", icon: "🎬" },
        { title: "Venom- The Last Dance 2024 CAM 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1C6aUcmJeLpm8ysdYwnt7HRZFAT6k0oQs/view", icon: "🎬" },
        { title: "Dog Man 2025 720p HD CAM.mp4", year: 2025, url: "https://drive.google.com/file/d/1aXHiOSQjs7rCj933p22WnVSHOsVnv7IB/view", icon: "🎬" },
        { title: "Sonic the Hedgehog 3 2024 1080p Camd.mkv", year: 2024, url: "https://drive.google.com/file/d/13pgT7HSDRXYeXvkU0RAEqbdrHrFxPiIm/preview", icon: "🎬" },
        { title: "The Wild Robot 2024 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1_N9iHDAM3RbU2a0GTfgcNXDGuZDT_yZ-/view", icon: "🎬" },
        { title: "Apocalypse Z- The Beginning of the End 2024 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1GusERaoP4GxoQuoxPtcNHAPyT816FwOD/view", icon: "🎬" },
        { title: "Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/14BaJhmDRr3veoH436CKdPDp9r-j5214I/view", icon: "🕷️" },
        { title: "The Amazing Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1jom1D1Dc3eF3ZmCXVzh8lhlXrFGOBpXK/view", icon: "🕷️" },
        { title: "Sonic the Hedgehog 1 2020 1080p HD.mp4", year: 2020, url: "https://drive.google.com/file/d/1HaXeNylNfZXhRudGTNLUWtrN-oAmone4/view", icon: "🎬" },
        { title: "Interstellar 2014 1080p HD.mkv", year: 2014, url: "https://drive.google.com/file/d/1rjx6-12dB11LWwj5jFEFX2QMuZiEVUFk/view?t%3D5", icon: "🎬" },
        { title: "Red One 2024 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1QQx9ogqUJzS3G8GIZXLBAhgx2s2Ol2zZ/view", icon: "🎬" },
        { title: "Minions 2015 720p HD.avi", year: 2015, url: "https://drive.google.com/file/d/1Ly6kH4RMc1kHLQJ1sdejKZHeA58oaKOZ/view", icon: "🎬" },
        { title: "Annie 2014 360p.ts", year: 2014, url: "https://drive.google.com/file/d/1mHYQrlCCmOUjKJTWaSMeQWJTVmND80Z3/view", icon: "🎬" },
        { title: "My Hero Academia Series +Movies (Netflix Ripped)", year: 2024, url: "https://drive.google.com/drive/folders/1UTVnF3QEgQSaj5ZkOU8UiGlG2nJGPVXN", icon: "🎬" },
        { title: "Squid Games Full Series netflix ripped", year: 2024, url: "https://drive.google.com/drive/folders/1Zs2H3Nxl-yQHm21RJNbh2bIAesJ5ouY9", icon: "🎬" },
        { title: "Pokémon series", year: 2024, url: "https://drive.google.com/drive/folders/1I7-ZUInlg9jb4R6LGq0qX3n7bjGKPFFO", icon: "🎬" },
        { title: "Family Guy Season 1-23 Complete!-peterGrffin", year: 2024, url: "https://drive.google.com/drive/folders/11W6C-Jqv9iQVasqjfiaYz77puax1UTjH", icon: "👨‍👩‍👧‍👦" },
        { title: "Sonic X full series DVD Ripped", year: 2024, url: "https://drive.google.com/drive/u/0/folders/1rM_wiU6k3TbIDvrp3kt72-4BFWO4GC7G", icon: "🎬" },
        { title: "Moana 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1EsX8k7nfYQrzC6apqJqnyfH7HLAHl31G/view", icon: "❄️" },
        { title: "The Three Caballeros 1944 360p.ts", year: 1944, url: "https://drive.google.com/file/d/12HuPI63H5GYROrTucCyldzJBdmm9S5mc/view", icon: "🎬" },
        { title: "Toy Story 1995 720p.ts", year: 1995, url: "https://drive.google.com/file/d/1fW6Ov5NIaRh4h78-qBpWeln_Vs9oEXOQ/view", icon: "🎬" },
        { title: "Toy Story 2 1999.mp4", year: 1999, url: "https://drive.google.com/file/d/1k3RVDc_Vah1H9lFsXQZJ6mE3KqdDcK_T/view", icon: "🎬" },
        { title: "Toy Story 3.mp4", year: 2024, url: "https://drive.google.com/file/d/13msxxmyEco7CRBkO_Ju1SMx5KK4r4Su8/view", icon: "🎬" },
        { title: "Pinocchio 1940 360p.ts", year: 1940, url: "https://drive.google.com/file/d/1psiZOj26mD6DZzCn0CmK2jncoLvuOg3g/view", icon: "🎬" },
        { title: "Cars 2006 360p.ts", year: 2006, url: "https://drive.google.com/file/d/106N7zd611ShtPMOx97XwFSxkg8theQLN/view", icon: "🎬" },
        { title: "The Jungle Book 1967 1080p HD.mkv", year: 1967, url: "https://drive.google.com/file/d/1-FXYaGyNS9PDT1b2loTUnLFx9Rp3O2qk/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Lady and the Tramp 1955 360p.ts", year: 1955, url: "https://drive.google.com/file/d/1G717YCDsn8d9alLW2bwJDHSZfTCPi-sF/view", icon: "🎬" },
        { title: "Inside Out 2015 360p.ts", year: 2015, url: "https://drive.google.com/file/d/1e0OdhlzTKWie6TDXNDOKjKYXbfYfmz6t/view", icon: "🎬" },
        { title: "Inside Out 2 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1SABVZNMwHTME4hsFwL9IWyWZPKDTBSoT/view", icon: "🎬" },
        { title: "Finding Nemo.mp4", year: 2024, url: "https://drive.google.com/file/d/11CN0fT7CwCHgz__mY4FWjcoT5w_wZD9S/view", icon: "🎬" },
        { title: "Avatar.mp4", year: 2024, url: "https://drive.google.com/file/d/16tKuEYtxi7EeKtX3yZZR-nXgZ_oGTxXS/view", icon: "🎬" },
        { title: "The Mask 1994 720p HD.mp4", year: 1994, url: "https://drive.google.com/file/d/1ExVaSRcps4wvIcRczczvBPSGYxUkfvXE/view", icon: "🎬" },
        { title: "Spy X Family Season 1", year: 2024, url: "https://drive.google.com/drive/folders/16wy42AB2KsdqcfVCNKadDg8JPNtTFmur?usp%3Ddrive_link", icon: "🎬" },
        { title: "gravity Falls Full Series", year: 2024, url: "https://drive.google.com/drive/folders/1Q6s6AB7BAOndbFy4xcnuX4FjO8uHnqaZ", icon: "🎬" },
        { title: "One Piece EP 1 - EP5", year: 2024, url: "https://drive.google.com/drive/folders/1lgDdn58H8BoRI0kzGo910YF1Fm2QSu_p", icon: "🎬" },
        { title: "Jujutsu Kaisen seasons 1-2 netflix ripped", year: 2024, url: "https://drive.google.com/drive/folders/1eqNcKK02wEdRV7RnfrmDRZf2s2QZHUyj", icon: "🎬" },
        { title: "season 1", year: 2024, url: "https://drive.google.com/drive/folders/1ZGPUs3433E9KdIAjRnOH3gfEXaq1rmcw", icon: "🎬" },
        { title: "Knuckles Series", year: 2024, url: "https://drive.google.com/drive/folders/1P08W5o2K-hyR7w5F11mWo9ltAw3ZLbkA", icon: "🎬" },
        { title: "Regular Show Episodes +Movie", year: 2024, url: "https://drive.google.com/drive/folders/1tedaT2-lJvdIToqgsBx7lDo4tJl3TY-U?usp%3Ddrive_link", icon: "🎬" },
        { title: "Poltergeist 1982.mp4", year: 1982, url: "https://drive.google.com/file/d/1ycfMX3q8QUTs9G_ua74tz_PHHVa-7xXj/view", icon: "🎬" },
        { title: "South Park full series", year: 2024, url: "https://drive.google.com/drive/folders/1PzKaoaK4blzlaoxnwC20gZoeYE5mDxWL", icon: "🎿" },
        { title: "A Minecraft movie 2025 720p HD CAMADS.mp4", year: 2025, url: "https://drive.google.com/file/d/1bAf71el9hSRwObQF-P79tuE2tLDK67EL/view", icon: "🎬" },
        { title: "Bee Movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1AiuhAubyrKVmqpu3OfM1sonhRJrzw5v6/view", icon: "🎬" },
        { title: "A.Charlie.Brown.Christmas.1965.720p.WEBRip.x264-[YTS.AM].mp4", year: 1965, url: "https://drive.google.com/file/d/1e2UIrJdsz_0k5tp2v0EnPZiPv2ZQSTzg/view", icon: "🎄" },
        { title: "Barbie.2023.720p.iT.HC.WEBRip.800MB.x264-GalaxyRG.mkv", year: 2023, url: "https://drive.google.com/file/d/1K88LvZ6q9KRwsdiVQ72Wrh5DQqWVLkd3/view", icon: "🎬" },
        { title: "Chipwrecked.mp4", year: 2024, url: "https://drive.google.com/file/d/1LTKy48IbusfXsl5nSNDTd0M3A8B3aPke/view", icon: "🎬" },
        { title: "Squeakuel.mp4", year: 2024, url: "https://drive.google.com/file/d/1em55qHTtdrWD4Dox9CXs9r1042TLu_cu/view", icon: "🎬" },
        { title: "Despicable.Me.2010.720p.BluRay.x264.YIFY.mp4", year: 2010, url: "https://drive.google.com/file/d/1upRWBqPKcQjviBjAgYkzkWZuVjQ1SAWF/view", icon: "🎬" },
        { title: "Despicable.Me.2.2013.720p.BluRay.x264.YIFY.mp4", year: 2013, url: "https://drive.google.com/file/d/1qWNcu7uPAUqh0SaBlL4rEhcH1QaKIfgf/view", icon: "🎬" },
        { title: "Despicable.Me.3.2017.720p.BluRay.x264.VPPV.mkv", year: 2017, url: "https://drive.google.com/file/d/1mT5BU-DLMI0kDVjEIk7kBNL55ETuNyGN/view", icon: "🎬" },
        { title: "Despicable.Me.4.2024.720p.WEBRip.x264.AAC-[YTS.MX].mp4", year: 2024, url: "https://drive.google.com/file/d/1ggXkdigLOzQQgelB8exwzjVFb8bbef7d/view", icon: "🎬" },
        { title: "Oppenheimer full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1GLqywDPqfZSLmLAiKC8j2l0o52cAGP8S/view", icon: "🎬" },
        { title: "Kpop demon hunters 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1RVjF4Uxxwpg2ZeCxP_05geypDcL6AHb-/view", icon: "🎬" },
        { title: "Squeakuel.mp4", year: 2024, url: "https://drive.google.com/file/d/1em55qHTtdrWD4Dox9CXs9r1042TLu_cu/view", icon: "🎬" },
        { title: "Chipwrecked.mp4", year: 2024, url: "https://drive.google.com/file/d/1LTKy48IbusfXsl5nSNDTd0M3A8B3aPke/view", icon: "🎬" },
        { title: "High School Musical 2006 BluRay 720p Ganool.mkv", year: 2006, url: "https://drive.google.com/file/d/1tg84YPuUqFUMlVpGzjkhoEehBHV8W9ZF/view", icon: "🎬" },
        { title: "High School Musical 2.mp4", year: 2024, url: "https://drive.google.com/file/d/1iE1foAQrNAMJJg3aOd37GECWBkXmAEi7/view", icon: "🎬" },
        { title: "King Kong 1080p Extended (2005) Bluray.mp4", year: 2005, url: "https://drive.google.com/file/d/0B4puC3vPIb6YZmMxbk9DOURnVnM/view?resourcekey%3D0-GeuoDzgmOi-O97KfEGZKUA", icon: "🎬" },
        { title: "Norbit 2007 720p BluRay HEVC H265 BONE.mp4", year: 2007, url: "https://drive.google.com/file/d/1PUIzjrlfRen4M7CqwIcmVdABNBpMWt5s/view", icon: "🎬" },
        { title: "The Grinch.mkv", year: 2024, url: "https://drive.google.com/file/d/1_z5TUQlNH-IWdeFo_jDZDKsuVi32VdRs/view", icon: "🎬" },
        { title: "Kill.Bill.Vol.1.2003.720p.BrRip.x264.YIFY.mp4", year: 2003, url: "https://drive.google.com/file/d/1O7IPP73pLpqj6qH4mfqjDhwNbeDMSU7N/view", icon: "🎬" },
        { title: "Kill.Bill.Vol.2.2004.720p.BrRip.x264.YIFY.mp4", year: 2004, url: "https://drive.google.com/file/d/1p5DfNhB87k8bE-OQi7ELONmPkIhJIjC-/view", icon: "🎬" },
        { title: "Blue.Beetle.2023.720p.WEBRip.800MB.x264-GalaxyRG.mkv", year: 2023, url: "https://drive.google.com/file/d/1T2XMXtDAlohPcGdi-u2p9zXF9Os9zkY1/view", icon: "🎬" },
        { title: "Boyz.n.The.Hood.1991.1080p.BRrip.x264.YIFY.mp4", year: 1991, url: "https://drive.google.com/file/d/1fCv2dJuy8k_NQWAxbNRxqW0_zKetF-uy/view", icon: "🎬" },
        { title: "Britannic (1999) Tubi Ripped 630p HD.mp4", year: 1999, url: "https://drive.google.com/file/d/1KviJq5Kuw7NbTUCuNEsep3Sj22NDYRgc/view", icon: "🎬" },
        { title: "Beavis & Butt-Head Do America 1996 (720p).mp4", year: 1996, url: "https://drive.google.com/file/d/1BTKq8RC65IOZVgI0VfdRekLzVY_SMKQ_/view", icon: "🎬" },
        { title: "A Minecraft Movie 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1Oppg2lJlwwqKmPK8z4HNcdeiEyf6GaHq/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Ad Vitam 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/101dcG1Oiy-0ERWVk1Fb03dm_j09WdFfq/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Alarum 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1U4MHoaBMWu0yoZOnzrAlqefeq57wBZqD/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Back in Action 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1YZ4OYkY_ez4FObMe9_a0cWB2oLgoq4Jd/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Ballerina (A John Wick Movie) 2025 720p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1QkggMVcGZDUcJNcAtuI7ZBCDKpb9WWgK/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Bank of Dave 2- The Loan Ranger 1080p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/16yWCtHQrntP_GS2EyRRMmw7kmyxtLhMv/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Batman Ninja vs. Yakuza League 2025 720p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1v4ePMMFVkWIBYNcYTyXUYPd_Uq2z2bf8/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Captain America- Brave New World 1080p HD.avi", year: 2024, url: "https://drive.google.com/file/d/1pJ5N0z8bQFpqeMx2UrZqrU1526ygzxDm/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Den of Thieves 2- Pantera 2025 1080p HD.avi", year: 2025, url: "https://drive.google.com/file/d/1zXldKkRUbXsql3rLXGX9bNpuwcPOiusw/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Diddy- Monster\'s Fall 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1ptJdU8If1DhaevNXIVnvy8Ugx5jX9CFy/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Dog Man 2025 1080p HD.avi", year: 2025, url: "https://drive.google.com/file/d/10qrrGAoRN3D01A7cUkrNuDELSAayfgwq/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Don\'t Die- The Man Who Wants to Live Forever 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/14MBinlPb33HEeL2XcbP94UwHhZbBlz7J/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "fantastic 4- Frist Steps 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1cBhl_4yyqtXZXvTMaAsS3zFBC076lHUe/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Gunslingers 2025 360p.mp4", year: 2025, url: "https://drive.google.com/file/d/1GdEt79gpwT4s6wRDZXH4GZuMmtj7BWeG/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Henry Danger- The Movie 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1siTn1l8gYcgh3nbITJVAiCUZrDdQG-wD/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "How to Train Your Dragon 2025 360p CAM.mp4", year: 2025, url: "https://drive.google.com/file/d/17o79ERK-HO1uQmEZwgr8wDygog_HTQsX/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Jurassic park Rebrith 720p HD.mp4", year: 2024, url: "https://drive.google.com/file/d/1x0n_tZPq79HxAnV2ZwnVPTkBenFGZjx-/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Last Breath 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1a_l1BZGGTQ1P_A4NBQ0RVcB4ye_9lB1e/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "M3GAN 2.0 2025 720p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1QkIGawMXMjf-FQ18o169NPPB8_l-Wx0I/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Mickey 17 2025 720p CAM/HD.avi", year: 2025, url: "https://drive.google.com/file/d/1w0ySmc9Lza6jAdgbxLdVQPd9xtmR_bq0/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Novocaine 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1hxffkmG2xIxMXE8-ap16hyprKo3x-86V/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Plankton! The Movie 2025 720p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1GhJnl35m05XYpjooWoxeg0lw54VpjCEx/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Popeye the Slayer Man 2025 720p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1T98LuCA5MC7O2WaCDNNuJLry7H1b2j3e/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Sniper- The Last Stand 2025 1080p HD.avi", year: 2025, url: "https://drive.google.com/file/d/159k402C5RvOObYn-3pYz1CuRg-XNiZGr/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Snow White 2025 1080p HD CAM.mkv", year: 2025, url: "https://drive.google.com/file/d/1YZrs6IeoQvhMBceswxnoSEixffTm3l46/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Star Trek- Section 31 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/176Ep16TeQCk90seFbjv6PgcsVh0fRi7f/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "SuperMan 2025 1080p HD.mkv", year: 2025, url: "https://drive.google.com/file/d/1nO646VaJQBN725tPVe9TLFnLBFPJ-jbL/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "The Calendar Killer 2025 1080p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1Pfg5YUf2BLQKPZ6tXR3CJUvmAWBBmeoR/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "The Conjuring- Last Rites 2025 720p CAMHD.mkv", year: 2025, url: "https://drive.google.com/file/d/1DGeZcbS6EeKgAZdmTRr-haezOxenoYRf/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "The Electric State 2025 720p HD.mp4", year: 2025, url: "https://drive.google.com/file/d/1HdmYKbuy5tElViuxt9sFwR-0Azj9_D6M/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Top Gun Maverick.mp4", year: 2024, url: "https://drive.google.com/file/d/1nmGDHktR96jkaYl2lf-d-XTtNtFh4PTv/view", icon: "🎬" },
        { title: "Superman_2025[_11573].mkv", year: 2025, url: "https://drive.google.com/file/d/1A61oIlDB8zy0cgj2tJdquKVpaJzl26mr/view", icon: "🎬" },
        { title: "The Mask 1994 720p HD.mp4", year: 1994, url: "https://drive.google.com/file/d/1ExVaSRcps4wvIcRczczvBPSGYxUkfvXE/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Rambo.III.1988.ULTIMATE.UNCUT.1080p.BluRay.H264.AAC-RARBG.mp4", year: 1988, url: "https://drive.google.com/file/d/1KDIkm6VSTb_QrvSb8Gvbus8z-L3BGySI/view", icon: "🎬" },
        { title: "Gremlins.theatrical DVDRIP.mp4", year: 2024, url: "https://drive.google.com/file/d/1OaLNJbZmSdQgH7Q9uN2u18ZOxHXOU7YJ/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Happy_Gilmore_2_2025[_10349].mkv", year: 2025, url: "https://drive.google.com/file/d/1nxZgZ_326gH-KsuJB6rZR8q5SNTTYCo0/view", icon: "🎬" },
        { title: "Gulliver\'s.Travels.2010.BluRay.720p.DTS.x264-CHD.mkv", year: 2010, url: "https://drive.google.com/file/d/0B6lIkxTshK4KTTh0RDlsSzN3Z0U/view?resourcekey%3D0-XfjX5Cc6t5WQVrVGr2Rrrg", icon: "🎬" },
        { title: "@Mj_Linkz KPOP Demon Hunters (2025) 720p 10bit NF WEB DL 6CH.mkv", year: 2025, url: "https://drive.google.com/file/d/1zT4SAUoKx29aoNVS3scuTMvTqyNgMQ7E", icon: "🎬" },
        { title: "Dungeons.and.Dragons.Honor.Among.Thieves.2023.720p.AMZN.WEBRip.900MB.x264-GalaxyRG.mkv", year: 2023, url: "https://drive.google.com/file/d/1iX6QbaV3Oi_yGDvqRcFvrJ4_gzIOisnT/view", icon: "🎬" },
        { title: "Cars 2006 360p.ts", year: 2006, url: "https://drive.google.com/file/d/106N7zd611ShtPMOx97XwFSxkg8theQLN/view", icon: "🎬" },
        { title: "Mufasa.The.Lion.King.2024.720p.WEBRip.x264.AAC-LAMA.mp4", year: 2024, url: "https://drive.google.com/file/d/1uQXNlwz-_1PwGdnJqTGUswBhJWgH8zMP/view", icon: "🎬" },
        { title: "Hercules.mp4", year: 2024, url: "https://drive.google.com/file/d/1sXad7VvXVn7qIilwdspq5RtjmInpa7mQ/view", icon: "🎬" },
        { title: "Coco.2017.720p.WEBRip.2CH.x265.HEVC-PSA.mkv", year: 2017, url: "https://drive.google.com/file/d/194M4dGCwh1hTxVM1-_axnLSdt4trnbK2/view", icon: "🎬" },
        { title: "Encanto 2021.mkv", year: 2021, url: "https://drive.google.com/file/d/1y5q4v_Sx6Kj9nIrNjaAbCVcX36nRC3qB/view?ts%3D6717b8cf", icon: "🎬" },
        { title: "Finding Nemo.mp4", year: 2024, url: "https://drive.google.com/file/d/11CN0fT7CwCHgz__mY4FWjcoT5w_wZD9S/view", icon: "🎬" },
        { title: "Frozen.II.2019.720p.BluRay.x264.AAC-[YTS.MX].mp4", year: 2019, url: "https://drive.google.com/file/d/1hpUpKEdeT9ta-8FjSpMUAXw17E-8uwIY/view", icon: "❄️" },
        { title: "The.Incredibles.2004.mp4", year: 2004, url: "https://drive.google.com/file/d/1tVsDrCHeADhoZRkQZnXIIj3R5kpB2une/view", icon: "🎬" },
        { title: "Inside Out.mkv", year: 2024, url: "https://drive.google.com/file/d/1BEPGPg_iR7L5QFJ91SizjlA6khwj6j1e/view", icon: "🎬" },
        { title: "Inside Out 2 2024 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1SABVZNMwHTME4hsFwL9IWyWZPKDTBSoT/view", icon: "🎬" },
        { title: "Maleficent 2014.mp4", year: 2014, url: "https://drive.google.com/file/d/1yx66GkjBaCwjcMNoovV8w9yPNlZ7Q4Gu/view", icon: "🎬" },
        { title: "Moana 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1EsX8k7nfYQrzC6apqJqnyfH7HLAHl31G/view", icon: "❄️" },
        { title: "Moana 2 2024 1080p HD CAM.mp4", year: 2024, url: "https://drive.google.com/file/d/1iVJq1FsNG577gesP7CaTWPLgdqAtnaEg/view", icon: "❄️" },
        { title: "Monsters.Inc.2001.720p.BluRay.x264.YIFY.mp4", year: 2001, url: "https://drive.google.com/file/d/1lmlVArBa1cDynHvvDOddrMnCPvYaFVeK/view", icon: "🎬" },
        { title: "MULAN SAGA", year: 2024, url: "https://drive.google.com/drive/folders/0ByibEzjq_Q9LdHlaVzVTLXB5Slk?resourcekey%3D0-vt41araB3egbisfGtub81g", icon: "🎬" },
        { title: "Luca (2021).mp4", year: 2021, url: "https://drive.google.com/file/d/1VcUlwoH5kBsHK6vYEMYMJuhpYgTCng20/view", icon: "🎬" },
        { title: "Pirates Of The Carribean Curse Of The Black Pearl.mp4", year: 2024, url: "https://drive.google.com/file/d/1D4fFFOThEcYDjLQqISw-29Le-xKt27pg/view", icon: "🎬" },
        { title: "Pirates_of_the_Caribbean_At_Worlds_End.mp4", year: 2024, url: "https://drive.google.com/file/d/1HuD4_RlXiHOUYHvi56h0t8D7__dCEH1Y/view", icon: "🎬" },
        { title: "Pirates of the Caribbean- On Stranger Tides 2011 720p HD.mp4", year: 2011, url: "https://drive.google.com/file/d/1Nc5QxL1XnvFJy6aNQ2s1j_TwtwqWRjoY/view", icon: "🎬" },
        { title: "Tangled.2010.mp4", year: 2010, url: "https://drive.google.com/file/d/1eirKJt3ulfEusRJ6OM0jwpJ_YbL8iExC/view", icon: "🎬" },
        { title: "Ratatouille.2007.BRRip.mkv", year: 2007, url: "https://drive.google.com/file/d/1kjVDdXtZ3-O0SndMHeIwMXe4jNZJ4w2C/view", icon: "🎬" },
        { title: "simpson.mp4", year: 2024, url: "https://drive.google.com/file/d/1lfgeKem8CjfY7LHA67xfbdIv1SWliNVp/view", icon: "🎬" },
        { title: "The Princess and the Frog.mp4", year: 2024, url: "https://drive.google.com/file/d/1Mm4-trdWWnxtYyAfkIj--2SXem5HeIi2/view", icon: "🎬" },
        { title: "The Little Mermiad Ariel unda da sea.mp4", year: 2024, url: "https://drive.google.com/file/d/1GM7QyJzFwEKM2fM42SWb7oIRN2UPUzqM/view", icon: "🎬" },
        { title: "the little mermaid (2023).mov", year: 2023, url: "https://drive.google.com/file/d/1sFYkkRX85JK-a2LRl8_QmZPhYkYIn6KG/view", icon: "🎬" },
        { title: "The Lion King.mp4", year: 2024, url: "https://drive.google.com/file/d/1fpkFiPnyvjxCtN6a89i-U2H1cr5_Y_HC/view", icon: "🎬" },
        { title: "Toy Story Trilogy", year: 2024, url: "https://drive.google.com/drive/folders/1cmpDGlJ-vvs5g1wJKKoimdjPg28MPS39", icon: "🎬" },
        { title: "Toy Story 1995 720p.ts", year: 1995, url: "https://drive.google.com/file/d/1fW6Ov5NIaRh4h78-qBpWeln_Vs9oEXOQ/view", icon: "🎬" },
        { title: "Toy Story 2 1999.mp4", year: 1999, url: "https://drive.google.com/file/d/1k3RVDc_Vah1H9lFsXQZJ6mE3KqdDcK_T/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Toy Story 3.mp4", year: 2024, url: "https://drive.google.com/file/d/13msxxmyEco7CRBkO_Ju1SMx5KK4r4Su8/view", icon: "🎬" },
        { title: "Toy Story 4.mp4", year: 2024, url: "https://drive.google.com/file/d/1bFUbsQ9VEazeCt5l_VBVDtjCsbJmZ_Vr/preview", icon: "🎬" },
        { title: "WALL·E (2008) - HD 1080p.MP4", year: 2008, url: "https://drive.google.com/file/d/0B9konOTuvSYRQTl2Nmp6NkpjSG8/view?resourcekey%3D0-gT34eT_Bn7WLDxwX3U41fw", icon: "🎬" },
        { title: "Zootopia 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1HYeIrbf8A-vfvJsvYP59AQzG9l8nt03h/view", icon: "🎬" },
        { title: "Avengers.Infinity.War.2018.720p.BluRay.x264-[YTS.AM].mp4", year: 2018, url: "https://drive.google.com/file/d/1VWLpj4G4CEgHnjpxfc67MrlEWu5pD75Y/view", icon: "🎬" },
        { title: "", year: 2024, url: "https://drive.google.com/file/d/1im0w37bz61WkwbQTvP_InTsYwphE6Sxn/view", icon: "🎬" },
        { title: "Avengers - Age of Ultron.mp4", year: 2024, url: "https://drive.google.com/file/d/1im0w37bz61WkwbQTvP_InTsYwphE6Sxn/view", icon: "🎬" },
        { title: "Ant-Man And The Wasp.mp4", year: 2024, url: "https://drive.google.com/file/d/1AstKQ5KLX94k7RFIlsu2St9um8sS_w_M/view", icon: "🎬" },
        { title: "Black.Panther.2018.mp4", year: 2018, url: "https://drive.google.com/file/d/1GdMksUpH7ghCBF1j4sEmJU9hmZ3pPpkn/view", icon: "🎬" },
        { title: "Deadpool 2016 360p.ts", year: 2016, url: "https://drive.google.com/file/d/1VH_yELQQxJxhuyxsU80q8eMsEeaxNomz/view", icon: "🎬" },
        { title: "Deadpool.2.2018.720p.BluRay.x264-[YTS.AM].mp4", year: 2018, url: "https://drive.google.com/file/d/1wcE3D19t54BnWtLNl5cruklfPVPh92nY/view", icon: "🎬" },
        { title: "Deadpool & Wolverine 2024.mp4", year: 2024, url: "https://drive.google.com/file/d/1aBzsoTJAjhZeFFDkIV2SN7p7ZHagUEDc/view?t%3D1", icon: "🎬" },
        { title: "Doctor Strange 2016 720p HD.mkv", year: 2016, url: "https://drive.google.com/file/d/11PAFLA_D94t0ZbSqcy-ggyl2DU7g0Ay2/view", icon: "🎬" },
        { title: "Iron Man.mp4", year: 2024, url: "https://drive.google.com/file/d/1QOIBXMPZk86AVo0jI-zXYAuJGiWRUnNg/view", icon: "🎬" },
        { title: "Iron Man 2 2010 360p.ts", year: 2010, url: "https://drive.google.com/file/d/1u1glpdPyZvJ1MAgTrxAnTrS8Wvys3Bdt/view", icon: "🎬" },
        { title: "Iron-Man-3_1080p.mp4", year: 2024, url: "https://drive.google.com/file/d/1f7AlYvxrURwU7138fr2CzyTmN0qK43rp/view", icon: "🎬" },
        { title: "Shang.Chi.and.the.Legend.of.the.Ten.Rings.2021.mp4", year: 2021, url: "https://drive.google.com/file/d/1xBiVuAnW0hFxIhG3samjzJJ-czMAKxN0/view", icon: "🎬" },
        { title: "The Wolverine (2013) BluRay 720p.mp4", year: 2013, url: "https://drive.google.com/file/d/0BzeqnwcztH5cRERqUGl6TFkyc3M/view?usp%3Ddrive_link%26resourcekey%3D0--S8rnshNZ6cP5uYrkFu3WA", icon: "🎬" },
        { title: "Thor- The Dark World 2013 720p HD.mp4", year: 2013, url: "https://drive.google.com/file/d/10r1UB_bpBRfG8HykNJ2j63nwUawm-3FS/view", icon: "🎬" },
        { title: "Venom 2018 1080p HD.mp4", year: 2018, url: "https://drive.google.com/file/d/1XoN0B1rsNKDDRphmI8bM606r4wRQ6JUH/view", icon: "🎬" },
        { title: "Venom.Let.There.Be.Carnage.2021.mkv", year: 2021, url: "https://drive.google.com/file/d/13d5gq3Kx3koobcfRTVyH9Hhum3s8Fxag/view", icon: "🎬" },
        { title: "Venom- The Last Dance 2024 CAM 360p.ts", year: 2024, url: "https://drive.google.com/file/d/1C6aUcmJeLpm8ysdYwnt7HRZFAT6k0oQs/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "X-Men Origins- Wolverine (2009) Full Movie - Genvideos.mp4", year: 2009, url: "https://drive.google.com/file/d/0BxvqXivT-hg5d2VmZDdsNlBNUzQ/view?usp%3Ddrive_link%26resourcekey%3D0-QWd9FlwAU9FUyU3Ejx_Cqw", icon: "🎬" },
        { title: "X-Men- Apocalypse.mp4", year: 2024, url: "https://drive.google.com/file/d/1XOhalDbPc-27oTHBEoiQCRjsXrktB4aY/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/14BaJhmDRr3veoH436CKdPDp9r-j5214I/view?usp%3Ddrive_link", icon: "🕷️" },
        { title: "02 Spider-Man 2 - Sam Raimi 2004 Eng Subs 1080p [H264-mp4].mp4", year: 2004, url: "https://drive.google.com/file/d/1yV7ZmEkfOVOLdV51wN6vSeDf3_tQqBvf/view", icon: "🕷️" },
        { title: "03 Spider-Man 3 - Sam Raimi 2007 Eng Subs 1080p [H264-mp4].mp4", year: 2007, url: "https://drive.google.com/file/d/1ExTfRPC3YGmCSg8W2uFSYkUMw7a1vcTR/view", icon: "🕷️" },
        { title: "The Amazing Spider-Man full movie.ts", year: 2024, url: "https://drive.google.com/file/d/1jom1D1Dc3eF3ZmCXVzh8lhlXrFGOBpXK/view", icon: "🕷️" },
        { title: "The.Amazing.SpiderMan.2.2014.mp4", year: 2014, url: "https://drive.google.com/file/d/1bQpgzMav6AHi3UYnAagHPsGyraC0GWK_/view", icon: "🕷️" },
        { title: "Spider-Man.Homecoming.2017.720p.BluRay.x264-[YTS.AG].mp4", year: 2017, url: "https://drive.google.com/file/d/16nP21GFh_p9LNNW59oX2pMmTznKV43K4/view", icon: "🕷️" },
        { title: "Spider-Man- Far from Home 2019.ts", year: 2019, url: "https://drive.google.com/file/d/1YFUpSLmxb6xIlbdJXScIkRYvwYxvJ_18/view?usp%3Ddrive_link", icon: "🕷️" },
        { title: "", year: 2024, url: "https://drive.google.com/file/d/1oddQM8w-8UqQIvB-fPpy1h-7xvAbklmA/view", icon: "🎬" },
        { title: "Spider-Man- No Way Home.theatrical 2021 DVDRIPPED.mp4", year: 2021, url: "https://drive.google.com/file/d/1oddQM8w-8UqQIvB-fPpy1h-7xvAbklmA/view", icon: "🕷️" },
        { title: "Into The Spider-Verse.mp4", year: 2024, url: "https://drive.google.com/file/d/1V3Bq0lrDQUxJay5DDs3gK69ZvRNb1j2u/view", icon: "🕷️" },
        { title: "Spider-Man.Across.The.Spider-Verse.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4", year: 2023, url: "https://drive.google.com/file/d/1Sd1l_LhKRp_2OE5gRJJyPubnZjJccLgQ/view", icon: "🕷️" },
        { title: "Jurassic Park 1 1993 360p.ts", year: 1993, url: "https://drive.google.com/file/d/1bB65cEOgbz2Y0ic6nGDZfUQlECXBk2qt/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "The Lost World- Jurassic Park 1997 360p.ts", year: 1997, url: "https://drive.google.com/file/d/15okru5XkkghrsKUfQJaFUTUHxHF_o9a1/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Jurassic Park III 2001 360p.ts", year: 2001, url: "https://drive.google.com/file/d/1W9RJS1N_rBcNFAA73Y3B6leLhhjXXY9k/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Jurassic World 2015 360p.ts", year: 2015, url: "https://drive.google.com/file/d/1oD0MwA_C9OVb7HeO70m9gAAs-dbm9SJG/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Jurassic World Dominion full movie.mp4", year: 2024, url: "https://drive.google.com/file/d/1x84uwAQzm7-j9MhDdNF5sb_jCRQFhjIa/view?usp%3Ddrive_link", icon: "🎬" },
        { title: "Polar.Express.2004.720p.BrRip.x264.YIFY.mp4", year: 2004, url: "https://drive.google.com/file/d/19KYYKqlEQyEuUTUQv32U53WoIDvKTRrx/view", icon: "🎬" },
        { title: "Red One 2024 720p CAM.mp4", year: 2024, url: "https://drive.google.com/file/d/1wevUU0vYh66BVIySC4_Ia9-BSCuzWU98/preview", icon: "🎬" },
        { title: "Elf (2003).mov", year: 2003, url: "https://drive.google.com/file/d/1-cJP_6uvuboesHkiYPgfIg49eKvsBsF0/view", icon: "🎄" },
        { title: "Home Alone 1990 720p.mp4", year: 1990, url: "https://drive.google.com/file/d/18YKNCTokG3B7ZWzCE3thunyDJMktLxnm/view", icon: "🎬" },
        { title: "A.Charlie.Brown.Christmas.1965.720p.WEBRip.x264-[YTS.AM].mp4", year: 1965, url: "https://drive.google.com/file/d/1e2UIrJdsz_0k5tp2v0EnPZiPv2ZQSTzg/view", icon: "🎄" },
        { title: "A Christmas Carol.mkv", year: 2024, url: "https://drive.google.com/file/d/1hi5sfVVAYK5AsMis11QjD5JLvL5aUY0h/view", icon: "🎄" },
        { title: "The Santa Clause 1994 720p HD.mp4", year: 1994, url: "https://drive.google.com/file/d/1PTvdGAIfRMLf66wxpcoCBZCBCAykqA9J/view", icon: "🎄" },
        { title: "Santa Paws 2- The Santa Pups 2012 720p HD.mp4", year: 2012, url: "https://drive.google.com/file/d/1nKagwL6NoKHtuYesNIFJGANnkugwq1iI/view", icon: "🎄" },
        { title: "Fred Claus 2007 720p HD.mp4", year: 2007, url: "https://drive.google.com/file/d/1Oc0AHPpHq7nVCJ7Sl79lECOEAfWihvnq/view", icon: "🎬" },
        { title: "The Santa Clause 2 2002 720p HD.mp4", year: 2002, url: "https://drive.google.com/file/d/1xYAMF4mhw9q24-9BeEbdlnEo3VUA88EQ/view", icon: "🎄" },
        { title: "Rudolph\'s Shiny New Year 1976 720p HD.mp4", year: 1976, url: "https://drive.google.com/file/d/1pHTT7Nvxj8vevVS7m6aVdCR1SOPBbgBG/view", icon: "🎄" },
        { title: "The Year Without a Santa Claus 1974 720p HD.mp4", year: 1974, url: "https://drive.google.com/file/d/1V-B7Xe1Iz_zs5tVaODEmjfb50oy_FmC0/view", icon: "🎄" },
        { title: "Rudolph the Red-Nosed Reindeer 1964 720p HD.mp4", year: 1964, url: "https://drive.google.com/file/d/1P5rir3K_OUo5D-tWPP788NIteN7tyi7v/view", icon: "🎄" },
        { title: "Movie 572", year: 2024, url: "https://drive.google.com/file/d/1_Lbll9HEdgCPJW4fkYZSLakCYnoRDMyl/view?usp%3Ddrivesdk", icon: "🎬" },
        { title: "Movie 573", year: 2024, url: "https://drive.google.com/file/d/1_Lbll9HEdgCPJW4fkYZSLakCYnoRDMyl/view?usp%3Ddrivesdk", icon: "🎬" },
    ];
    
    renderMovies(allMovies);
    initMovieSearch();
}
        { title: "Scream 5", year: 2022, url: "https://drive.google.com/file/d/1zLFZE5jEzvjRSAawv9gOk-E5FYhsYblJ/view", icon: "😱" },
        { title: "Scream (2022 Remastered)", year: 2022, url: "https://drive.google.com/file/d/1dUxJw1LdOKB4RxNkQLuxas9JJbaJPGlz/view", icon: "😱" },
        { title: "Halloween 1", year: 1978, url: "https://drive.google.com/file/d/1dd4z_ykIghvDgVE0YX7v4RK1zfMxH52r/view", icon: "🎃" },
        { title: "Halloween 2", year: 1981, url: "https://drive.google.com/file/d/1m32R5sqZJ7asq_oPOCusPYCFB68fuWW4/view", icon: "🎃" },
        { title: "Halloween 3", year: 1982, url: "https://drive.google.com/file/d/19iJrizksrAZfszCgGXDHqkopFg5hpXZD/view", icon: "🎃" },
        { title: "Halloween 4", year: 1988, url: "https://drive.google.com/file/d/1wWndI6GA3NuJV_XTYyEFcN5eHRZLR9dJ/view", icon: "🎃" },
        { title: "Halloween 5", year: 1989, url: "https://drive.google.com/file/d/1RE_r1wBJbejmMaHPZ6d_4DU6QXVcihHC/view", icon: "🎃" },
        
        // ==================== ANIMATED MOVIES ====================
        { title: "The Wild Robot", year: 2024, url: "https://drive.google.com/file/d/1_N9iHDAM3RbU2a0GTfgcNXDGuZDT_yZ-/view", icon: "🤖" },
        { title: "Coco", year: 2017, url: "https://drive.google.com/file/d/194M4dGCwh1hTxVM1-_axnLSdt4trnbK2/view", icon: "🎸" },
        { title: "Ratatouille", year: 2007, url: "https://drive.google.com/file/d/1kjVDdXtZ3-O0SndMHeIwMXe4jNZJ4w2C/view", icon: "🐀" },
        
        // You can add more from your list here - I've added the main series and horror movies
        // Just copy more Google Drive links from your document
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
