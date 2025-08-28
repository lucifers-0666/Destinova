document.addEventListener('DOMContentLoaded', function() {

    /**
     * Initializes all JavaScript functionality for the footer elements.
     * This function is called only after the footer HTML has been successfully fetched and injected into the DOM.
     */
    function initializeFooterScripts() {
        // --- Intersection Observer for footer scroll animations ---
        const footer = document.getElementById('destinova-footer');
        if (footer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.classList.add('in-view');
                        observer.unobserve(entry.target); // Animate only once
                    }
                });
            }, { threshold: 0.1 }); // Trigger when 10% of the footer is visible
            observer.observe(footer);
        }

        // --- Newsletter form submission animation ---
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevent actual form submission
                this.classList.add('submitted');
                console.log('Newsletter subscription submitted!');
                
                // Reset animation and form after it finishes
                setTimeout(() => {
                    this.classList.remove('submitted');
                    this.reset(); // Clear the input field
                }, 1000);
            });
        }

        // --- Scroll-to-Top button functionality ---
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            // Show or hide the button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            // Smooth scroll to top on click
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // --- Dynamically load the footer HTML into its placeholder ---
    fetch('../html/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch footer HTML.');
            }
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                // After injecting the HTML, initialize all the necessary scripts for the footer.
                initializeFooterScripts();
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });

});
