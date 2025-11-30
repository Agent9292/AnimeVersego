// ================================
// ANIMEVERSEGO - 100% WORKING
// ================================
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let allAnimeData = [];

// ================================
// ALL FUNCTIONS FIRST (No Hoisting Issues)
// ================================
function fillCarousel(animeData) {
    const track = document.getElementById('carousel-track');
    const dots = document.getElementById('carousel-dots');
    
    track.innerHTML = '';
    dots.innerHTML = '';
    
    animeData.slice(0, 5).forEach((anime, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `
            <img src="${anime.thumbnail}" alt="${anime.name}" loading="lazy">
            <div class="slide-info">
                <h3>${anime.name}</h3>
                <p>${anime.description.substring(0, 100)}...</p>
            </div>
        `;
        track.appendChild(slide);
        
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.dataset.index = index;
        dots.appendChild(dot);
    });
    
    initCarousel();
}

function fillAnimeList(animeData) {
    const container = document.getElementById('anime-list');
    container.innerHTML = animeData.map(anime => `
        <div class="anime-card">
            <img src="${anime.thumbnail}" alt="${anime.name}" loading="lazy">
            <div class="card-info">
                <h3>${anime.name}</h3>
                <p>${anime.description}</p>
                <a href="${anime.link}" target="_blank" class="watch-btn">Watch Now</a>
            </div>
        </div>
    `).join('');
}

let currentSlide = 0;
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
    
    if (prevBtn) prevBtn.onclick = () => showSlide((currentSlide - 1 + 5) % 5);
    if (nextBtn) nextBtn.onclick = () => showSlide((currentSlide + 1) % 5);
    dots.forEach((dot, index) => dot.onclick = () => showSlide(index));
    showSlide(0);
}

// ================================
// LOAD DATA LAST
// ================================
async function loadData() {
    try {
        console.log("🔄 Loading...");
        const response = await fetch(API_URL);
        const data = await response.json();
        
        allAnimeData = data
            .filter(row => row.Name && row.Thumbnail)
            .map(row => ({
                name: row.Name,
                thumbnail: row.Thumbnail,
                description: row.Description,
                link: row.Link
            }));
        
        console.log("✅ LOADED:", allAnimeData.length, "anime");
        
        fillCarousel(allAnimeData);
        fillAnimeList(allAnimeData);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadData);
console.log("🚀 AnimeVerseGo Ready!");
