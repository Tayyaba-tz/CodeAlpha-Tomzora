/**
 * App Module - Main application initialization and coordination
 */

const App = {
  /**
   * Initialize application
   */
  async init() {
    console.log('Initializing Tomzora...');

    // Initialize all modules
    this.initSidebar();
    this.initNavbarToggle();
    this.initUploadButton();
    this.initAttributionToggle();

    // Gallery will initialize itself on load
    console.log('Tomzora initialized successfully');
  },

  /**
   * Initialize sidebar functionality
   */
  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sidebarToggle) return;

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from all
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked
        link.classList.add('active');

        const view = link.dataset.view;
        this.handleNavigation(view);

        // Close sidebar on mobile
        if (window.innerWidth <= 767) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
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
   * Initialize navbar hide/show toggle
   */
  initNavbarToggle() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let isHeaderVisible = true;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide header
        if (isHeaderVisible) {
          header.style.transform = 'translateY(-100%)';
          isHeaderVisible = false;
        }
      } else {
        // Scrolling up - show header
        if (!isHeaderVisible) {
          header.style.transform = 'translateY(0)';
          isHeaderVisible = true;
        }
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
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
