document.addEventListener('DOMContentLoaded', function () {
    // --- MANAGE MENU VISIBILITY ---
    function handleManageMenuVisibility() {
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';

        const manageMenuDesktop = document.getElementById('manage-menu-desktop');
        const manageMenuMobile = document.getElementById('manage-menu-mobile');

        if (isSignedIn || hasBooked) { // Show if either is true for profile page access
            if (manageMenuDesktop) manageMenuDesktop.classList.remove('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.remove('manage-menu-hidden');
        } else {
            if (manageMenuDesktop) manageMenuDesktop.classList.add('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.add('manage-menu-hidden');
        }
    }
    handleManageMenuVisibility();

    // --- ACTIVE PAGE INDICATOR IN NAVBAR ---
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header-desktop-nav a, .header-mobile-nav a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            // A simple check for profile page, can be made more robust
            if (currentPage.includes('profile')) {
                // No active link for profile page in the main nav in this design
                return;
            }
            if (linkPage === currentPage) {
                link.classList.add('nav-active');
            }
        });
    }
    setActiveNavLink();

    // --- HEADER SCROLL & MOBILE MENU (Copied from index.js for consistency) ---
    const header = document.getElementById('header-main');
    if (header) {
        // Make header solid from the start on profile page
        header.classList.add('header-scrolled');
        window.addEventListener('scroll', () => {
            // Keep it scrolled
            if (!header.classList.contains('header-scrolled')) {
                header.classList.add('header-scrolled');
            }
        });
    }

    // AOS Initialization
    AOS.init({ once: true });
});