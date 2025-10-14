/* ============================================= */
/* TRAVEL INSPIRATION & BLOG SECTION - JAVASCRIPT */
/* ============================================= */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🌍 Travel Blog Section initialized');

  // ========================================
  // 1. CATEGORY FILTER FUNCTIONALITY
  // ========================================
  
  const categoryButtons = document.querySelectorAll('.blog-category-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  
  if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter cards with smooth animation
        blogCards.forEach((card, index) => {
          const cardCategory = card.getAttribute('data-category');
          
          if (category === 'all' || cardCategory === category) {
            // Show card with stagger animation
            setTimeout(() => {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }, 10);
            }, index * 50);
          } else {
            // Hide card
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
        
        // Update article count
        updateArticleCount();
        
        console.log(`📂 Filtered by category: ${category}`);
      });
    });
  }

  // ========================================
  // 2. SEARCH FUNCTIONALITY
  // ========================================
  
  const searchInput = document.getElementById('blogSearchInput');
  const searchClear = document.getElementById('blogSearchClear');
  
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      // Show/hide clear button
      if (searchClear) {
        searchClear.style.display = searchTerm ? 'block' : 'none';
      }
      
      // Debounce search
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
    });
    
    // Clear search
    if (searchClear) {
      searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        performSearch('');
        searchInput.focus();
      });
    }
  }
  
  function performSearch(searchTerm) {
    let visibleCount = 0;
    
    blogCards.forEach((card, index) => {
      const title = card.querySelector('.blog-card-title, .blog-card-title-large');
      const excerpt = card.querySelector('.blog-card-excerpt, .blog-card-excerpt-large');
      const category = card.querySelector('.blog-card-category-badge, .blog-card-category-tag');
      
      const titleText = title ? title.textContent.toLowerCase() : '';
      const excerptText = excerpt ? excerpt.textContent.toLowerCase() : '';
      const categoryText = category ? category.textContent.toLowerCase() : '';
      
      const matches = titleText.includes(searchTerm) || 
                     excerptText.includes(searchTerm) || 
                     categoryText.includes(searchTerm);
      
      if (searchTerm === '' || matches) {
        setTimeout(() => {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        }, index * 30);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Show no results message
    showNoResultsMessage(visibleCount, searchTerm);
    updateArticleCount();
    
    console.log(`🔍 Search: "${searchTerm}" - ${visibleCount} results`);
  }
  
  function showNoResultsMessage(count, searchTerm) {
    const grid = document.getElementById('blogArticlesGrid');
    let noResultsMsg = document.getElementById('blogNoResults');
    
    if (count === 0 && searchTerm) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'blogNoResults';
        noResultsMsg.style.cssText = `
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #5C6B73;
          font-family: 'Poppins', sans-serif;
        `;
        noResultsMsg.innerHTML = `
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 20px; opacity: 0.3;">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h3 style="font-size: 24px; font-weight: 600; color: #1C2526; margin-bottom: 12px;">No articles found</h3>
          <p style="font-size: 16px; color: #8B9BA5;">Try different keywords or browse all categories</p>
        `;
        grid.appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // ========================================
  // 3. BOOKMARK FUNCTIONALITY
  // ========================================
  
  const bookmarkButtons = document.querySelectorAll('.blog-bookmark-btn');
  
  // Load saved bookmarks from localStorage
  const savedBookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
  
  bookmarkButtons.forEach(button => {
    const card = button.closest('.blog-card');
    const articleTitle = card.querySelector('.blog-card-title, .blog-card-title-large')?.textContent;
    
    // Check if already bookmarked
    if (savedBookmarks.includes(articleTitle)) {
      button.classList.add('bookmarked');
      button.querySelector('svg').style.fill = '#1d5e33';
    }
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isBookmarked = this.classList.toggle('bookmarked');
      const svg = this.querySelector('svg');
      
      // Animate bookmark
      this.style.transform = 'scale(0.8)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      if (isBookmarked) {
        svg.style.fill = '#1d5e33';
        savedBookmarks.push(articleTitle);
        showToast('Article bookmarked! 📚');
      } else {
        svg.style.fill = 'none';
        const index = savedBookmarks.indexOf(articleTitle);
        if (index > -1) savedBookmarks.splice(index, 1);
        showToast('Bookmark removed');
      }
      
      // Save to localStorage
      localStorage.setItem('blogBookmarks', JSON.stringify(savedBookmarks));
      
      console.log(`🔖 Bookmark toggled: ${articleTitle}`);
    });
  });

  // ========================================
  // 4. NEWSLETTER FORM
  // ========================================
  
  const newsletterForm = document.getElementById('blogNewsletterForm');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('.blog-newsletter-input');
      const submitBtn = this.querySelector('.blog-newsletter-btn');
      const successMsg = this.nextElementSibling;
      const email = emailInput.value;
      
      if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
      }
      
      // Disable form
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      
      // Simulate API call
      setTimeout(() => {
        // Hide form, show success
        this.style.display = 'none';
        successMsg.style.display = 'flex';
        
        // Save to localStorage
        const subscribers = JSON.parse(localStorage.getItem('blogSubscribers') || '[]');
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('blogSubscribers', JSON.stringify(subscribers));
        }
        
        showToast('Successfully subscribed! 🎉');
        console.log(`📧 Newsletter subscription: ${email}`);
        
        // Reset after 5 seconds
        setTimeout(() => {
          this.style.display = 'flex';
          successMsg.style.display = 'none';
          emailInput.value = '';
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Subscribe <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        }, 5000);
      }, 1500);
    });
  }

  // ========================================
  // 5. LOAD MORE FUNCTIONALITY
  // ========================================
  
  const loadMoreBtn = document.getElementById('blogLoadMoreBtn');
  const articlesCountSpan = document.getElementById('blogArticlesCount');
  const totalCountSpan = document.getElementById('blogTotalCount');
  
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      const btn = this;
      const icon = btn.querySelector('.blog-load-more-icon');
      const text = btn.querySelector('.blog-load-more-text');
      
      // Start loading
      btn.classList.add('loading');
      btn.disabled = true;
      text.textContent = 'Loading...';
      
      // Simulate loading more articles
      setTimeout(() => {
        const currentCount = parseInt(articlesCountSpan.textContent);
        const newCount = Math.min(currentCount + 12, parseInt(totalCountSpan.textContent));
        
        // Update count with animation
        animateValue(articlesCountSpan, currentCount, newCount, 600);
        
        // Stop loading
        btn.classList.remove('loading');
        btn.disabled = false;
        text.textContent = 'Load More Stories';
        
        // Hide button if all loaded
        if (newCount >= parseInt(totalCountSpan.textContent)) {
          btn.style.display = 'none';
          showToast('All articles loaded! 🎊');
        }
        
        console.log(`📄 Loaded more articles: ${newCount}/${totalCountSpan.textContent}`);
      }, 1500);
    });
  }

  // ========================================
  // 6. READING PROGRESS BAR (on hover)
  // ========================================
  
  blogCards.forEach(card => {
    const readTimeElement = card.querySelector('.blog-metadata-item');
    let progressBar = card.querySelector('.blog-reading-progress');
    
    if (readTimeElement && !progressBar) {
      // Create progress bar
      progressBar = document.createElement('div');
      progressBar.className = 'blog-reading-progress';
      progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        width: 0;
        background: linear-gradient(90deg, #1d5e33, #2a7d4a);
        transition: width 3s ease;
        z-index: 3;
      `;
      card.appendChild(progressBar);
    }
    
    card.addEventListener('mouseenter', function() {
      if (progressBar) {
        progressBar.style.width = '100%';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (progressBar) {
        progressBar.style.width = '0';
      }
    });
  });

  // ========================================
  // 7. LAZY LOADING IMAGES
  // ========================================
  
  const blogImages = document.querySelectorAll('.blog-card-image');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Add loading state
        img.style.opacity = '0.5';
        img.style.filter = 'blur(10px)';
        
        // Simulate image loading
        const tempImg = new Image();
        tempImg.src = img.src;
        tempImg.onload = () => {
          img.style.opacity = '1';
          img.style.filter = 'blur(0)';
          img.style.transition = 'all 0.6s ease';
        };
        
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });
  
  blogImages.forEach(img => imageObserver.observe(img));

  // ========================================
  // 8. VIEW COUNTER ANIMATION
  // ========================================
  
  const viewCounters = document.querySelectorAll('.blog-views-count span, .blog-metadata-item');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.textContent;
        
        // Check if it's a view count (contains K)
        if (text.includes('K') && text.match(/\d/)) {
          const match = text.match(/([\d.]+)K/);
          if (match) {
            const value = parseFloat(match[1]);
            animateViewCount(element, value, text);
          }
        }
        
        counterObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });
  
  viewCounters.forEach(counter => counterObserver.observe(counter));
  
  function animateViewCount(element, endValue, originalText) {
    let startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = (startValue + (endValue - startValue) * progress).toFixed(1);
      element.textContent = originalText.replace(/[\d.]+/, currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // ========================================
  // 9. ARTICLE CLICK TRACKING
  // ========================================
  
  blogCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking bookmark button
      if (e.target.closest('.blog-bookmark-btn')) return;
      
      const title = this.querySelector('.blog-card-title, .blog-card-title-large')?.textContent;
      console.log(`📖 Article clicked: ${title}`);
      
      // Track in localStorage
      const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
      const articleData = {
        title: title,
        timestamp: new Date().toISOString()
      };
      
      viewedArticles.unshift(articleData);
      // Keep only last 10
      if (viewedArticles.length > 10) viewedArticles.pop();
      
      localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
      
      // Simulate navigation (you can replace with actual URL)
      showToast(`Opening: ${title}`);
    });
  });

  // ========================================
  // 10. TRENDING TOPICS CLICK
  // ========================================
  
  const trendingItems = document.querySelectorAll('.blog-trending-item');
  
  trendingItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const topic = this.querySelector('.blog-trending-name').textContent;
      
      // Set search to topic
      if (searchInput) {
        searchInput.value = topic;
        performSearch(topic.toLowerCase());
        
        // Scroll to grid
        document.getElementById('blogArticlesGrid')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
      
      console.log(`🔥 Trending topic clicked: ${topic}`);
    });
  });

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  function updateArticleCount() {
    const visibleCards = Array.from(blogCards).filter(card => 
      card.style.display !== 'none' && card.offsetParent !== null
    );
    
    if (articlesCountSpan) {
      articlesCountSpan.textContent = visibleCards.length;
    }
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const value = Math.floor(start + (end - start) * progress);
      element.textContent = value;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.blog-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'blog-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      padding: 16px 24px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #164426, #1d5e33)' : '#dc2626'};
      color: #ffffff;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: toastSlideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  // Add toast animations to document
  if (!document.getElementById('blogToastStyles')) {
    const style = document.createElement('style');
    style.id = 'blogToastStyles';
    style.textContent = `
      @keyframes toastSlideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes toastSlideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize article count
  updateArticleCount();
  
  console.log('✅ Travel Blog Section fully initialized');
  console.log(`📊 Total articles: ${blogCards.length}`);
  console.log(`🔖 Saved bookmarks: ${savedBookmarks.length}`);
});
