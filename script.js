// ================================
// TELEGRAM ERROR BOT + SHEET FETCH
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const TELEGRAM_BOT_TOKEN = "8502193314:AAGf6GpjJj9sudMb8f4UGazeko-4N6IASmg";
const TELEGRAM_CHAT_ID = "7789044506"; // Apna chat ID daalo

// Telegram error sender
async function sendTelegramError(message) {
    try {
        const url = https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: 🚨 AnimeVerse Error:
${message}
⏰ ${new Date().toLocaleString('en-IN')}
            })
        });
    } catch (e) {
        // Silent fail - Telegram bhi fail ho gaya
    }
}

// ================================
// SHEET DATA FETCH
// ================================
async function loadAnimeData() {
    try {
        const response = await fetch(https://opensheet.elk.sh/${SHEET_ID}/Sheet1);
        
        if (!response.ok) {
            throw new Error(HTTP ${response.status}: Sheet access failed);
        }
        
        const data = await response.json();
        
        // Data cleaning
        const animeData = data.map(row => ({
            name: row.name  row[0]  '',
            thumbnail: row.thumbnail  row[1]  '',
            description: row.description  row[2]  '',
            link: row.link  row[3]  ''
        })).filter(item => item.name && item.thumbnail);
        
        // Send success to Telegram (optional)
        await sendTelegramError(✅ AnimeVerse Loaded: ${animeData.length} anime items);
        
        // Your functions
        fillCarousel(animeData);
        fillAnimeList(animeData);
        
    } catch (error) {
        // NO CONSOLE.LOG - Sirf Telegram!
        await sendTelegramError(❌ SHEET FETCH ERROR:
${error.message}
📁 Sheet: ${SHEET_ID});
    }
}

// ================================
// GLOBAL ERROR HANDLER
// ================================
window.addEventListener('error', (e) => {
    sendTelegramError(💥 JS ERROR:
${e.message}
📍 ${e.filename}:${e.lineno});
});

window.addEventListener('unhandledrejection', (e) => {
    sendTelegramError(🚫 Promise Reject:
${e.reason});
});

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', loadAnimeData);
window.loadAnimeData = loadAnimeData;
