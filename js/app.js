/**
 * App Module - Main application initialization and coordination
 */

const App = {
  /**
   * Initialize application
   */
  async init() {
    console.log('Initializing Tomzora...');

    // Initialize all modules in order
    Themes.init();
    Search.init();
    Filters.init();
    Favorites.init();
    
    this.initSidebar();
    this.initMobileMenuBtn();
    this.initNavbarToggle();
    this.initUploadButton();
    this.initAttributionToggle();

    // Gallery will initialize itself on load
    console.log('Tomzora initialized successfully');
  },

  /**
   * Initialize sidebar functionality (handles all screen sizes)
   */
  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    const openSidebar = () => {
      sidebar.classList.add('open');
      if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
      if (overlay) overlay.classList.add('active');
    };

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    };

    const toggleSidebar = () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };

    // Hamburger button in the header (mobile)
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
      });
    }

    // Close button inside the sidebar (mobile)
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
      });
    }

    // Clicking the overlay closes the sidebar
    if (overlay) {
      overlay.addEventListener('click', () => {
        closeSidebar();
      });
    }

    // Close sidebar when nav links are clicked on drawer screens
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const view = link.dataset.view;
        this.handleNavigation(view);

        if (window.innerWidth <= 1023) {
          closeSidebar();
        }
      });
    });

    // Clean up drawer state when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023) {
        sidebar.classList.remove('open');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      }
    });
  },

  /**
   * Initialize mobile menu button (no-op — handled by initSidebar)
   */
  initMobileMenuBtn() {
    // All mobile menu button logic is consolidated in initSidebar()
  },

  /**
   * Handle navigation
   * @param {string} view - View name
   */
  handleNavigation(view) {
    const grid = document.getElementById('photo-grid');
    const emptyState = document.getElementById('empty-state');

    switch (view) {
      case 'home':
        Gallery.state.currentQuery = '';
        Gallery.state.currentCategory = null;
        Gallery.state.currentPage = 1;
        Filters.clearCategory();
        Search.clearSearch();
        Gallery.loadPhotos();
        break;

      case 'favorites':
        this.showFavorites();
        break;

      case 'recent':
        this.showRecentViews();
        break;

      case 'downloads':
        this.showDownloads();
        break;
    }
  },

  /**
   * Show favorites view
   */
  showFavorites() {
    const favorites = Favorites.getFavoritesWithData();
    const grid = document.getElementById('photo-grid');
    const emptyState = document.getElementById('empty-state');

    if (favorites.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      emptyState.querySelector('h2').textContent = 'No favorites yet';
      emptyState.querySelector('p').textContent = 'Add photos to your favorites to see them here';
      return;
    }

    emptyState.classList.add('hidden');
    Gallery.state.photos = favorites;
    Gallery.state.currentPage = 1;
    Gallery.render();
  },

  /**
   * Show recent views
   */
  showRecentViews() {
    const recent = Favorites.getRecentViews();
    const grid = document.getElementById('photo-grid');
    const emptyState = document.getElementById('empty-state');

    if (recent.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      emptyState.querySelector('h2').textContent = 'No recent views';
      emptyState.querySelector('p').textContent = 'Photos you view will appear here';
      return;
    }

    emptyState.classList.add('hidden');
    Gallery.state.photos = recent;
    Gallery.state.currentPage = 1;
    Gallery.render();
  },

  /**
   * Show downloads
   */
  showDownloads() {
    const downloads = Favorites.getDownloads();
    const grid = document.getElementById('photo-grid');
    const emptyState = document.getElementById('empty-state');

    if (downloads.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      emptyState.querySelector('h2').textContent = 'No downloads yet';
      emptyState.querySelector('p').textContent = 'Downloaded photos will appear here';
      return;
    }

    emptyState.classList.add('hidden');
    Gallery.state.photos = downloads;
    Gallery.state.currentPage = 1;
    Gallery.render();
  },

  /**
   * Initialize navbar hide/show on scroll
   */
  initNavbarToggle() {
    const header = document.querySelector('.header');
    const contentWrapper = document.querySelector('.content-wrapper');
    let lastScrollTop = 0;
    let isHeaderVisible = true;
    let ticking = false;

    const handleScroll = (scrollTop) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (scrollTop > lastScrollTop && scrollTop > 80) {
          if (isHeaderVisible) {
            header.style.transform = 'translateY(-100%)';
            isHeaderVisible = false;
          }
        } else if (scrollTop < lastScrollTop - 10 || scrollTop <= 80) {
          if (!isHeaderVisible) {
            header.style.transform = 'translateY(0)';
            isHeaderVisible = true;
          }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
      });
    };

    // Listen on window scroll (standard page scroll)
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      handleScroll(scrollTop);
    }, { passive: true });

    // Also listen on content-wrapper in case it's the actual scroll container
    if (contentWrapper) {
      contentWrapper.addEventListener('scroll', () => {
        handleScroll(contentWrapper.scrollTop);
      }, { passive: true });
    }
  },

  /**
   * Initialize upload button
   */
  initUploadButton() {
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('Upload feature coming soon', 'success');
      });
    }
  },

  /**
   * Initialize attribution toggle
   */
  initAttributionToggle() {
    const attributionCheckbox = document.getElementById('show-attribution');
    if (attributionCheckbox) {
      attributionCheckbox.addEventListener('change', () => {
        Gallery.render();
      });
    }
  },

  /**
   * Show toast notification
   * @param {string} message - Message text
   * @param {string} type - Toast type
   */
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}