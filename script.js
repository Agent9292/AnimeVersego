// ================================
// TELEGRAM TEST + SHEET FETCH (Chat ID: 7789044506)
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const TELEGRAM_BOT_TOKEN = "8502193314:AAGf6GpjJj9sudMb8f4UGazeko-4N6IASmg";
const TELEGRAM_CHAT_ID = "7789044506";

let telegramWorking = false;

// ================================
// TELEGRAM TEST NOTIFICATION
// ================================
async function testTelegram() {
    const notifyDiv = document.getElementById('telegram-status') || 
        createStatusDiv();
    
    try {
        const testMsg = `🧪 TELEGRAM TEST
Bot Token: OK
Chat ID: ${TELEGRAM_CHAT_ID}
Site: AnimeVerse
⏰ ${new Date().toLocaleString('en-IN')}`;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: testMsg
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            telegramWorking = true;
            notifyDiv.innerHTML = '✅ Telegram OK! Check your Telegram.';
            notifyDiv.style.background = '#4ade80';
            console.log('✅ Telegram test passed!');
        } else {
            throw new Error(result.description);
        }
        
    } catch (error) {
        telegramWorking = false;
        notifyDiv.innerHTML = `❌ Telegram Failed: ${error.message}`;
        notifyDiv.style.background = '#f87171';
        console.error('Telegram test failed:', error);
    }
}

// ================================
// STATUS DIV CREATE
// ================================
function createStatusDiv() {
    const div = document.createElement('div');
    div.id = 'telegram-status';
    div.style.cssText = `
        position: fixed; top: 10px; right: 10px; 
        padding: 12px 20px; background: #10b981; 
        color: white; border-radius: 25px; 
        font-family: monospace; font-size: 14px; 
        z-index: 9999; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(div);
    return div;
}

// ================================
// MAIN TELEGRAM SENDER
// ================================
async function sendTelegram(msg) {
    if (!telegramWorking) return;
    
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
// SHEET FETCH
// ================================
async function loadAnimeData() {
    const statusDiv = document.getElementById('telegram-status');
    
    try {
        if (telegramWorking) {
            await sendTelegram("🔄 Starting sheet fetch...");
        }
        
        const apiUrl = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;
        const response = await fetch(apiUrl);
        
        statusDiv.innerHTML = `🌐 Fetching sheet... (${response.status})`;
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const animeData = data
            .map(row => ({
                name: row.name || row[0] || '',
                thumbnail: row.thumbnail || row[1] || '',
                description: row.description || row[2] || '',
                link: row.link || row[3] || ''
            }))
            .filter(item => item.name && item.thumbnail);
        
        statusDiv.innerHTML = `✅ Loaded ${animeData.length} anime!`;
        statusDiv.style.background = '#4ade80';
        
        if (telegramWorking && animeData.length > 0) {
            await sendTelegram(`✅ SUCCESS: ${animeData.length} anime loaded!`);
        }
        
        fillCarousel(animeData);
        fillAnimeList(animeData);
        
    } catch (error) {
        statusDiv.innerHTML = `❌ Sheet Error: ${error.message}`;
        statusDiv.style.background = '#f87171';
        
        if (telegramWorking) {
            await sendTelegram(`💥 SHEET ERROR: ${error.message}
🔗 ${apiUrl}`);
        }
    }
}

// ================================
// INIT - TEST FIRST!
// ================================
document.addEventListener('DOMContentLoaded', () => {
    testTelegram();  // Test Telegram first
    
    // Load data after 2 seconds (Telegram test complete)
    setTimeout(() => {
        loadAnimeData();
    }, 2000);
});

window.loadAnimeData = loadAnimeData;
window.testTelegram = testTelegram;    sendTelegram(`🚫 Promise Error:
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
