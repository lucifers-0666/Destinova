// Destinova Footer - Dynamic Loader and Updated Footer Scripts

document.addEventListener('DOMContentLoaded', function () {
  // Adjust path depending on your site's folder structure
  fetch('../html/footer.html')
    .then(response => response.text())
    .then(data => {
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) {
        placeholder.innerHTML = data;
        initializeFooter();
        // Signal footer loaded
        window.dispatchEvent(new CustomEvent('footerLoaded'));
      }
    })
    .catch(error => console.error('Error loading footer:', error));
});

function initializeFooter() {
  // Back to top button logic
  const backToTopButton = document.querySelector('.destinova-back-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Newsletter subscription form for new footer
  const newsletterForm = document.getElementById('footerNewsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput.value) {
        alert(`Thank you for subscribing with ${emailInput.value}!`);
        emailInput.value = '';
      }
    });
  }
}
