// ================================
// CLEAN JS - NO SYNTAX ERRORS!
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let allAnimeData = [];

// ================================
// MAIN LOAD FUNCTION
// ================================
async function loadData() {
    try {
        console.log("🔄 Fetching:", API_URL);
        
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log("✅ Loaded:", data.length, "rows");
        
        allAnimeData = data
            .filter(row => row.name && row.thumbnail)
            .map(row => ({
                name: row.name || '',
                thumbnail: row.thumbnail || '',
                description: row.description || '',
                link: row.link || ''
            }));
        
        console.log("🎌 Valid anime:", allAnimeData.length);
        
        fillCarousel(allAnimeData);
        fillAnimeList(allAnimeData);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// ================================
// SEARCH FUNCTION
// ================================
function searchAnime(query = '') {
    const filtered = allAnimeData.filter(anime => 
        anime.name.toLowerCase().includes(query.toLowerCase())
    );
    fillCarousel(filtered);
    fillAnimeList(filtered);
}

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', loadData);

// Global access
window.loadData = loadData;
window.searchAnime = searchAnime;
console.log("🚀 JS Loaded Clean!");
