function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

const slider = document.querySelector('.slider');
const slides = Array.from(slider.querySelectorAll('img'));
const totalSlides = slides.length;

let currentIndex = 1; // start at real first slide (index 1 because 0 is last clone)
let autoRotateInterval = null;
const slideInterval = 3000;

// Clone last and first slides for infinite loop illusion
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

slider.appendChild(firstClone);
slider.insertBefore(lastClone, slides[0]);

const allSlides = Array.from(slider.querySelectorAll('img'));

function updateActiveDot(index) {
    const dots = document.querySelectorAll('.model a');
    dots.forEach(dot => dot.classList.remove('active'));
    // Adjust dot index (since real slides start at index 1)
    const dotIndex = (index - 1 + totalSlides) % totalSlides;
    dots[dotIndex]?.classList.add('active');
}

function scrollToIndex(index, behavior = 'smooth') {
    // Wrap index for safety
    if (index < 0) index = totalSlides;
    if (index > totalSlides + 1) index = 1;

    const slide = allSlides[index];
    if (!slide) return;

    slider.scrollTo({
        left: slide.offsetLeft,
        behavior: behavior,
    });
    currentIndex = index;
    updateActiveDot(currentIndex);
}

function getClosestSlideIndex() {
    const scrollLeft = slider.scrollLeft;
    let closestIndex = 0;
    let minDistance = Infinity;
    allSlides.forEach((slide, i) => {
        const distance = Math.abs(slide.offsetLeft - scrollLeft);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    });
    return closestIndex;
}

function disableSmoothScroll() {
    slider.style.scrollBehavior = 'auto';
}

function enableSmoothScroll() {
    slider.style.scrollBehavior = 'smooth';
}

let scrollTimeout;
let isJumping = false;

slider.addEventListener('scroll', () => {
    if (isJumping) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const index = getClosestSlideIndex();
        currentIndex = index;
        updateActiveDot(currentIndex);

        if (index === 0) {
            isJumping = true;
            disableSmoothScroll();
            slider.scrollLeft = allSlides[totalSlides].offsetLeft;
            currentIndex = totalSlides;
            updateActiveDot(currentIndex);
            enableSmoothScroll();
            isJumping = false;
        } else if (index === totalSlides + 1) {
            isJumping = true;
            disableSmoothScroll();
            slider.scrollLeft = allSlides[1].offsetLeft;
            currentIndex = 1;
            updateActiveDot(currentIndex);
            enableSmoothScroll();
            isJumping = false;
        }
    }, 80);
});

// Dot navigation
document.querySelectorAll('.model a').forEach((dot, idx) => {
    dot.addEventListener('click', e => {
        e.preventDefault();
        scrollToIndex(idx + 1);
        resetAutoRotate();
    });
});

// Keyboard navigation (circular)
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        let nextIndex = currentIndex + 1;
        if (nextIndex > totalSlides + 1) nextIndex = 1;
        scrollToIndex(nextIndex);
        resetAutoRotate();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = totalSlides;
        scrollToIndex(prevIndex);
        resetAutoRotate();
    }
});

// Auto-rotate functions
function autoRotate() {
    let nextIndex = currentIndex + 1;
    if (nextIndex > totalSlides + 1) nextIndex = 1;
    scrollToIndex(nextIndex);
}

function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(autoRotate, slideInterval);
}

function stopAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
}

function resetAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
}

// Pause on hover
slider.addEventListener('mouseenter', stopAutoRotate);
slider.addEventListener('mouseleave', startAutoRotate);

// Initialize on page load
window.addEventListener('load', () => {
    scrollToIndex(1, 'auto'); // jump instantly to first real slide
    startAutoRotate();
});

function moveLeft() {
  scrollToIndex(currentIndex - 1);
  resetAutoRotate();
}

function moveRight() {
  scrollToIndex(currentIndex + 1);
  resetAutoRotate();
}

