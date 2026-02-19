/**
 * Gallery Module - Render and manage photo grid
 */

const Gallery = {
  state: {
    photos: [],
    currentPage: 1,
    isLoading: false,
    hasMore: true,
    currentQuery: '',
    currentCategory: null,
    viewType: 'masonry'
  },

  elements: {
    grid: null,
    loadingState: null,
    emptyState: null,
    loadMoreBtn: null
  },

  /**
   * Initialize gallery
   */
  async init() {
    this.elements.grid = document.getElementById('photo-grid');
    this.elements.loadingState = document.getElementById('loading-state');
    this.elements.emptyState = document.getElementById('empty-state');
    this.elements.loadMoreBtn = document.getElementById('load-more-btn');

    this.bindViewToggle();
    this.bindLoadMore();
    this.bindInfiniteScroll();
    this.bindLayoutDensity();
    this.bindColumnSettings();

    // Listen for filter changes
    window.addEventListener('filtersChanged', (e) => {
      this.handleFilterChange(e.detail.filters);
    });

    // Listen for search
    window.addEventListener('searchPerformed', (e) => {
      this.handleSearch(e.detail.query);
    });

    window.addEventListener('searchCleared', () => {
      this.handleSearchClear();
    });

    // Load initial photos
    await this.loadPhotos();
  },

  /**
   * Load photos from API
   */
  async loadPhotos() {
    if (this.state.isLoading) return;

    this.state.isLoading = true;
    this.showLoading();

    try {
      let photos;

      if (this.state.currentCategory) {
        // Load by category
        photos = await API.fetchPhotosByTopic(
          this.state.currentCategory,
          this.state.currentPage,
          20
        );
      } else if (this.state.currentQuery) {
        // Load by search
        const filters = Filters.getFilters();
        photos = await API.fetchPhotos({
          query: this.state.currentQuery,
          page: this.state.currentPage,
          perPage: 20,
          orderBy: filters.sort,
          orientation: filters.orientation,
          color: filters.color
        });
      } else {
        // Load default photos
        const filters = Filters.getFilters();
        photos = await API.fetchPhotos({
          page: this.state.currentPage,
          perPage: 20,
          orderBy: filters.sort,
          orientation: filters.orientation,
          color: filters.color
        });
      }

      if (this.state.currentPage === 1) {
        this.state.photos = photos;
      } else {
        this.state.photos = this.state.photos.concat(photos);
      }

      this.state.hasMore = photos.length === 20;
      this.state.isLoading = false;

      this.render();
      this.hideLoading();

      if (this.state.photos.length === 0) {
        this.showEmpty();
      } else {
        this.hideEmpty();
      }
    } catch (error) {
      this.state.isLoading = false;
      this.hideLoading();
      this.showToast(error.message, 'error');
      console.error('Error loading photos:', error);
    }
  },

  /**
   * Render photos to grid
   */
  render() {
    if (!this.elements.grid) return;

    const html = this.state.photos.map(photo => this.createPhotoCard(photo)).join('');
    
    if (this.state.currentPage === 1) {
      this.elements.grid.innerHTML = html;
    } else {
      this.elements.grid.innerHTML += html;
    }

    // Bind card events
    this.bindCardEvents();
  },

  /**
   * Create photo card HTML
   * @param {Object} photo - Photo object
   * @returns {string} HTML string
   */
  createPhotoCard(photo) {
    const isFavorited = Favorites.isFavorited(photo.id);
    const category = photo.tags?.[0]?.title || 'Uncategorized';
    const showAttribution = document.getElementById('show-attribution')?.checked !== false;

    return `
      <div class="photo-card" data-photo-id="${photo.id}">
        <img 
          src="${photo.urls.small}" 
          alt="${photo.alt_description || 'Photo'}"
          class="photo-card-image"
          loading="lazy"
          data-full-url="${photo.urls.full}"
          data-regular-url="${photo.urls.regular}"
        >
        <div class="photo-card-overlay">
          <button class="overlay-icon-btn favorite-icon" title="Add to favorites">
            <svg viewBox="0 0 24 24" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="overlay-icon-btn download-icon" title="Download">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="overlay-icon-btn expand-icon" title="View details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </div>
        <div class="photo-card-category">${this.escapeHtml(category)}</div>
        ${showAttribution ? `
          <div class="photo-card-attribution">
            Photo by <a href="${photo.user.links.html}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(photo.user.name)}</a> on <a href="${photo.links.html}" target="_blank" rel="noopener noreferrer">Unsplash</a>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Bind photo card events
   */
  bindCardEvents() {
    const cards = this.elements.grid.querySelectorAll('.photo-card');
    
    cards.forEach(card => {
      const photoId = card.dataset.photoId;
      const photo = this.state.photos.find(p => p.id === photoId);

      // Favorite button
      card.querySelector('.favorite-icon')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isFavorited = Favorites.toggleFavorite(photoId, photo);
        this.updateFavoriteIcon(card, isFavorited);
        this.showToast(
          isFavorited ? 'Added to favorites' : 'Removed from favorites',
          'success'
        );
      });

      // Download button
      card.querySelector('.download-icon')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.downloadPhoto(photo);
      });

      // Expand button
      card.querySelector('.expand-icon')?.addEventListener('click', (e) => {
        e.stopPropagation();
        Lightbox.open(photo, this.state.photos);
      });

      // Card click
      card.addEventListener('click', () => {
        Lightbox.open(photo, this.state.photos);
      });
    });
  },

  /**
   * Update favorite icon
   * @param {Element} card - Photo card element
   * @param {boolean} isFavorited - Is favorited
   */
  updateFavoriteIcon(card, isFavorited) {
    const icon = card.querySelector('.favorite-icon svg');
    if (icon) {
      if (isFavorited) {
        icon.setAttribute('fill', 'currentColor');
      } else {
        icon.setAttribute('fill', 'none');
      }
    }
  },

  /**
   * Download photo
   * @param {Object} photo - Photo object
   */
  async downloadPhoto(photo) {
    try {
      // Track download
      await API.trackDownload(photo.id);
      
      // Add to downloads history
      Favorites.addDownload(photo);

      // Open image in new tab
      window.open(photo.urls.full, '_blank');
      
      this.showToast('Photo downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading photo:', error);
      this.showToast('Failed to download photo', 'error');
    }
  },

  /**
   * Handle filter changes
   * @param {Object} filters - Filter object
   */
  handleFilterChange(filters) {
    this.state.currentPage = 1;
    this.loadPhotos();
  },

  /**
   * Handle search
   * @param {string} query - Search query
   */
  handleSearch(query) {
    this.state.currentQuery = query;
    this.state.currentCategory = null;
    this.state.currentPage = 1;
    Filters.clearCategory();
    this.loadPhotos();
  },

  /**
   * Handle search clear
   */
  handleSearchClear() {
    this.state.currentQuery = '';
    this.state.currentPage = 1;
    this.loadPhotos();
  },

  /**
   * Bind view toggle buttons
   */
  bindViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from all
        viewBtns.forEach(b => b.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');

        const viewType = btn.dataset.viewType;
        this.setViewType(viewType);
      });
    });
  },

  /**
   * Set view type
   * @param {string} viewType - View type (masonry, grid, list)
   */
  setViewType(viewType) {
    this.state.viewType = viewType;
    
    // Remove all view classes
    this.elements.grid.classList.remove('masonry', 'grid', 'list');
    
    // Add new view class
    this.elements.grid.classList.add(viewType);
  },

  /**
   * Bind load more button
   */
  bindLoadMore() {
    if (this.elements.loadMoreBtn) {
      this.elements.loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.loadMore();
      });
    }
  },

  /**
   * Load more photos
   */
  async loadMore() {
    if (!this.state.hasMore || this.state.isLoading) return;
    
    this.state.currentPage++;
    await this.loadPhotos();
  },

  /**
   * Bind infinite scroll
   */
  bindInfiniteScroll() {
    window.addEventListener('scroll', this.throttle(() => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 500;

      if (scrollPosition >= threshold && this.state.hasMore && !this.state.isLoading) {
        this.loadMore();
      }
    }, 300));
  },

  /**
   * Bind layout density settings
   */
  bindLayoutDensity() {
    const densitySelect = document.getElementById('density-select');
    if (densitySelect) {
      densitySelect.addEventListener('change', (e) => {
        document.body.classList.remove('comfortable', 'compact', 'spacious');
        document.body.classList.add(e.target.value);
      });
    }
  },

  /**
   * Bind column settings
   */
  bindColumnSettings() {
    const columnsSelect = document.getElementById('columns-select');
    if (columnsSelect) {
      columnsSelect.addEventListener('change', (e) => {
        const columns = e.target.value;
        this.elements.grid.style.columnCount = columns;
      });
    }
  },

  /**
   * Show loading state
   */
  showLoading() {
    if (this.state.currentPage === 1 && this.elements.loadingState) {
      this.elements.loadingState.classList.add('active');
    }
  },

  /**
   * Hide loading state
   */
  hideLoading() {
    if (this.elements.loadingState) {
      this.elements.loadingState.classList.remove('active');
    }
  },

  /**
   * Show empty state
   */
  showEmpty() {
    if (this.elements.emptyState) {
      this.elements.emptyState.classList.remove('hidden');
    }
  },

  /**
   * Hide empty state
   */
  hideEmpty() {
    if (this.elements.emptyState) {
      this.elements.emptyState.classList.add('hidden');
    }
  },

  /**
   * Show toast notification
   * @param {string} message - Message text
   * @param {string} type - Toast type (success, error)
   */
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} delay - Delay in ms
   * @returns {Function} Throttled function
   */
  throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }
};

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Gallery.init();
  });
} else {
  Gallery.init();
}
