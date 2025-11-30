const sheetId = '1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0';
let allAnimeData = [];
let slidesData = [];
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, starting fetch...');
    fetchAllData();
    setupEventListeners();
});

function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        console.log('✅ Menu button found!');
        menuBtn.addEventListener('click', function(e) {
            console.log('🔥 Menu clicked!');
            toggleNavbar();
        });
    } else {
        console.error('❌ Menu button (#menu-btn) not found!');
    }

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearch);
        console.log('✅ Search button found!');
    } else {
        console.error('❌ Search button (#search-btn) not found!');
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        console.log('✅ Search input found!');
    } else {
        console.error('❌ Search input (#search-input) not found!');
    }

    document.addEventListener('click', closeNavbarOutside);
    document.addEventListener('keydown', handleEscape);
}

function fetchAllData() {
    console.log('📡 Fetching data...');
    fetchAnimeData();
    fetchSlidesData();
}

function fetchAnimeData() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet1&tq=select%20*`;
    console.log('🌐 Fetching anime data from:', url);
    
    fetch(url)
        .then(res => {
            console.log('📥 Response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(rep => {
            console.log('📄 Raw response length:', rep.length);
            try {
                const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
                allAnimeData = jsonData.table.rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
                console.log('✅ Anime data loaded:', allAnimeData.length, 'rows');
                renderAnimeCards(allAnimeData);
            } catch (e) {
                console.error('❌ JSON parse error:', e);
            }
        })
        .catch(err => {
            console.error('❌ Fetch anime error:', err);
            document.getElementById('anime-list').innerHTML = '<div class="no-results"><p>❌ Data load failed! Check console.</p></div>';
        });
}

function fetchSlidesData() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet2&tq=select%20*`;
    console.log('🌐 Fetching slides data from:', url);
    
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(rep => {
            try {
                const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
                slidesData = jsonData.table.rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
                console.log('✅ Slides data loaded:', slidesData.length, 'rows');
                renderSlides();
            } catch (e) {
                console.error('❌ JSON parse error for slides:', e);
            }
        })
        .catch(err => console.error('❌ Fetch slides error:', err));
}

// Baaki functions same rahenge, bas renderAnimeCards mein check add karo
function renderAnimeCards(data) {
    const animeList = document.getElementById('anime-list');
    if (!animeList) {
        console.error('❌ #anime-list element not found!');
        return;
    }
    animeList.innerHTML = createAnimeCards(data || []);
    attachReadMoreListeners();
    console.log('🎨 Anime cards rendered');
}

// Ye check karo pehle:
// 1. F12 dabaao -> Console tab mein dekho errors
// 2. HTML mein ye IDs hone chahiye: anime-list, menu-btn, search-btn, search-input, side-navbar
// 3. Google Sheet "Anyone with link can view" pe set karo
// 4. Network tab mein fetch requests check karo

console.log('🎯 Script loaded successfully!');                fullDesc.style.display = 'block';
                this.textContent = 'Read less';
            } else {
                shortDesc.style.display = 'block';
                fullDesc.style.display = 'none';
                this.textContent = 'Read more';
            }
        };
    });
}

function toggleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    searchInput.style.display = (searchInput.style.display === 'block') ? 'none' : 'block';

    if (searchInput.style.display === 'block') {
        searchInput.focus();
        searchInput.select();
        document.getElementById('anime-section')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleSearch() {
    const searchTerm = this.value.toLowerCase().trim();
    if (searchTerm === '') {
        renderAnimeCards(allAnimeData);
    } else {
        const filtered = allAnimeData.filter(row => row[2]?.toLowerCase().includes(searchTerm));
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

    // ⭐ ENABLE AUTO SLIDE
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

// ⭐ AUTO SLIDE FUNCTION
function startAutoSlide() {
    setInterval(() => {
        nextSlide();
    }, 4000); // Auto slide every 4 seconds
}
