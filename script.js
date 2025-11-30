const sheetId = '1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0';
let allAnimeData = [];
let slidesData = [];
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', function() {
  fetchAllData();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('menu-btn')?.addEventListener('click', toggleNavbar);
  document.getElementById('search-btn')?.addEventListener('click', toggleSearch);
  document.getElementById('search-input')?.addEventListener('input', handleSearch);
  document.addEventListener('click', closeNavbarOutside);
  document.addEventListener('keydown', handleEscape);
}

function fetchAllData() {
  fetchAnimeData();
  fetchSlidesData();
}

function fetchAnimeData() {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet1&tq=select%20*`;
  fetch(url).then(res => res.text()).then(rep => {
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    allAnimeData = jsonData.table.rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
    renderAnimeCards(allAnimeData);
  }).catch(console.error);
}

function fetchSlidesData() {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet2&tq=select%20*`;
  fetch(url).then(res => res.text()).then(rep => {
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    slidesData = jsonData.table.rows.map(r => r.c.map(cell => cell ? cell.v : '')).slice(1);
    renderSlides();
  }).catch(console.error);
}

// Anime cards with Read More toggle
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

    let shortDesc = description.length > 150 ? description.substring(0, 150) + '...' : description;
    let readMoreSpan = description.length > 150 ? `<span class="read-more">Read more</span>` : '';
      
    html += `
      <div class="anime-card" data-name="${name?.toLowerCase()}">
        <div class="thumb">
          <img src="${thumbnail}" alt="${name}" />
        </div>
        <h3>${name}</h3>
        <p class="description">${shortDesc}${readMoreSpan}</p>
        <div class="actions">
          <a href="${link}" class="watch-btn" target="_blank">Watch Now</a>
          <span class="meta-small">${no}</span>
        </div>
        <p class="full-desc" style="display:none;">${description}</p>
      </div>`;
  });
  return html;
}

function renderAnimeCards(data) {
  document.getElementById('anime-list').innerHTML = createAnimeCards(data);
  attachReadMoreListeners();
}

function attachReadMoreListeners() {
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.onclick = function() {
      const desc = this.parentElement;
      const fullDesc = desc.nextElementSibling; // full-desc p
      if (desc.classList.contains('expanded')) {
        desc.innerHTML = desc.innerText.substring(0, 150) + '... <span class="read-more">Read more</span>';
        fullDesc.style.display = 'none';
        attachReadMoreListeners();
      } else {
        desc.classList.add('expanded');
        desc.innerHTML = fullDesc.innerText + ' <span class="read-more">Read less</span>';
        fullDesc.style.display = 'none';
        attachReadMoreListeners();
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
    document.getElementById('anime-section').scrollIntoView({ behavior: 'smooth' });
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

function toggleNavbar() {
  const navbar = document.getElementById('side-navbar');
  navbar.classList.toggle('active');
}

function closeNavbarOutside(e) {
  const navbar = document.getElementById('side-navbar');
  const menuBtn = document.getElementById('menu-btn');
  if (navbar.classList.contains('active') && !navbar.contains(e.target) && !menuBtn.contains(e.target)) {
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
  }
}

// Slides (unchanged)
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
}

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
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
