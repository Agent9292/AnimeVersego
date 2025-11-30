// Google Sheet data fetch
const sheetId = '1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0';
const sheetName = 'Sheet1';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&tq=select%20*`;

let allAnimeData = [];
let currentSlide = 0;
let slidesData = [];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});

function initApp() {
  fetchSheetData();
  setupEventListeners();
}

function setupEventListeners() {
  // Mobile Navbar Toggle
  document.getElementById('menu-btn').addEventListener('click', toggleNavbar);
  
  // Search Functionality
  document.getElementById('search-btn').addEventListener('click', toggleSearch);
  
  // Close navbar when clicking outside
  document.addEventListener('click', closeNavbarOutside);
  
  // Escape key to close search
  document.addEventListener('keydown', handleEscape);
}

function fetchSheetData() {
  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      const rows = jsonData.table.rows;
      allAnimeData = rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
      
      // Use first 5 for slides, rest for anime cards
      slidesData = allAnimeData.slice(0, 5);
      allAnimeData = allAnimeData.slice(0, 20); // Limit for performance
      
      renderAnimeCards(allAnimeData);
      renderSlides(slidesData);
    })
    .catch(err => console.error('Error:', err));
}

function createAnimeCards(data) {
  let html = '';
  data.forEach(row => {
    const no = row[0] || '';
    const thumbnail = row[1] || '';
    const name = row[2] || '';
    const description = row[3] || '';
    const link = row[4] || '';

    html += `
      <div class="anime-card" data-name="${name.toLowerCase()}">
        <div class="thumb">
          <img src="${thumbnail}" alt="${name}" />
        </div>
        <h3>${name}</h3>
        <p class="description">${description}</p>
        <div class="actions">
          <a href="${link}" class="watch-btn" target="_blank">Watch Now</a>
          <span class="meta-small">Ep ${no}</span>
        </div>
      </div>`;
  });
  return html;
}

function renderAnimeCards(data) {
  document.getElementById('anime-list').innerHTML = createAnimeCards(data);
}

function createSlides(data) {
  let html = '';
  data.forEach((row, index) => {
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

function renderSlides(data) {
  document.getElementById('carousel-track').innerHTML = createSlides(data);
  document.getElementById('carousel-dots').innerHTML = '';
  
  // Create dots
  data.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    document.getElementById('carousel-dots').appendChild(dot);
  });
  
  // Carousel controls
  document.getElementById('carousel-prev').addEventListener('click', () => prevSlide());
  document.getElementById('carousel-next').addEventListener('click', () => nextSlide());
  
  updateCarousel();
}

function toggleNavbar() {
  const navbar = document.getElementById('side-navbar');
  navbar.classList.toggle('active');
  navbar.setAttribute('aria-hidden', !navbar.classList.contains('active'));
}

function toggleSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput.style.display === 'none' || searchInput.style.display === '') {
    searchInput.style.display = 'block';
    searchInput.focus();
    document.getElementById('anime-section').scrollIntoView({ behavior: 'smooth' });
  }
}

function closeNavbarOutside(e) {
  const navbar = document.getElementById('side-navbar');
  const menuBtn = document.getElementById('menu-btn');
  
  if (navbar.classList.contains('active') && 
      !navbar.contains(e.target) && 
      !menuBtn.contains(e.target)) {
    navbar.classList.remove('active');
    navbar.setAttribute('aria-hidden', 'true');
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

// Live search
document.getElementById('search-input').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const filtered = allAnimeData.filter(row => 
    row[2]?.toLowerCase().includes(searchTerm)
  );
  renderAnimeCards(filtered);
});

// Carousel functions
function updateCarousel() {
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.dot');
  
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
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
