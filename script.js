const sheetId = '1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0';
let allAnimeData = [];
let slidesData = [];
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', function() {
    fetchAllData();
    setupEventListeners();
});

function setupEventListeners() {
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleNavbar);
    }

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) searchBtn.addEventListener('click', toggleSearch);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', handleSearch);

    document.addEventListener('click', closeNavbarOutside);
    document.addEventListener('keydown', handleEscape);
}

function fetchAllData() {
    fetchAnimeData();
    fetchSlidesData();
}

function fetchAnimeData() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet1&tq=select%20*`;
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            allAnimeData = jsonData.table.rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
            renderAnimeCards(allAnimeData);
        })
        .catch(console.error);
}

function fetchSlidesData() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet2&tq=select%20*`;
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            slidesData = jsonData.table.rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
            renderSlides();
        })
        .catch(console.error);
}

// CREATE ANIME CARDS
function createAnimeCards(data) {
    if (data.length === 0) {
        return '<div class="no-results"><p>🔍 No anime found! Try different keywords.</p></div>';
    }

    let html = '';
    data.forEach(row => {
        const no = row[0] || '';
        const thumbnail = row[1] || '';
        const name = row[2] || '';
        const description = row[3] || '';
        const link = row[4] || '';

        const shortDesc = description.substring(0, 120);
        const showReadMore = description.length > 120;

        html += `
            <div class="anime-card" data-name="${name?.toLowerCase()}">    
                <div class="thumb">    
                    <img src="${thumbnail}" alt="${name}" />    
                </div>    
                <h3>${name}</h3>    
                <div class="description-container">    
                    <p class="description short-desc">${shortDesc}${showReadMore ? '...' : ''}</p>    
                    ${showReadMore ? `<span class="read-more-btn">Read more</span>` : ''}    
                    <p class="full-desc" style="display: none;">${description}</p>    
                </div>    
                <div class="actions">    
                    <a href="${link}" class="watch-btn" target="_blank">Watch Now</a>    
                    <span class="meta-small">${no}</span>    
                </div>    
            </div>`;
    });
    return html;
}

function renderAnimeCards(data) {
    document.getElementById('anime-list').innerHTML = createAnimeCards(data);
    attachReadMoreListeners();
}

function attachReadMoreListeners() {
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.onclick = function(e) {
            e.stopPropagation();
            const container = this.parentElement;
            const shortDesc = container.querySelector('.short-desc');
            const fullDesc = container.querySelector('.full-desc');

            if (this.textContent === 'Read more') {
                shortDesc.style.display = 'none';
                fullDesc.style.display = 'block';
                this.textContent = 'Read less';
            } else {
                shortDesc.style.display = 'block';
                fullDesc.style.display = 'none';
                this.textContent = 'Read more';
            }
        };
    });
}

// 🔥 FIXED SEARCH BEHAVIOR (NO RIGHT SHIFT + TITLE AUTO HIDE)
function toggleSearch() {
    const searchInput = document.getElementById('search-input');
    const header = document.querySelector('header'); // ⬅ where title exists

    if (!searchInput) return;

    const isOpen = searchInput.style.display === 'block';

    if (isOpen) {
        searchInput.style.display = 'none';
        searchInput.value = '';
        header.classList.remove('search-active');
        renderAnimeCards(allAnimeData);
    } else {
        searchInput.style.display = 'block';
        searchInput.focus();
        searchInput.select();
        header.classList.add('search-active');
        document.getElementById('anime-section')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleSearch() {
    const searchTerm = this.value.toLowerCase().trim();
    if (searchTerm === '') {
        renderAnimeCards(allAnimeData);
    } else {
        const filtered = allAnimeData.filter(row =>
            row[2]?.toLowerCase().includes(searchTerm)
        );
        renderAnimeCards(filtered);
    }
}

// NAVBAR TOGGLE
function toggleNavbar() {
    const navbar = document.getElementById('side-navbar');
    if (navbar) navbar.classList.toggle('active');
}

function closeNavbarOutside(e) {
    const navbar = document.getElementById('side-navbar');
    const menuBtn = document.getElementById('menu-btn');
    if (navbar?.classList.contains('active') && !navbar.contains(e.target) && !menuBtn?.contains(e.target)) {
        navbar.classList.remove('active');
    }
}

function handleEscape(e) {
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.style.display = 'none';
            searchInput.value = '';
            renderAnimeCards(allAnimeData);
        }

        const navbar = document.getElementById('side-navbar');
        if (navbar) navbar.classList.remove('active');

        const header = document.querySelector('header');
        header?.classList.remove('search-active');
    }
}

// SLIDES
function createSlides(data) {
    let html = '';
    data.forEach(row => {
        const thumbnail = row[1] || '';
        const name = row[2] || '';
        const description = row[3] || '';

        html += `
            <div class="slide" style="background-image: url('${thumbnail}')">
                <div class="meta">
                    <h3>${name}</h3>
                    <p>${description}</p>
                </div>
            </div>`;
    });
    return html;
}

function renderSlides() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;

    carouselTrack.innerHTML = createSlides(slidesData);
    setupCarousel();
}

function setupCarousel() {
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    slidesData.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    document.getElementById('carousel-prev')?.addEventListener('click', prevSlide);
    document.getElementById('carousel-next')?.addEventListener('click', nextSlide);

    updateCarousel();
    startAutoSlide();
}

function updateCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    const dots = document.querySelectorAll('.dot');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slidesData.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = currentSlide === 0 ? slidesData.length - 1 : currentSlide - 1;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function startAutoSlide() {
    setInterval(() => {
        nextSlide();
    }, 4000);
}
