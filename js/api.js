/**
 * API Module - Unsplash API Integration
 * Handles all API calls to Unsplash service
 */

const API = {
  ACCESS_KEY: 'Z-xg3GctfpW3TwRsuNt-JpTABEZysUwAfr7PsXVNkmE',
  BASE_URL: 'https://api.unsplash.com',
  
  /**
   * Fetch photos from Unsplash
   * @param {Object} options - Query options
   * @param {string} options.query - Search query
   * @param {number} options.page - Page number
   * @param {number} options.perPage - Items per page
   * @param {string} options.orderBy - Sort order (latest, oldest, popular)
   * @param {string} options.orientation - Image orientation (landscape, portrait, squarish)
   * @param {string} options.color - Color filter
   * @returns {Promise<Array>} Array of photo objects
   */
  async fetchPhotos(options = {}) {
    const {
      query = '',
      page = 1,
      perPage = 20,
      orderBy = 'latest',
      orientation = '',
      color = ''
    } = options;

    try {
      let endpoint;
      let params = new URLSearchParams({
        client_id: this.ACCESS_KEY,
        page,
        per_page: perPage
      });

      if (query) {
        // Search endpoint
        params.append('query', query);
        if (orientation) params.append('orientation', orientation);
        if (color) params.append('color', color);
        endpoint = `${this.BASE_URL}/search/photos?${params}`;
      } else {
        // List photos endpoint
        params.append('order_by', orderBy);
        if (orientation) params.append('orientation', orientation);
        endpoint = `${this.BASE_URL}/photos?${params}`;
      }

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Return results array for search, or data array for list
      return query ? (data.results || []) : (data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  /**
   * Fetch photos by topic/category
   * @param {string} topicSlug - Topic slug (nature, architecture, etc.)
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<Array>} Array of photo objects
   */
  async fetchPhotosByTopic(topicSlug, page = 1, perPage = 20) {
    try {
      const params = new URLSearchParams({
        client_id: this.ACCESS_KEY,
        page,
        per_page: perPage,
        order_by: 'latest'
      });

      const endpoint = `${this.BASE_URL}/topics/${topicSlug}/photos?${params}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching photos for topic ${topicSlug}:`, error);
      throw error;
    }
  },

  /**
   * Get a random photo
   * @returns {Promise<Object>} Photo object
   */
  async fetchRandomPhoto() {
    try {
      const params = new URLSearchParams({
        client_id: this.ACCESS_KEY
      });

      const endpoint = `${this.BASE_URL}/photos/random?${params}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching random photo:', error);
      throw error;
    }
  },

  /**
   * Track photo download
   * @param {string} photoId - Photo ID
   * @returns {Promise<Object>} Download tracking response
   */
  async trackDownload(photoId) {
    try {
      const params = new URLSearchParams({
        client_id: this.ACCESS_KEY
      });

      const endpoint = `${this.BASE_URL}/photos/${photoId}/download?${params}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        console.warn(`Failed to track download for photo ${photoId}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error tracking download:', error);
      // Don't throw - download tracking is not critical
    }
  },

  /**
   * Get photo details
   * @param {string} photoId - Photo ID
   * @returns {Promise<Object>} Photo object with details
   */
  async getPhotoDetails(photoId) {
    try {
      const params = new URLSearchParams({
        client_id: this.ACCESS_KEY
      });

      const endpoint = `${this.BASE_URL}/photos/${photoId}?${params}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching details for photo ${photoId}:`, error);
      throw error;
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}
