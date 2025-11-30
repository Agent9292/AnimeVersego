// ================================
// FULL DEBUG + TELEGRAM (Chat ID: 7789044506)
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const TELEGRAM_BOT_TOKEN = "8502193314:AAGf6GpjJj9sudMb8f4UGazeko-4N6IASmg";
const TELEGRAM_CHAT_ID = "7789044506";

async function sendTelegram(msg) {
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🎌 AnimeVerse:
${msg}
⏰ ${new Date().toLocaleString('en-IN')}`
            })
        });
    } catch(e) {}
}

// ================================
// SHEET FETCH + DEBUG
// ================================
async function loadAnimeData() {
    try {
        await sendTelegram("🔄 Starting AnimeVerse data fetch...");
        
        const apiUrl = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;
        await sendTelegram(`📡 Fetching: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        await sendTelegram(`🌐 Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - Sheet not accessible`);
        }
        
        const rawData = await response.text();
        await sendTelegram(`📄 Raw data: ${rawData.length} chars`);
        
        let data;
        try {
            data = JSON.parse(rawData);
        } catch(e) {
            throw new Error("Invalid JSON - Sheet format wrong");
        }
        
        await sendTelegram(`✅ Parsed: ${data.length} rows
Sample: ${JSON.stringify(data[0] || {})}`);
        
        // Multiple format support
        const animeData = data
            .map((row, index) => {
                const cleaned = {
                    name: row.name || row[0] || row.A || '',
                    thumbnail: row.thumbnail || row[1] || row.B || '',
                    description: row.description || row[2] || row.C || '',
                    link: row.link || row[3] || row.D || ''
                };
                
                // Debug first 3 rows
                if (index < 3 && cleaned.name) {
                    sendTelegram(`Row ${index}:
📛 ${cleaned.name}
🖼️  ${cleaned.thumbnail ? 'OK' : 'MISSING'}
📝 ${cleaned.description}`);
                }
                
                return cleaned;
            })
            .filter(item => 
                item.name && item.name.trim() && 
                item.thumbnail && item.thumbnail.trim()
            );
        
        await sendTelegram(`🎌 Final: ${animeData.length} valid anime items`);
        
        if (animeData.length > 0) {
            fillCarousel(animeData);
            fillAnimeList(animeData);
            await sendTelegram(`✅ SUCCESS! ${animeData.length} anime loaded to site!`);
        } else {
            throw new Error("❌ No valid anime found - Check column names: name, thumbnail");
        }
        
    } catch (error) {
        await sendTelegram(`💥 CRITICAL ERROR:
${error.message}

🔗 Test URL: https://opensheet.elk.sh/${SHEET_ID}/Sheet1
📱 Chat ID: ${TELEGRAM_CHAT_ID}`);
    }
}

// ================================
// GLOBAL ERROR CATCHER
// ================================
window.addEventListener('error', (e) => {
    sendTelegram(`💥 JS CRASH:
${e.message}
📍 ${e.filename}:${e.lineno}`);
});

window.addEventListener('unhandledrejection', (e) => {
    sendTelegram(`🚫 Promise Error:
${e.reason}`);
});

// ================================
// AUTO START
// ================================
document.addEventListener('DOMContentLoaded', () => {
    sendTelegram("🚀 AnimeVerse website started!");
    loadAnimeData();
});

window.loadAnimeData = loadAnimeData;
