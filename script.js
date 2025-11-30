/* ============================================
   GOOGLE SHEET → JSON CONFIG
============================================ */
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let GLOBAL_DATA = []; // search ke liye store





/* ============================================
   LOAD DATA FROM GOOGLE SHEET
============================================ */
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    GLOBAL_DATA = data;

    fillSlides(data);
    fillAnimeCards(data);
    initSearch();

  } catch (err) {
    console.error("Sheet Load Error:", err);
  }
}





/* ============================================
   SLIDES (CAROUSEL)
============================================ */
function fillSlides(data) {
  const slides = data.filter(d => d.Thumbnail && d.Thumbnail !== "");

  const track = document.getElementById("carousel-track");
  const dotsContainer = document.getElementById("carousel-dots");

  track.innerHTML = "";
  dotsContainer.innerHTML = "";

  slides.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url('${s.Thumbnail}')`;

    slide.innerHTML = `
      <div class="meta">
        <h3>${s.Name}</h3>
        <p>${s.Description || ""}</p>
      </div>
    `;

    track.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "dot";
    dot.dataset.index = i;
    if (i === 0) dot.classList.add("active");
    dot.onclick = () => goToSlide(i, slides.length);

    dotsContainer.appendChild(dot);
  });

  initCarousel(slides.length);
}





/* ============================================
   ANIME CARDS
============================================ */
function fillAnimeCards(data) {
  const container = document.getElementById("anime-list");
  container.innerHTML = "";

  data.forEach(a => {
    const card = document.createElement("article");
    card.className = "anime-card";

    card.innerHTML = `
      <div class="thumb">
        <img src="${a.Thumbnail}" alt="${a.Name}">
      </div>

      <h3>${a.Name}</h3>

      <p class="description">
        ${a.Description}
        <span class="read-more">Read More</span>
      </p>

      <div class="actions">
        <a class="watch-btn" href="${a.Link}" target="_blank">Watch Now</a>
      </div>
    `;

    const desc = card.querySelector(".description");
    const btn = card.querySelector(".read-more");

    btn.onclick = () => {
      desc.classList.toggle("expanded");
      btn.textContent = desc.classList.contains("expanded")
        ? "Read Less"
        : "Read More";
    };

    container.appendChild(card);
  });
}





/* ============================================
   SEARCH — only by NAME
============================================ */
function initSearch() {
  const input = document.getElementById("search");

  input.oninput = function () {
    const q = this.value.toLowerCase();

    const filtered = GLOBAL_DATA.filter(item =>
      item.Name.toLowerCase().includes(q)
    );

    fillAnimeCards(filtered);
  };
}





/* ============================================
   CAROUSEL CONTROLS
============================================ */
let currentSlide = 0;

function initCarousel(total) {
  document.getElementById("carousel-prev").onclick = () => {
    currentSlide = (currentSlide - 1 + total) % total;
    updateCarousel(total);
  };

  document.getElementById("carousel-next").onclick = () => {
    currentSlide = (currentSlide + 1) % total;
    updateCarousel(total);
  };
}

function goToSlide(index, total) {
  currentSlide = index;
  updateCarousel(total);
}

function updateCarousel(total) {
  const track = document.getElementById("carousel-track");
  const dots = document.querySelectorAll(".dot");
  const slideWidth = track.children[0].clientWidth + 14;

  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  dots.forEach(d => d.classList.remove("active"));
  dots[currentSlide].classList.add("active");
}





/* ============================================
   INIT ON PAGE LOAD
============================================ */
window.onload = loadData;
