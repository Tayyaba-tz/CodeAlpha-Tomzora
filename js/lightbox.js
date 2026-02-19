/**
 * Lightbox Module - Full-screen photo viewer with navigation
 */

const Lightbox = {
  state: {
    isOpen: false,
    currentPhoto: null,
    photos: [],
    currentIndex: 0
  },

  elements: {
    lightbox: null,
    image: null,
    overlay: null,
    container: null,
    closeBtn: null,
    prevBtn: null,
    nextBtn: null,
    favoriteBtn: null,
    downloadBtn: null,
    copyLinkBtn: null
  },

  /**
   * Initialize lightbox
   */
  init() {
    this.elements.lightbox = document.getElementById('lightbox');
    this.elements.image = document.getElementById('lightbox-image');
    this.elements.overlay = document.querySelector('.lightbox-overlay');
    this.elements.container = document.querySelector('.lightbox-container');
    this.elements.closeBtn = document.querySelector('.lightbox-close');
    this.elements.prevBtn = document.querySelector('.lightbox-nav.prev');
    this.elements.nextBtn = document.querySelector('.lightbox-nav.next');
    this.elements.favoriteBtn = document.getElementById('favorite-btn');
    this.elements.downloadBtn = document.getElementById('download-btn');
    this.elements.copyLinkBtn = document.getElementById('copy-link-btn');

    this.bindEvents();
  },

  /**
   * Bind lightbox events
   */
  bindEvents() {
    // Close button
    this.elements.closeBtn?.addEventListener('click', () => this.close());

    // Overlay click
    this.elements.overlay?.addEventListener('click', () => this.close());

    // Navigation
    this.elements.prevBtn?.addEventListener('click', () => this.prev());
    this.elements.nextBtn?.addEventListener('click', () => this.next());

    // Actions
    this.elements.favoriteBtn?.addEventListener('click', () => this.toggleFavorite());
    this.elements.downloadBtn?.addEventListener('click', () => this.download());
    this.elements.copyLinkBtn?.addEventListener('click', () => this.copyLink());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.state.isOpen) return;

      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    });
  },

  /**
   * Open lightbox with photo
   * @param {Object} photo - Photo object
   * @param {Array} photos - All photos in gallery
   */
  open(photo, photos = []) {
    this.state.currentPhoto = photo;
    this.state.photos = photos;
    this.state.currentIndex = photos.findIndex(p => p.id === photo.id);
    this.state.isOpen = true;

    // Add to recent views
    Favorites.addRecentView(photo);

    // Show lightbox
    this.elements.lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Render content
    this.render();
  },

  /**
   * Close lightbox
   */
  close() {
    this.state.isOpen = false;
    this.elements.lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  },

  /**
   * Navigate to previous photo
   */
  prev() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.state.currentPhoto = this.state.photos[this.state.currentIndex];
      this.render();
    }
  },

  /**
   * Navigate to next photo
   */
  next() {
    if (this.state.currentIndex < this.state.photos.length - 1) {
      this.state.currentIndex++;
      this.state.currentPhoto = this.state.photos[this.state.currentIndex];
      this.render();
    }
  },

  /**
   * Render lightbox content
   */
  render() {
    const photo = this.state.currentPhoto;
    if (!photo) return;

    // Update image
    this.elements.image.src = photo.urls.full;
    this.elements.image.alt = photo.alt_description || 'Photo';

    // Update photographer info
    document.getElementById('photographer-avatar').src = photo.user.profile_image.medium;
    document.querySelector('.photographer-name').textContent = photo.user.name;
    document.querySelector('.photo-date').textContent = new Date(photo.created_at).toLocaleDateString();

    // Update stats
    document.getElementById('likes-number').textContent = this.formatNumber(photo.likes);
    document.getElementById('dimensions-text').textContent = `${photo.width}×${photo.height}`;

    // Update description
    const description = document.getElementById('photo-description');
    description.textContent = photo.description || photo.alt_description || 'No description available';

    // Update favorite button
    this.updateFavoriteButton();

    // Update navigation buttons
    this.elements.prevBtn.style.opacity = this.state.currentIndex > 0 ? '1' : '0.5';
    this.elements.prevBtn.style.pointerEvents = this.state.currentIndex > 0 ? 'auto' : 'none';

    this.elements.nextBtn.style.opacity = this.state.currentIndex < this.state.photos.length - 1 ? '1' : '0.5';
    this.elements.nextBtn.style.pointerEvents = this.state.currentIndex < this.state.photos.length - 1 ? 'auto' : 'none';
  },

  /**
   * Update favorite button state
   */
  updateFavoriteButton() {
    const isFavorited = Favorites.isFavorited(this.state.currentPhoto.id);
    
    if (isFavorited) {
      this.elements.favoriteBtn.classList.add('active');
      this.elements.favoriteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Favorited</span>
      `;
    } else {
      this.elements.favoriteBtn.classList.remove('active');
      this.elements.favoriteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Favorite</span>
      `;
    }
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite() {
    const photo = this.state.currentPhoto;
    Favorites.toggleFavorite(photo.id, photo);
    this.updateFavoriteButton();
  },

  /**
   * Download photo
   */
  async download() {
    try {
      const photo = this.state.currentPhoto;
      
      // Track download
      await API.trackDownload(photo.id);
      
      // Add to downloads
      Favorites.addDownload(photo);

      // Open in new tab
      window.open(photo.urls.full, '_blank');

      this.showToast('Photo downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading photo:', error);
      this.showToast('Failed to download photo', 'error');
    }
  },

  /**
   * Copy photo link to clipboard
   */
  copyLink() {
    const photo = this.state.currentPhoto;
    const link = photo.links.html;

    navigator.clipboard.writeText(link).then(() => {
      this.showToast('Link copied to clipboard', 'success');
    }).catch(err => {
      console.error('Failed to copy link:', err);
      this.showToast('Failed to copy link', 'error');
    });
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
  },

  /**
   * Format large numbers
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
};

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Lightbox.init();
  });
} else {
  Lightbox.init();
}
