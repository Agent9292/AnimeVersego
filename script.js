const SHEET_ID = "1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0";
const SHEET_NAME = "Sheet1";
const API_URL = "https://opensheet.elk.sh/1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0/Sheet1";

let allAnimeData = [];

function fillCarousel(animeData) {
    var track = document.getElementById('carousel-track');
    var dots = document.getElementById('carousel-dots');
    track.innerHTML = '';
    dots.innerHTML = '';
    
    for(var i = 0; i < 5 && i < animeData.length; i++) {
        var anime = animeData[i];
        var slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = '<img src="' + anime.thumbnail + '" alt="' + anime.name + '"><div class="slide-info"><h3>' + anime.name + '</h3><p>' + anime.description.substring(0,100) + '...</p></div>';
        track.appendChild(slide);
        
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('data-index', i);
        dots.appendChild(dot);
    }
    initCarousel();
}

function fillAnimeList(animeData) {
    var container = document.getElementById('anime-list');
    var html = '';
    for(var i = 0; i < animeData.length; i++) {
        var anime = animeData[i];
        html += '<div class="anime-card"><img src="' + anime.thumbnail + '" alt="' + anime.name + '"><div class="card-info"><h3>' + anime.name + '</h3><p>' + anime.description + '</p><a href="' + anime.link + '" target="_blank" class="watch-btn">Watch Now</a></div></div>';
    }
    container.innerHTML = html;
}

function initCarousel() {
    var slides = document.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.carousel-dot');
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');
    var currentSlide = 0;
    
    function showSlide(index) {
        for(var i = 0; i < slides.length; i++) {
            slides[i].style.transform = 'translateX(' + ((i - index) * 100) + '%)';
        }
        for(var i = 0; i < dots.length; i++) {
            if(i === index) dots[i].classList.add('active');
            else dots[i].classList.remove('active');
        }
        currentSlide = index;
    }
    
    if(prevBtn) prevBtn.onclick = function() { showSlide((currentSlide - 1 + 5) % 5); };
    if(nextBtn) nextBtn.onclick = function() { showSlide((currentSlide + 1) % 5); };
    for(var i = 0; i < dots.length; i++) {
        dots[i].onclick = (function(index) { return function() { showSlide(index); }; })(i);
    }
    showSlide(0);
}

async function loadData() {
    try {
        console.log("Loading...");
        var response = await fetch(API_URL);
        var data = await response.json();
        
        allAnimeData = [];
        for(var i = 0; i < data.length; i++) {
            if(data[i].Name && data[i].Thumbnail) {
                allAnimeData.push({
                    name: data[i].Name,
                    thumbnail: data[i].Thumbnail,
                    description: data[i].Description,
                    link: data[i].Link
                });
            }
        }
        
        console.log("LOADED:", allAnimeData.length);
        fillCarousel(allAnimeData);
        fillAnimeList(allAnimeData);
    } catch(error) {
        console.error("Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadData);
console.log("AnimeVerse Ready!");
