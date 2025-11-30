/* ===============================
    GOOGLE SHEET → CSV LINK
================================= */

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0/export?format=csv";

let animeData = [];


/* ===============================
    CSV → JSON
================================= */

function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(row => {
    let values = row.split(",");
    let obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = values[i]?.trim()));
    return obj;
  });
}


/* ===============================
    LOAD ANIME CARDS
================================= */

async function loadAnime() {
  try {
    const res = await fetch(SHEET_CSV);
    const csv = await res.text();

    animeData = csvToJson(csv); // store master list
    showAnimeCards(animeData);

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}


/* ===============================
    SHOW CARDS
================================= */

function showAnimeCards(list) {
  const box = document.getElementById("anime-list");
  box.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.className = "anime-card";

    card.innerHTML = `
      <div class="thumb">
        <img src="${a.Thumbnails}" alt="${a.Name}">
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

    // Expand description
    const desc = card.querySelector(".description");
    const btn = card.querySelector(".read-more");

    btn.onclick = () => {
      desc.classList.toggle("expanded");
      btn.textContent = desc.classList.contains("expanded")
        ? "Read Less"
        : "Read More";
    };

    box.appendChild(card);
  });
}


/* ===============================
    SEARCH — only Name
================================= */

document.getElementById("search").addEventListener("input", function () {
  const q = this.value.toLowerCase();

  const filtered = animeData.filter(a =>
    a.Name.toLowerCase().includes(q)
  );

  showAnimeCards(filtered);
});


/* ===============================
    INIT
================================= */
window.onload = loadAnime;
