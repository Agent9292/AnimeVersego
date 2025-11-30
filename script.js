// ================================
// GOOGLE SHEET CONFIG - Working!
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// Global data storage
let allAnimeData = [];

// ================================
// FIXED LOAD DATA FUNCTION
// ================================
async function loadData() {
    try {
        console.log("🔄 Fetching from:", API_URL);
        
        const res = await fetch(API_URL);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("✅ Sheet Data Loaded:", data.length, "rows");

        // Filter valid anime data (name & thumbnail required)
        allAnimeData = data.filter(row => 
            row.name && row.name.trim() && 
            row.thumbnail && row.thumbnail.trim()
        ).map(row => ({
            name: row.name || '',
            thumbnail: row.thumbnail || '',
            description: row.description || '',
            link: row.link || ''
        }));

        console.log("🎌 Valid Anime:", allAnimeData.length);

        if (allAnimeData.length === 0) {
            console.warn("⚠️ No valid anime data found!");
        }

        // Call your functions
        fillCarousel(allAnimeData);
        fillAnimeList(allAnimeData);
        
    } catch (error) {
        console.error("❌ Error loading sheet:", error);
        document.getElementById('anime-list')?.innerHTML = 
            '<div style="text-align:center;color:#ff6b6b;">Failed to load anime data!</div>';
    }
}

// ================================
// SEARCH FUNCTION (Bonus)
// ================================
function searchAnime(query = '') {
    const filtered = allAnimeData.filter(anime => 
        anime.name.toLowerCase().includes(query.toLowerCase().trim())
    );
    
    fillCarousel(filtered);
    fillAnimeList(filtered);
    
    console.log(`🔍 Found ${filtered.length} anime for "${query}"`);
}

// ================================
// INIT - Auto load on page ready
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 AnimeVerse JS Ready!');
    loadData();
});

// Export functions for global use
window.loadData = loadData;
window.searchAnime = searchAnime;
window.allAnimeData = () => allAnimeData;
