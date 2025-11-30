// Sheet1 = Anime Cards, Sheet2 = Slides (separate URLs)
const sheetId = '1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0';
let allAnimeData = [];
let slidesData = [];
let currentSlide = 0;

// Initialize everything after DOM loads
document.addEventListener('DOMContentLoaded', function() {
  fetchAllData();
  setupEventListeners();
});

function setupEventListeners() {
  // Menu toggle (mobile navbar)
  document.getElementById('menu-btn')?.addEventListener('click', toggleNavbar);
  
  // Search toggle - FIXED!
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', toggleSearch);
  }
  
  // Live search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Close navbar outside click
  document.addEventListener('click', closeNavbarOutside);
  
  // Escape key
  document.addEventListener('keydown', handleEscape);
}

function fetchAllData() {
  // Fetch Anime Cards (Sheet1)
  fetchAnimeData();
  // Fetch Slides (Sheet2)
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
    .catch(err => console.error('Anime data error:', err));
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
    .catch(err => console.error('Slides data error:', err));
}

// ANIME CARDS
function createAnimeCards(data) {
  let html = '';
  data.forEach(row => {
    const no = row[0] || '';
    const thumbnail = row[1] || '';
    const name = row[2] || '';
    const description = row[3] || '';
    const link = row[4] || '';

    html += `
      <div class="anime-card" data-name="${name?.toLowerCase()}">
        <div class="thumb">
          <img src="${thumbnail}" alt="${name}" />
        </div>
        <h3>${name}</h3>
        <p class="description">${description}</p>
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
}

// SLIDES (Sheet2)
function createSlides(data) {
  let html = '';
  data.forEach((row) => {
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
  document.getElementById('carousel-track').innerHTML = createSlides(slidesData);
  setupCarousel();
}

function setupCarousel() {
  document.getElementById('carousel-dots').innerHTML = '';
  
  // Dots
  slidesData.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    document.getElementById('carousel-dots').appendChild(dot);
  });
  
  // Controls
  document.getElementById('carousel-prev').addEventListener('click', prevSlide);
  document.getElementById('carousel-next').addEventListener('click', nextSlide);
  
  updateCarousel();
}

// SEARCH FUNCTIONALITY - FIXED!
function toggleSearch() {
  const searchInput = document.getElementById('search-input');
  searchInput.style.display = searchInput.style.display === 'none' || searchInput.style.display === '' ? 'block' : 'none';
  
  if (searchInput.style.display === 'block') {
    searchInput.focus();
    searchInput.select();
    document.getElementById('anime-section').scrollIntoView({ behavior: 'smooth' });
  }
}

function handleSearch() {
  const searchTerm = this.value.toLowerCase();
  const filtered = allAnimeData.filter(row => 
    row[2]?.toLowerCase().includes(searchTerm)
  );
  renderAnimeCards(filtered.length ? filtered : allAnimeData);
}

// NAVBAR
function toggleNavbar() {
  const navbar = document.getElementById('side-navbar');
  navbar.classList.toggle('active');
}

function closeNavbarOutside(e) {
  const navbar = document.getElementById('side-navbar');
  const menuBtn = document.getElementById('menu-btn');
  
  if (navbar.classList.contains('active') && 
      !navbar.contains(e.target) && 
      !menuBtn.contains(e.target)) {
    navbar.classList.remove('active');
  }
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    const searchInput = document.getElementById('search-input');
    searchInput.style.display = 'none';
    searchInput.value = '';
    renderAnimeCards(allAnimeData);
  }
}

// CAROUSEL
function updateCarousel() {
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.dot');
  
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
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
