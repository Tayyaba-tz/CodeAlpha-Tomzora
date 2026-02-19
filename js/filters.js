/**
 * Filters Module - Manage gallery filters and categories
 */

const Filters = {
  state: {
    orientation: '',
    color: '',
    sort: 'latest',
    category: null
  },

  /**
   * Initialize filters
   */
  init() {
    this.bindCategoryButtons();
    this.bindFilterButtons();
    this.bindColorSwatches();
  },

  /**
   * Bind category buttons
   */
  bindCategoryButtons() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all
        categoryBtns.forEach(b => b.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');
        
        const topic = btn.dataset.topic;
        this.setCategory(topic);
      });
    });
  },

  /**
   * Bind filter buttons
   */
  bindFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const filterType = btn.dataset.filter;
        const filterValue = btn.dataset.value;

        // Get all buttons of same type
        const sameBtns = document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`);
        
        // Remove active from all same type
        sameBtns.forEach(b => b.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');

        // Update state
        if (filterType === 'orientation') {
          this.setOrientation(filterValue);
        } else if (filterType === 'sort') {
          this.setSort(filterValue);
        }
      });
    });
  },

  /**
   * Bind color swatches
   */
  bindColorSwatches() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from all
        colorSwatches.forEach(s => s.classList.remove('active'));
        
        // Add active to clicked
        swatch.classList.add('active');
        
        const color = swatch.dataset.color;
        this.setColor(color);
      });
    });
  },

  /**
   * Set orientation filter
   * @param {string} orientation - Orientation value
   */
  setOrientation(orientation) {
    this.state.orientation = orientation;
    this.triggerFilterChange();
  },

  /**
   * Set color filter
   * @param {string} color - Color value
   */
  setColor(color) {
    this.state.color = color;
    this.triggerFilterChange();
  },

  /**
   * Set sort order
   * @param {string} sort - Sort value
   */
  setSort(sort) {
    this.state.sort = sort;
    this.triggerFilterChange();
  },

  /**
   * Set category/topic
   * @param {string} category - Category slug
   */
  setCategory(category) {
    this.state.category = category;
    this.triggerFilterChange();
  },

  /**
   * Clear category
   */
  clearCategory() {
    this.state.category = null;
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.triggerFilterChange();
  },

  /**
   * Get current filters
   * @returns {Object} Current filter state
   */
  getFilters() {
    return { ...this.state };
  },

  /**
   * Reset all filters
   */
  reset() {
    this.state = {
      orientation: '',
      color: '',
      sort: 'latest',
      category: null
    };

    // Reset UI
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.remove('active');
    });

    // Reset to default active states
    document.querySelector('.filter-btn[data-filter="orientation"][data-value=""]')?.classList.add('active');
    document.querySelector('.filter-btn[data-filter="sort"][data-value="latest"]')?.classList.add('active');

    this.triggerFilterChange();
  },

  /**
   * Trigger filter change event
   */
  triggerFilterChange() {
    window.dispatchEvent(new CustomEvent('filtersChanged', { 
      detail: { filters: this.getFilters() } 
    }));
  }
};

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Filters.init();
  });
} else {
  Filters.init();
}
