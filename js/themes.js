/**
 * Themes Module - Theme management and persistence
 * Handles theme switching and localStorage persistence
 */

const Themes = {
  THEMES: {
    light: { name: 'Light', class: 'light-theme' },
    dark: { name: 'Dark', class: 'dark-theme' },
    sepia: { name: 'Sepia', class: 'sepia-theme' },
    ocean: { name: 'Ocean', class: 'ocean-theme' },
    forest: { name: 'Forest', class: 'forest-theme' },
    sunset: { name: 'Sunset', class: 'sunset-theme' }
  },

  STORAGE_KEY: 'codegallery_theme',

  /**
   * Initialize theme system
   */
  init() {
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme);
    this.bindThemeSelect();
  },

  /**
   * Get saved theme from localStorage
   * @returns {string} Theme name
   */
  getSavedTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved || 'light';
  },

  /**
   * Set theme
   * @param {string} themeName - Theme name
   */
  setTheme(themeName) {
    if (!this.THEMES[themeName]) {
      console.warn(`Unknown theme: ${themeName}`);
      return;
    }

    // Remove all theme classes
    Object.values(this.THEMES).forEach(theme => {
      document.body.classList.remove(theme.class);
    });

    // Add selected theme class
    const theme = this.THEMES[themeName];
    document.body.classList.add(theme.class);

    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, themeName);

    // Update select element
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.value = themeName;
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
  },

  /**
   * Bind theme select element
   */
  bindThemeSelect() {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }
  },

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.getSavedTheme();
  }
};

// Initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Themes.init();
  });
} else {
  Themes.init();
}
