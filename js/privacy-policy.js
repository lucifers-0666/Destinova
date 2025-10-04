document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.querySelector('.privacy-content');
    const navContainer = document.querySelector('#privacy-nav ul');
    const cookieModal = document.getElementById('cookie-modal');
    const openCookiePrefsBtn = document.getElementById('open-cookie-prefs');
    const closeCookieModalBtn = cookieModal.querySelector('.modal-close-btn');
    const saveCookiePrefsBtn = document.getElementById('save-cookie-prefs-btn');
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAllBtn = document.getElementById('cookie-accept-all-btn');
    const customizeBtn = document.getElementById('cookie-customize-btn');

    /**
     * 1. Dynamically generate sidebar navigation from section headings.
     */
    function setupPrivacySidebar() {
        if (!mainContent || !navContainer) return;

        const sections = mainContent.querySelectorAll('section[id]');
        let navHTML = '';

        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2').textContent;
            navHTML += `<li><a href="#${sectionId}">${sectionTitle}</a></li>`;
        });

        navContainer.innerHTML = navHTML;

        navContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, targetId);
            });
        });
    }

    /**
     * 2. Highlight the active section in the sidebar on scroll.
     */
    function highlightActiveSection() {
        const sections = mainContent.querySelectorAll('section[id]');
        const navLinks = navContainer.querySelectorAll('a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '0px 0px -50% 0px', threshold: 0 });

        sections.forEach(section => observer.observe(section));
    }

    /**
     * 3. Cookie Preferences Modal Logic
     */
    function openCookiePreferences() {
        cookieModal.style.display = 'flex';
    }

    function closeCookieModal() {
        cookieModal.style.display = 'none';
    }

    function saveCookiePreferences() {
        const functional = document.getElementById('cookie-functional').checked;
        const analytics = document.getElementById('cookie-analytics').checked;
        const marketing = document.getElementById('cookie-marketing').checked;

        const preferences = { functional, analytics, marketing, consent_given: true };
        localStorage.setItem('cookie_preferences', JSON.stringify(preferences));

        console.log('Cookie preferences saved:', preferences);
        alert('Preferences saved!');
        closeCookieModal();
    }

    /**
     * 4. Cookie Banner Logic
     */
    function loadCookiePreferences() {
        const consent = localStorage.getItem('cookie_preferences');
        if (!consent) {
            cookieBanner.classList.add('visible');
        } else {
            console.log('User has already provided cookie consent.');
        }
    }

    function acceptAllCookies() {
        const preferences = { functional: true, analytics: true, marketing: true, consent_given: true };
        localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
        cookieBanner.classList.remove('visible');
        console.log('Accepted all cookies.');
    }

    // --- Event Listeners ---

    // Sidebar and scrolling
    if (document.querySelector('.privacy-sidebar')) {
        setupPrivacySidebar();
        highlightActiveSection();
    }

    // Cookie Modal
    if (openCookiePrefsBtn) openCookiePrefsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCookiePreferences();
    });
    if (closeCookieModalBtn) closeCookieModalBtn.addEventListener('click', closeCookieModal);
    if (saveCookiePrefsBtn) saveCookiePrefsBtn.addEventListener('click', saveCookiePreferences);
    if (cookieModal) cookieModal.addEventListener('click', (e) => {
        if (e.target === cookieModal) closeCookieModal();
    });

    // Cookie Banner
    if (acceptAllBtn) acceptAllBtn.addEventListener('click', acceptAllCookies);
    if (customizeBtn) customizeBtn.addEventListener('click', () => {
        cookieBanner.classList.remove('visible');
        openCookiePreferences();
    });

    // --- Initializations ---
    loadCookiePreferences();
});