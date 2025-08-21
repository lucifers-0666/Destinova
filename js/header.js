document.addEventListener('DOMContentLoaded', function () {
    // This assumes your main page has a div with id="header-placeholder"
    fetch('../html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeHeader();
            // Announce that the header is ready
            window.dispatchEvent(new CustomEvent('headerLoaded'));
        })
        .catch(error => console.error('Error loading header:', error));
});

function initializeHeader() {
    const header = document.getElementById('header-main');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header-scrolled', window.scrollY > 50);
        });
    }

    const menuToggle = document.getElementById('header-menuToggle');
    const nav = document.getElementById('header-mobile-nav');
    const overlay = document.getElementById('header-mobileNavOverlay');

    if (menuToggle && nav && overlay) {
        const toggleMenu = () => {
            nav.classList.toggle('header-active');
            overlay.classList.toggle('header-active');
            document.body.style.overflow = nav.classList.contains('header-active') ? 'hidden' : '';
        };
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when a link is clicked
        document.querySelectorAll('.header-mobile-nav a').forEach(link => {
            // Ensure we don't prevent dropdown toggles from working
            if (!link.parentElement.classList.contains('header-dropdown')) {
                link.addEventListener('click', toggleMenu);
            }
        });
    }

    // Handle mobile dropdowns
    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent navigation for the top-level dropdown link
            const parent = link.parentElement;
            parent.classList.toggle('header-open');
        });
    });
}