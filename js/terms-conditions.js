document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.querySelector('.terms-content');
    const navContainer = document.querySelector('#terms-nav ul');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    /**
     * 1. Dynamically generate sidebar navigation from section headings.
     */
    function setupSidebarNavigation() {
        if (!mainContent || !navContainer) return;

        const sections = mainContent.querySelectorAll('section[id]');
        let navHTML = '';

        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2').textContent;
            navHTML += `<li><a href="#${sectionId}">${sectionTitle}</a></li>`;
        });

        navContainer.innerHTML = navHTML;

        // Add smooth scroll listeners to the newly created links
        navContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Update URL hash without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * 2. Highlight the active section in the sidebar on scroll.
     */
    function highlightActiveSection() {
        const sections = mainContent.querySelectorAll('section[id]');
        const navLinks = navContainer.querySelectorAll('a');

        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px 0px -50% 0px', // trigger when section is in the top half of the screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * 3. Show/hide the "Back to Top" button based on scroll position.
     */
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    /**
     * 4. Smoothly scroll to the top of the page.
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // --- Event Listeners ---
    window.addEventListener('scroll', toggleBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);

    // --- Initializations ---
    setupSidebarNavigation();
    highlightActiveSection();
});