function toggleMenu(){
    const menu = document.querySelector(".menu-links")
    const icon = document.querySelector(".hamburger-icon")
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

let currentSlideIndex = 0;
const slideInterval = 2000; // Interval for auto-rotation (in milliseconds)
let autoRotateInterval;

// Function to scroll to a specific slide by ID
function scrollToSlide(slideId) {
    const slide = document.getElementById(slideId);
    const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.model a');

    // Calculate the offset position of the slide within the slider
    const offset = slide.offsetLeft;

    // Scroll the slider to the position of the selected slide
    slider.scrollTo({
        left: offset,
        behavior: 'smooth'
    });

    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    const activeDot = Array.from(dots).find(dot => dot.getAttribute('onclick').includes(slideId));
    if (activeDot) {
        activeDot.classList.add('active');
    }
}

// Function to auto-rotate slides
function autoRotateSlides() {
    const slides = document.querySelectorAll('.slider img');
    const totalSlides = slides.length;

    // Increment current slide index
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;

    // Get the ID of the next slide
    const nextSlideId = slides[currentSlideIndex].id;

    // Scroll to the next slide
    scrollToSlide(nextSlideId);
}

// Initialize auto-rotation
function startAutoRotate() {
    autoRotateInterval = setInterval(autoRotateSlides, slideInterval);
}

// Stop auto-rotation
function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

// Handle click events on anchor tags
document.querySelectorAll('.model a').forEach((anchor, index) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior

        // Get the slide ID from the onclick attribute
        const slideId = anchor.getAttribute('onclick').match(/'([^']+)'/)[1];

        // Scroll to the clicked slide
        scrollToSlide(slideId);

        // Update current slide index based on the clicked anchor
        currentSlideIndex = Array.from(document.querySelectorAll('.slider img')).findIndex(slide => slide.id === slideId);

        // Reset auto-rotation timer
        clearInterval(autoRotateInterval);
        startAutoRotate();
    });
});

// Optional: Reset auto-rotation timer when user interacts with slider
document.querySelector('.slider').addEventListener('mouseover', stopAutoRotate);
document.querySelector('.slider').addEventListener('mouseout', startAutoRotate);

// Initialize the first slide as active
const firstSlideId = document.querySelector('.slider img').id;
scrollToSlide(firstSlideId);
startAutoRotate();
