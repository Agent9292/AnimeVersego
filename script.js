// ================================
// PERFECT JS - Index 0 Fix + Search Bar!
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let allAnimeData = [];

// ================================
// FIXED LOAD DATA (Skip Index 0)
// ================================
async function loadData() {
    try {
        console.log("🔄 Loading anime data...");
        
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        let data = await res.json();
        
        // 🔥 INDEX 0 FIX: Skip header row (index 0)
        data = data.slice(1); // Remove first row (headers)
        
        console.log("✅ Raw data:", data.length, "rows");
        
        allAnimeData = data
            .filter(row => row[0] && row[1]) // name (col 0), thumbnail (col 1)
            .map(row => ({
                name: row[0] || '',
                thumbnail: row[1] || '',
                description: row[2] || '',
                link: row[3] || ''
            }));
        
        console.log("🎌 Valid anime:", allAnimeData.length);
        
        fillCarousel(allAnimeData);
        fillAnimeList(allAnimeData);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// ================================
// 🔥 WORKING SEARCH FUNCTION
// ================================
function searchAnime(query = '') {
    if (!query.trim()) {
        // No query = show all
        fillCarousel(allAnimeData);
        fillAnimeList(allAnimeData);
        return;
    }
    
    const filtered = allAnimeData.filter(anime => 
        anime.name.toLowerCase().includes(query.toLowerCase().trim())
    );
    
    console.log(`🔍 "${query}" → ${filtered.length} results`);
    
    fillCarousel(filtered);
    fillAnimeList(filtered);
}

// ================================
// SEARCH BAR HTML + JS
// ================================
function initSearchBar() {
    // Search input create karo (if not exists)
    let searchInput = document.getElementById('anime-search');
    if (!searchInput) {
        const searchDiv = document.createElement('div');
        searchDiv.style.cssText = `
            text-align: center; margin: 20px 0; padding: 15px;
            background: rgba(255,255,255,0.9); border-radius: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;
        searchDiv.innerHTML = `
            <input id="anime-search" type="text" placeholder="🔍 Search anime by name..."
                   style="
                width: 80%; max-width: 500px; padding: 12px 20px; 
                font-size: 16px; border: 2px solid #667eea; border-radius: 25px;
                outline: none; transition: all 0.3s;
            ">
            <button onclick="searchAnime(document.getElementById('anime-search').value)"
                    style="
                padding: 12px 25px; margin-left: 10px; background: #667eea;
                color: white; border: none; border-radius: 25px; cursor: pointer;
                font-weight: bold;
            ">Search</button>
        `;
        document.body.insertBefore(searchDiv, document.body.firstChild);
        searchInput = document.getElementById('anime-search');
    }
    
    // Real-time search (type karte hi)
    searchInput.addEventListener('input', (e) => {
        const timeout = setTimeout(() => {
            searchAnime(e.target.value);
        }, 300); // 300ms debounce
    });
}

// ================================
// INIT EVERYTHING
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 AnimeVerse Ready!");
    initSearchBar();  // 🔥 Search bar add
    loadData();       // 🔥 Data load
});

// Global functions
window.loadData = loadData;
window.searchAnime = searchAnime;
window.allAnimeData = () => allAnimeData;
