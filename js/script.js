/* ============================================
   Портфолио — Скрипты
   Минимум кода, полная безопасность
   ============================================ */

// ---------- ШАПКА: МЕНЯЕТСЯ ПРИ ПРОКРУТКЕ ----------
const header = document.getElementById('header');

window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

// ---------- МОБИЛЬНОЕ МЕНЮ ----------
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', function() {
    nav.classList.toggle('nav--open');
});

const navLinks = nav.querySelectorAll('.nav__link');
navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        nav.classList.remove('nav--open');
    });
});

// ---------- КАРУСЕЛЬ ПРОЕКТОВ ----------
const track = document.getElementById('carouselTrack');
const cards = track.querySelectorAll('.carousel__card');
const dotsContainer = document.getElementById('carouselDots');
const arrowLeft = document.querySelector('.carousel__arrow--left');
const arrowRight = document.querySelector('.carousel__arrow--right');

let currentIndex = 0;
const totalCards = cards.length;
let isScrolling = false;

// Создаём точки
for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel__dot');
    dot.setAttribute('aria-label', 'Проект ' + (i + 1));
    dot.addEventListener('click', function() {
        goToCard(i);
    });
    dotsContainer.appendChild(dot);
}

const dots = dotsContainer.querySelectorAll('.carousel__dot');

function getCardOffset(index) {
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const trackWidth = track.parentElement.offsetWidth;
    return (trackWidth / 2) - (cardWidth / 2) - (index * (cardWidth + gap));
}

function updateCarousel(instant) {
    cards.forEach(function(card, index) {
        card.classList.remove('is-center');
    });
    dots.forEach(function(dot, index) {
        dot.classList.remove('is-active');
    });

    cards[currentIndex].classList.add('is-center');
    dots[currentIndex].classList.add('is-active');

    const offset = getCardOffset(currentIndex);
    track.style.transition = instant ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    track.style.transform = 'translateX(' + offset + 'px)';
}

function goToCard(index) {
    if (isScrolling) return;

    if (index < 0) {
        currentIndex = totalCards - 1;
    } else if (index >= totalCards) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    updateCarousel(false);

    isScrolling = true;
    setTimeout(function() {
        isScrolling = false;
    }, 500);
}

arrowLeft.addEventListener('click', function() {
    goToCard(currentIndex - 1);
});

arrowRight.addEventListener('click', function() {
    goToCard(currentIndex + 1);
});

// Скролл колёсиком и тачпадом
const carousel = document.querySelector('.carousel');
let wheelAccumulator = 0;

carousel.addEventListener('wheel', function(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();
    wheelAccumulator += e.deltaY;

    const threshold = 80;
    if (Math.abs(wheelAccumulator) >= threshold) {
        if (wheelAccumulator > 0) {
            goToCard(currentIndex + 1);
        } else {
            goToCard(currentIndex - 1);
        }
        wheelAccumulator = 0;
    }
}, { passive: false });

// Свайп на мобильных — с отслеживанием движения пальца
let touchStartX = 0;
let touchCurrentX = 0;
let isDragging = false;
let startOffset = 0;

track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isDragging = true;
    startOffset = getCardOffset(currentIndex);

    track.style.transition = 'none';
});

track.addEventListener('touchmove', function(e) {
    if (!isDragging) return;

    touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX;

    track.style.transform = 'translateX(' + (startOffset + diff) + 'px)';
});

track.addEventListener('touchend', function() {
    if (!isDragging) return;
    isDragging = false;

    const diff = touchCurrentX - touchStartX;

    if (Math.abs(diff) > 60) {
        if (diff > 0) {
            goToCard(currentIndex - 1);
        } else {
            goToCard(currentIndex + 1);
        }
    } else {
        updateCarousel(false);
    }
});

// Инициализация
updateCarousel(true);

// Обновление при ресайзе
window.addEventListener('resize', function() {
    updateCarousel(true);
});