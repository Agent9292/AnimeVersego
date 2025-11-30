
/* ===============================
    CONFIG — ADD YOUR GOOGLE SHEET LINKS HERE
================================= */

// Anime List Sheet → publish to CSV and paste link
const ANIME_SHEET_URL = "https://docs.google.com/spreadsheets/d/1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0/edit?usp=drivesdk";

// Slides Sheet → publish to CSV and paste link
const SLIDE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0/edit?usp=drivesdk";



/* ===============================
    CSV → JSON Converter
================================= */
function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(row => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}



/* ===============================
    LOAD SLIDES
================================= */
async function loadSlides() {
  try {
    const res = await fetch(SLIDE_SHEET_URL);
    const csv = await res.text();
    const slides = csvToJson(csv);

    const track = document.getElementById("carousel-track");
    const dotsContainer = document.getElementById("carousel-dots");

    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    slides.forEach((s, i) => {
      // Slide Element
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.backgroundImage = `url('${s.image}')`;

      slide.innerHTML = `
        <div class="meta">
          <h3>${s.title || "Untitled"}</h3>
          <p>${s.subtitle || ""}</p>
        </div>
      `;

      track.appendChild(slide);

      // Dot
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
    const res = await fetch(ANIME_SHEET_URL);
    const csv = await res.text();
    const animeList = csvToJson(csv);

    const container = document.getElementById("anime-list");
    container.innerHTML = "";

    animeList.forEach(a => {
      const card = document.createElement("article");
      card.className = "anime-card";

      card.innerHTML = `
        <div class="thumb">
          <img src="${a.thumbnail}" alt="${a.name}">
        </div>
        <h3>${a.name}</h3>

        <p class="description">
          ${a.description}
          <span class="read-more">Read More</span>
        </p>

        <div class="actions">
          <a class="watch-btn" href="${a.link}" target="_blank">Watch Now</a>
        </div>
      `;

      // Read more Function
      const desc = card.querySelector(".description");
      const btn = card.querySelector(".read-more");

      btn.addEventListener("click", () => {
        desc.classList.toggle("expanded");
        btn.textContent = desc.classList.contains("expanded") ? "Read Less" : "Read More";
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Anime Load Error:", err);
  }
}



/* ===============================
    CAROUSEL CONTROLS
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

function goToSlide(index, total) {
  currentSlide = index;
  updateCarousel(total);
}

function updateCarousel(total) {
  const track = document.getElementById("carousel-track");
  const dots = document.querySelectorAll(".dot");

  const slideWidth = track.children[0].clientWidth + 14; // gap included

  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  dots.forEach(d => d.classList.remove("active"));
  dots[currentSlide].classList.add("active");
}



/* ===============================
    INIT ON PAGE LOAD
================================= */
window.onload = function () {
  loadSlides();
  loadAnimeCards();
};
