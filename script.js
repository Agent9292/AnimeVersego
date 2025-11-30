// Teri sheet ka ID (URL se copy kiya)
const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1"; // Apne sheet ka naam check kar lena

// Magic URL jo direct JSON deta hai (public sheet ke liye)
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function loadAnimeData() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    // JSON extract karo (Google ka special format hota hai)
    const jsonStart = text.indexOf('(') + 1;
    const jsonEnd = text.lastIndexOf(')');
    const data = JSON.parse(text.slice(jsonStart, jsonEnd));
    
    if (data.table.rows) {
      renderAnimeCards(data.table.rows);
      renderFeaturedSlides(data.table.rows.slice(0, 5));
      console.log("Data loaded successfully!");
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("anime-list").innerHTML = "<p>Data load nahi hua. Sheet public hai check karo!</p>";
  }
}

function renderAnimeCards(rows) {
  const container = document.getElementById("anime-list");
  container.innerHTML = "";
  
  rows.forEach((row, index) => {
    const cols = row.c;
    const no = cols[0]?.v || index + 1;
    const thumbnail = cols[1]?.v || "https://via.placeholder.com/200x300?text=No+Image";
    const name = cols[2]?.v || "Unknown Anime";
    const description = cols[3]?.v || "No description available";
    const link = cols[4]?.v || "#";
    
    const card = document.createElement("div");
    card.className = "anime-card";
    card.innerHTML = `
      <img src="${thumbnail}" alt="${name}" loading="lazy">
      <div class="card-content">
        <h4>#${no}</h4>
        <h3>${name}</h3>
        <p>${description}</p>
        <a href="${link}" target="_blank" class="watch-btn">▶ Watch Now</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderFeaturedSlides(rows) {
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");
  track.innerHTML = "";
  dots.innerHTML = "";
  
  rows.forEach((row, index) => {
    const cols = row.c;
    const thumbnail = cols[1]?.v || "";
    const name = cols[2]?.v || "";
    
    // Slide banaye
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.innerHTML = `
      <img src="${thumbnail}" alt="${name}">
      <div class="slide-info">
        <h3>${name}</h3>
      </div>
    `;
    track.appendChild(slide);
    
    // Dots banaye
    const dot = document.createElement("span");
    dot.className = "carousel-dot";
    dot.dataset.index = index;
    dots.appendChild(dot);
  });
  
  // Basic carousel functionality
  initCarousel();
}

// Simple carousel
function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  let currentSlide = 0;
  
  if (slides.length === 0) return;
  
  function showSlide(index) {
    document.getElementById("carousel-track").style.transform = 
      `translateX(-${index * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }
  
  document.getElementById("carousel-next").onclick = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };
  
  document.getElementById("carousel-prev").onclick = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };
  
  // Dots click
  dots.forEach((dot, index) => {
    dot.onclick = () => {
      currentSlide = index;
      showSlide(index);
    };
  });
}

// Page load par data fetch karo
document.addEventListener("DOMContentLoaded", loadAnimeData);
