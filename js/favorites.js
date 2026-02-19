/**
 * Favorites Module - Manage favorite photos with localStorage
 */

const Favorites = {
  STORAGE_KEY: 'codegallery_favorites',
  RECENT_VIEWS_KEY: 'codegallery_recent_views',
  DOWNLOADS_KEY: 'codegallery_downloads',
  MAX_RECENT_VIEWS: 10,
  MAX_DOWNLOADS: 20,

  /**
   * Get all favorite photo IDs
   * @returns {Array<string>} Array of photo IDs
   */
  getFavorites() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Get all favorite photos with full data
   * @returns {Array<Object>} Array of photo objects
   */
  getFavoritesWithData() {
    const stored = localStorage.getItem(this.STORAGE_KEY + '_data');
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Check if photo is favorited
   * @param {string} photoId - Photo ID
   * @returns {boolean}
   */
  isFavorited(photoId) {
    return this.getFavorites().includes(photoId);
  },

  /**
   * Add photo to favorites
   * @param {string} photoId - Photo ID
   * @param {Object} photoData - Full photo object
   */
  addFavorite(photoId, photoData) {
    const favorites = this.getFavorites();
    if (!favorites.includes(photoId)) {
      favorites.push(photoId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));

      // Store full photo data
      const favoritesData = this.getFavoritesWithData();
      favoritesData.push(photoData);
      localStorage.setItem(this.STORAGE_KEY + '_data', JSON.stringify(favoritesData));

      window.dispatchEvent(new CustomEvent('favoriteAdded', { detail: { photoId } }));
    }
  },

  /**
   * Remove photo from favorites
   * @param {string} photoId - Photo ID
   */
  removeFavorite(photoId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(photoId);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));

      // Remove from data storage
      const favoritesData = this.getFavoritesWithData();
      const dataIndex = favoritesData.findIndex(p => p.id === photoId);
      if (dataIndex > -1) {
        favoritesData.splice(dataIndex, 1);
        localStorage.setItem(this.STORAGE_KEY + '_data', JSON.stringify(favoritesData));
      }

      window.dispatchEvent(new CustomEvent('favoriteRemoved', { detail: { photoId } }));
    }
  },

  /**
   * Toggle favorite status
   * @param {string} photoId - Photo ID
   * @param {Object} photoData - Full photo object
   * @returns {boolean} New favorite status
   */
  toggleFavorite(photoId, photoData) {
    if (this.isFavorited(photoId)) {
      this.removeFavorite(photoId);
      return false;
    } else {
      this.addFavorite(photoId, photoData);
      return true;
    }
  },

  /**
   * Get recent views
   * @returns {Array<Object>} Array of photo objects
   */
  getRecentViews() {
    const stored = localStorage.getItem(this.RECENT_VIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Add photo to recent views
   * @param {Object} photoData - Full photo object
   */
  addRecentView(photoData) {
    const recent = this.getRecentViews();
    
    // Remove if already exists
    const index = recent.findIndex(p => p.id === photoData.id);
    if (index > -1) {
      recent.splice(index, 1);
    }

    // Add to beginning
    recent.unshift(photoData);

    // Keep only max items
    if (recent.length > this.MAX_RECENT_VIEWS) {
      recent.pop();
    }

    localStorage.setItem(this.RECENT_VIEWS_KEY, JSON.stringify(recent));
  },

  /**
   * Get downloads
   * @returns {Array<Object>} Array of photo objects
   */
  getDownloads() {
    const stored = localStorage.getItem(this.DOWNLOADS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Add photo to downloads
   * @param {Object} photoData - Full photo object
   */
  addDownload(photoData) {
    const downloads = this.getDownloads();
    
    // Remove if already exists
    const index = downloads.findIndex(p => p.id === photoData.id);
    if (index > -1) {
      downloads.splice(index, 1);
    }

    // Add to beginning with timestamp
    downloads.unshift({
      ...photoData,
      downloadedAt: new Date().toISOString()
    });

    // Keep only max items
    if (downloads.length > this.MAX_DOWNLOADS) {
      downloads.pop();
    }

    localStorage.setItem(this.DOWNLOADS_KEY, JSON.stringify(downloads));
    window.dispatchEvent(new CustomEvent('photoDownloaded', { detail: { photoId: photoData.id } }));
  },

  /**
   * Clear all data
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY + '_data');
    localStorage.removeItem(this.RECENT_VIEWS_KEY);
    localStorage.removeItem(this.DOWNLOADS_KEY);
  }
};
