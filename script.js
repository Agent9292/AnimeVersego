// ================================
// GOOGLE SHEETS DATA LOADER ONLY
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let allAnimeData = [];

// ================================
// LOAD DATA FROM GOOGLE SHEETS
// ================================
async function loadData() {
    try {
        console.log("🔄 Loading data from Google Sheets...");
        
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log("✅ Data loaded:", data.length, "rows");
        
        allAnimeData = data
            .filter(row => row.name && row.thumbnail)
            .map(row => ({
                name: row.name || '',
                thumbnail: row.thumbnail || '',
                description: row.description || '',
                link: row.link || ''
            }));
        
        console.log("🎌 Ready anime:", allAnimeData.length);
        
        // Ye functions tere HTML mein hone chahiye
        if (typeof fillCarousel === 'function') fillCarousel(allAnimeData);
        if (typeof fillAnimeList === 'function') fillAnimeList(allAnimeData);
        
    } catch (error) {
        console.error("❌ Load error:", error);
    }
}

// ================================
// START ON PAGE LOAD
// ================================
document.addEventListener('DOMContentLoaded', loadData);

console.log("🚀 AnimeVerse Data Loader Ready!");
