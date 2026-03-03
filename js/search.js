/**
 * Search Module - Search functionality with debouncing and history
 */

const Search = {
  STORAGE_KEY: 'codegallery_search_history',
  MAX_HISTORY: 5,
  DEBOUNCE_DELAY: 300,
  debounceTimer: null,
  currentQuery: '',

  /**
   * Initialize search module
   */
  init() {
    this.bindSearchInput();
  },

  /**
   * Bind search input events
   */
  bindSearchInput() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      this.handleSearchInput(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
      this.showSuggestions();
    });

    // Close suggestions on blur
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        this.hideSuggestions();
      }, 200);
    });

    // Handle suggestion clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.suggestion-item')) {
        const query = e.target.textContent.trim();
        searchInput.value = query;
        this.performSearch(query);
        this.hideSuggestions();
      }
    });

    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch(searchInput.value);
        this.hideSuggestions();
      }
    });
  },

  /**
   * Handle search input with debouncing
   * @param {string} query - Search query
   */
  handleSearchInput(query) {
    clearTimeout(this.debounceTimer);
    this.currentQuery = query;

    if (query.length === 0) {
      this.showSuggestions();
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, this.DEBOUNCE_DELAY);
  },

  /**
   * Perform search
   * @param {string} query - Search query
   */
  performSearch(query) {
    if (!query.trim()) {
      window.dispatchEvent(new CustomEvent('searchCleared'));
      return;
    }

    this.addToHistory(query);
    window.dispatchEvent(new CustomEvent('searchPerformed', { detail: { query } }));
  },

  /**
   * Get search history
   * @returns {Array<string>} Search history
   */
  getHistory() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Add query to search history
   * @param {string} query - Search query
   */
  addToHistory(query) {
    const history = this.getHistory();
    
    // Remove if already exists
    const index = history.indexOf(query);
    if (index > -1) {
      history.splice(index, 1);
    }

    // Add to beginning
    history.unshift(query);

    // Keep only max items
    if (history.length > this.MAX_HISTORY) {
      history.pop();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  },

  /**
   * Clear search history
   */
  clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  /**
   * Show search suggestions
   */
  showSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    const history = this.getHistory();
    
    if (history.length === 0) {
      suggestionsContainer.classList.remove('active');
      return;
    }

    suggestionsContainer.innerHTML = history
      .map(query => `<div class="suggestion-item">${this.escapeHtml(query)}</div>`)
      .join('');

    suggestionsContainer.classList.add('active');
  },

  /**
   * Hide search suggestions
   */
  hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.classList.remove('active');
    }
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
   * Get current search query
   * @returns {string} Current query
   */
  getCurrentQuery() {
    const searchInput = document.getElementById('search-input');
    return searchInput ? searchInput.value : '';
  },

  /**
   * Clear search input
   */
  clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    this.hideSuggestions();
  }
};

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Search.init();
  });
} else {
  Search.init();
}
