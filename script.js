/* ===============================
    YOUR GOOGLE SHEET LINK
================================= */
const ANIME_SHEET_URL = "https://docs.google.com/spreadsheets/d/1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0/edit?usp=sharing";
const SLIDE_SHEET_URL = ANIME_SHEET_URL; // Same sheet used for slides & anime



/* ===============================
   VIEW LINK → CSV CONVERTER
================================= */
function convertToCSV(url) {
  const idMatch = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) return null;

  const sheetID = idMatch[1];

  // No publish required — directly forces CSV export
  return `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;
}



/* ===============================
    CSV → JSON PARSER
================================= */
function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(row => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = values[i]?.trim()));
    return obj;
  });
}



/* ===============================
    LOAD SLIDES
================================= */
async function loadSlides() {
  try {
    const csvURL = convertToCSV(SLIDE_SHEET_URL);
    const res = await fetch(csvURL);
    const csv = await res.text();
    const slides = csvToJson(csv);

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
          <p>${s.Description}</p>
        </div>
      `;

      track.appendChild(slide);

      const dot = document.createElement("div");
      dot.className = "dot";
      if (i === 0) dot.classList.add("active");
      dot.dataset.index = i;

      dot.addEventListener("click", () => goToSlide(i, slides.length));
      dotsContainer.appendChild(dot);
    });

    initCarousel(slides.length);

  } catch (err) {
    console.error("Slide Load Error:", err);
  }
}



/* ===============================
    LOAD ANIME CARDS
================================= */
async function loadAnimeCards() {
  try {
    const csvURL = convertToCSV(ANIME_SHEET_URL);
    const res = await fetch(csvURL);
    const csv = await res.text();
    const animeList = csvToJson(csv);

    window.ANIME_LIST = animeList; // Save for searching

    renderAnimeCards(animeList);

  } catch (err) {
    console.error("Anime Load Error:", err);
  }
}



/* ===============================
    RENDER CARDS FUNCTION
================================= */
function renderAnimeCards(list) {
  const container = document.getElementById("anime-list");
  container.innerHTML = "";

  list.forEach(a => {
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

    // Read More Toggle
    const desc = card.querySelector(".description");
    const btn = card.querySelector(".read-more");

    btn.addEventListener("click", () => {
      desc.classList.toggle("expanded");
      btn.textContent = desc.classList.contains("expanded")
        ? "Read Less"
        : "Read More";
    });

    container.appendChild(card);
  });
}



/* ===============================
    SEARCH BAR (Name Only)
================================= */
document.getElementById("search").addEventListener("input", function () {
  const q = this.value.toLowerCase();

  const filtered = window.ANIME_LIST.filter(a =>
    a.Name.toLowerCase().includes(q)
  );

  renderAnimeCards(filtered);
});



/* ===============================
    CAROUSEL CONTROLLER
================================= */
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

function goToSlide(i, total) {
  currentSlide = i;
  updateCarousel(total);
}

function updateCarousel(total) {
  const track = document.getElementById("carousel-track");
  const dots = document.querySelectorAll(".dot");

  const slideWidth = track.children[0].clientWidth + 20;

  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  dots.forEach(d => d.classList.remove("active"));
  dots[currentSlide].classList.add("active");
}



/* ===============================
    INIT PAGE
================================= */
window.onload = () => {
  loadSlides();
  loadAnimeCards();
};
