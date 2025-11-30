// ================================
// ORIGINAL WORKING FETCH + SLIDE SEARCH
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let allAnimeData = [];

// ================================
// ORIGINAL WORKING LOAD (No slice)
// ================================
async function loadData() {
    try {
        console.log("🔄 Fetching data...");
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
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
// 🔥 LEFT SLIDE SEARCH BAR
// ================================
function initSlideSearch() {
    // Search icon + panel create
    const searchHTML = `
        <div id="search-container" style="position:fixed;top:0;left:-400px;width:400px;height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);z-index:1000;transition:all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);box-shadow:5px 0 25px rgba(0,0,0,0.3);padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="color:white;margin:0;font-size:1.5em;">🔍 Search Anime</h3>
                <button id="close-search" style="background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:5px;">✕</button>
            </div>
            <input id="search-input" type="text" placeholder="Type anime name..." 
                   style="width:100%;padding:15px;border:none;border-radius:25px;font-size:16px;outline:none;box-shadow:0 5px 15px rgba(0,0,0,0.2);">
            <div id="search-results" style="margin-top:20px;max-height:70vh;overflow-y:auto;"></div>
        </div>
        
        <!-- Search Icon -->
        <div id="search-icon" style="position:fixed;top:20px;right:20px;width:50px;height:50px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999;box-shadow:0 8px 25px rgba(102,126,234,0.4);transition:all 0.3s;">
            🔍
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', searchHTML);
    
    // Icon click → Slide left
    document.getElementById('search-icon').addEventListener('click', () => {
        document.getElementById('search-container').style.left = '0';
        document.body.style.overflow = 'hidden'; // No scroll
    });
    
    // Close button
    document.getElementById('close-search').addEventListener('click', () => {
        document.getElementById('search-container').style.left = '-400px';
        document.body.style.overflow = 'auto';
        document.getElementById('search-input').value = '';
    });
    
    // Real-time search
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value;
        const results = document.getElementById('search-results');
        
        if (!query.trim()) {
            results.innerHTML = '';
            return;
        }
        
        const filtered = allAnimeData.filter(anime => 
            anime.name.toLowerCase().includes(query.toLowerCase())
        );
        
        results.innerHTML = filtered.slice(0, 10).map(anime => `
            <div style="display:flex;align-items:center;padding:12px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:15px;margin-bottom:10px;cursor:pointer;animation:slideIn 0.3s ease;">
                <img src="${anime.thumbnail}" style="width:60px;height:60px;object-fit:cover;border-radius:10px;margin-right:15px;" onerror="this.src='https://via.placeholder.com/60?text=?';">
                <div>
                    <div style="color:white;font-weight:600;font-size:14px;">${anime.name}</div>
                    <div style="color:rgba(255,255,255,0.8);font-size:12px;">${anime.description.substring(0,80)}...</div>
                </div>
            </div>
        `).join('');
    });
}

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Slide Search Ready!");
    initSlideSearch();
    loadData();
});

window.loadData = loadData;
console.log("✅ JS Perfect!");
