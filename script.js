// Initialize Lucide Icons
lucide.createIcons();

// =======================================================
// --- 1. Page Toggle Logic (Refactored) ---
// =======================================================
const navItems = document.querySelectorAll('.nav-item');
const homePage = document.getElementById('home-page');
const discoverPage = document.getElementById('discover-page');
const routesPage = document.getElementById('routes-page'); 
const mapPage = document.getElementById('map-page');
const appHeader = document.getElementById('app-header');

const homeHeaderContent = document.getElementById('home-header-content');
const discoverHeaderContent = document.getElementById('discover-header-content');
const routesHeaderContent = document.getElementById('routes-header-content'); 
const mapHeaderContent = document.getElementById('map-header-content');
const homeHeaderTitle = document.getElementById('home-header-title');
const discoverHeaderTitle = document.getElementById('discover-header-title');
const routesHeaderTitle = document.getElementById('routes-header-title'); 
const mapHeaderTitle = document.getElementById('map-header-title');

/**
 * Switches the displayed page content and updates the header/nav state.
 * @param {string} targetPage - The data-page attribute value ('home', 'discover', 'routes', 'map', etc.).
 */
function switchPage(targetPage) {
    // Deactivate all navigation items
    navItems.forEach(item => item.classList.remove('active'));

    // Hide all pages, headers, and remove header style classes first
    homePage.style.display = 'none';
    discoverPage.style.display = 'none';
    routesPage.style.display = 'none'; 
    mapPage.style.display = 'none';
    
    homeHeaderContent.style.display = 'none';
    discoverHeaderContent.style.display = 'none';
    routesHeaderContent.style.display = 'none'; 
    mapHeaderContent.style.display = 'none';
    
    homeHeaderTitle.style.display = 'none';
    discoverHeaderTitle.style.display = 'none';
    routesHeaderTitle.style.display = 'none';
    mapHeaderTitle.style.display = 'none';
    
    appHeader.classList.remove('discover-style');

    clearInterval(slideInterval); // Stop slider on leaving home

    // Toggle Content Visibility
    if (targetPage === 'home') {
        homePage.style.display = 'block';

        // Toggle Header Style
        homeHeaderContent.style.display = 'flex';
        homeHeaderTitle.style.display = 'block';
        startSlider(); // Restart slider on returning to home

    } else if (targetPage === 'discover') {
        discoverPage.style.display = 'block';

        // Toggle Header Style
        appHeader.classList.add('discover-style');
        discoverHeaderContent.style.display = 'flex';
        discoverHeaderTitle.style.display = 'block';

    } else if (targetPage === 'routes') { 
        routesPage.style.display = 'block';

        // Toggle Header Style (Using the same style as Discover for now)
        appHeader.classList.add('discover-style');
        routesHeaderContent.style.display = 'flex';
        routesHeaderTitle.style.display = 'block';
        
    } else if (targetPage === 'map') { 
        mapPage.style.display = 'block';

        // Toggle Header Style
        appHeader.classList.add('discover-style');
        mapHeaderContent.style.display = 'flex';
        mapHeaderTitle.style.display = 'block';
    
    } else {
        // For placeholder pages like 'more'
    }

    // Activate the corresponding navigation item
    const targetNavItem = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }

    // Re-initialize slider/carousel positions for the active page
    if (targetPage === 'home') {
        updateSlider(0); // Reset home page slider
    }
}

// Add click listeners to navigation items
navItems.forEach(item => {
    item.addEventListener('click', function() {
        const targetPage = this.getAttribute('data-page');
        switchPage(targetPage);
    });
});


// =======================================================
// --- 2. Ripple Effect for Buttons and Cards ---
// =======================================================
document.querySelectorAll('.header-icon-button, .filter-button, .tab-button, .map-content button, .nav-item, .place-actions button, .theme-tile, .mini-card, .mode-item').forEach(button => {
    button.addEventListener('click', function(e) {
        // Remove existing ripple
        this.querySelectorAll('.ripple-effect').forEach(r => r.remove());

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - (size / 2);
        const y = e.clientY - rect.top - (size / 2);

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
});

// =======================================================
// --- 3. Image Slider Logic (Home Page) ---
// =======================================================
const slider = document.querySelector('.image-slider');
const dots = document.querySelectorAll('.slider-dot');
const totalSlides = dots.length;
let currentSlide = 0;
let slideInterval;

function updateSlider(index) {
    slider.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;

    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider(currentSlide);
}

function startSlider() {
    // Clear old interval if exists
    clearInterval(slideInterval); 
    slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

// Stop auto-play on hover/touch and restart on leaving
const sliderContainer = document.querySelector('.image-slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('touchstart', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startSlider);
    sliderContainer.addEventListener('touchend', startSlider);
}


// Dot navigation controls
dots.forEach(dot => {
    dot.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-slide'));
        updateSlider(index);
        clearInterval(slideInterval); // Reset interval after manual control
        startSlider();
    });
});

// =======================================================
// --- 4. Notification & Jiggle Logic ---
// =======================================================
const notifButton = document.getElementById('notification-button');
const notifLabel = document.getElementById('notification-label');

if (notifButton) {
    notifButton.addEventListener('click', function() {
        // 1. Jiggle Animation
        this.classList.add('bell-active');
        setTimeout(() => {
            this.classList.remove('bell-active');
        }, 1500);

        // 2. Clear Notification Badge
        if (notifLabel) {
            notifLabel.style.opacity = '0'; // Fade out the badge
        }
    });
}

// =======================================================
// --- 5. Category Filter Logic (Discover Page) ---
// =======================================================
const filterButtons = document.querySelectorAll('.filter-button');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        console.log(`Filtering content by: ${this.textContent.trim()}`);
    });
});

// =======================================================
// --- 7. Dark Mode Toggle ---
// =======================================================
const themeToggleButtons = document.querySelectorAll('#theme-toggle-button, #theme-toggle-button-discover, #theme-toggle-button-routes, #theme-toggle-button-map'); 
const body = document.body;
const themeIconHome = document.getElementById('theme-icon');
const themeIconDiscover = document.getElementById('theme-icon-discover');
const themeIconRoutes = document.getElementById('theme-icon-routes');
const themeIconMap = document.getElementById('theme-icon-map'); 

/**
 * Saves and applies the current theme state.
 * @param {boolean} isDark - true for dark mode, false for light mode.
 */
function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        // Update icons to show 'sun' (for switching to light)
        if(themeIconHome) themeIconHome.setAttribute('data-lucide', 'sun');
        if(themeIconDiscover) themeIconDiscover.setAttribute('data-lucide', 'sun');
        if(themeIconRoutes) themeIconRoutes.setAttribute('data-lucide', 'sun');
        if(themeIconMap) themeIconMap.setAttribute('data-lucide', 'sun');
    } else {
        body.classList.remove('dark-mode');
        // Update icons to show 'moon' (for switching to dark)
        if(themeIconHome) themeIconHome.setAttribute('data-lucide', 'moon');
        if(themeIconDiscover) themeIconDiscover.setAttribute('data-lucide', 'moon');
        if(themeIconRoutes) themeIconRoutes.setAttribute('data-lucide', 'moon');
        if(themeIconMap) themeIconMap.setAttribute('data-lucide', 'moon');
    }
    // Re-create icons to apply the change (Lucide library requirement)
    lucide.createIcons(); 
}

/**
 * Initializes the theme based on user's preference or saved state.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark') {
        applyTheme(true);
    } else if (savedTheme === 'light') {
        applyTheme(false);
    } else if (prefersDark) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }
}


themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const isCurrentlyDark = body.classList.contains('dark-mode');
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        
        applyTheme(!isCurrentlyDark);
        localStorage.setItem('theme', newTheme);
    });
});

// =======================================================
// --- 8. Search Button Logic ---
// =======================================================
const searchButtonHome = document.getElementById('search-button-home');

if (searchButtonHome) {
    searchButtonHome.addEventListener('click', function() {
        // Placeholder for search action 
        alert('Search button clicked! A full-screen search modal or search page would launch here.');
        console.log('Search button clicked. Ready to launch search UI.');
    });
}


// =======================================================
// --- 9. Initialization on Load ---
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme (must be first to prevent flicker)
    initializeTheme(); 

    // 2. Start Home Slider (if home page is the default)
    startSlider(); 

    // 3. Ensure Home Page is visible initially (since we hid Discover in HTML)
    switchPage('home'); 
});