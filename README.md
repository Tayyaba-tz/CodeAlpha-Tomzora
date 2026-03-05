# Tomzora - Image Gallery Application

A modern, responsive image gallery application built with vanilla HTML5, CSS3, and JavaScript ES6. Browse, search, filter, and manage beautiful photos from Unsplash with an elegant user interface and multiple theme options.

##  Features

### Core Functionality
- **Photo Gallery** - Browse thousands of high-quality images from Unsplash
- **Multiple View Modes** - Switch between Masonry, Grid, and List layouts
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Infinite Scroll** - Automatically load more photos as you scroll
- **Search Functionality** - Real-time search with debouncing and history suggestions
- **Category Filtering** - Browse by 10 different topics (Nature, Architecture, Travel, Food, Technology, Fashion, Animals, Abstract, People, Business)

### Advanced Features
- **6 Theme System** - Choose from diverse color schemes:
  - **Light** - Warm Cream & Coral
  - **Dark** - Deep Purple & Gold
  - **Sepia** - Vintage Brown & Cream
  - **Ocean** - Deep Teal & Aqua
  - **Forest** - Emerald & Sage
  - **Sunset** - Vibrant Orange & Deep Purple

- **Photo Management**
  - Add photos to Favorites
  - View Recently Viewed photos
  - Track Download History
  - Proper photographer attribution

- **Filtering Options**
  - Filter by orientation (Landscape, Portrait, Square)
  - Filter by color (12 color options)
  - Sort by Latest, Oldest, or Popular
  - Combine multiple filters

- **Grid Customization**
  - Adjust grid columns (2, 3, 4, or 5 columns)
  - Choose layout density (Comfortable, Compact, Spacious)
  - Toggle attribution display

- **User Experience**
  - Smooth animations and transitions
  - Auto-hiding header on scroll
  - Toast notifications
  - Loading states and empty states
  - Keyboard navigation support
  - Accessibility features (ARIA labels)

##  Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Unsplash API)
- No server or build tools required

##  Getting Started

### Installation

1. **Extract the zip file**
   ```bash
   unzip Tomzora-source.zip
   cd client
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js http-server
     npx http-server
     ```

3. **Access the application**
   - Open `http://localhost:8000` in your browser

##  Configuration

### API Key
The application uses the Unsplash API. To use your own API key:

1. Get a free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Open `js/api.js`
3. Replace the API key in the `API` object:
   ```javascript
   const API = {
     baseURL: 'https://api.unsplash.com',
     accessKey: 'YOUR_API_KEY_HERE'
   };
   ```

### Customization

**Change Default Theme:**
- Edit `js/themes.js` and modify the `defaultTheme` value
- Options: `'light'`, `'dark'`, `'sepia'`, `'ocean'`, `'forest'`, `'sunset'`

**Modify Grid Columns:**
- Edit `css/styles.css` and change the `grid-template-columns` value in `.photo-grid.grid`

**Adjust Colors:**
- Edit `css/styles.css` and modify CSS custom properties in the theme sections

## 📱 Usage Guide

### Browsing Photos
1. **View Gallery** - Photos load automatically on page load
2. **Scroll Down** - More photos load as you scroll
3. **Click Photo** - Opens full-screen lightbox viewer

### Searching
1. **Enter Search Term** - Type in the search box at the top
2. **View Suggestions** - Previous searches appear as you type
3. **Press Enter** - Performs the search

### Filtering
1. **Select Category** - Click a category button in the sidebar
2. **Choose Orientation** - Filter by Landscape, Portrait, or Square
3. **Pick Color** - Select from 12 color options
4. **Sort Results** - Choose Latest, Oldest, or Popular

### Customization
1. **Change Theme** - Select from the Theme dropdown
2. **Adjust Grid** - Choose number of columns
3. **Set Density** - Select layout density (Comfortable, Compact, Spacious)
4. **Toggle Attribution** - Show/hide photographer credits

### Managing Photos
1. **Add to Favorites** - Click the heart icon on any photo
2. **View Favorites** - Click "Favorites" in the sidebar
3. **Check Recent Views** - Click "Recent Views" in the sidebar
4. **View Downloads** - Click "Downloads" in the sidebar
5. **Download Photo** - Click the download icon on any photo

### Lightbox Controls
- **Next/Previous** - Use arrow buttons or keyboard arrows
- **Close** - Click X button or press Escape
- **Download** - Click download button
- **Add to Favorites** - Click heart icon
- **View Details** - Photographer info and photo metadata

##  Theme Details

### Light Theme (Warm Cream & Coral)
- Background: Warm cream (#FEF7F3)
- Accent: Coral (#E07856)
- Perfect for daytime viewing

### Dark Theme (Deep Purple & Gold)
- Background: Deep purple (#1A1428)
- Accent: Gold (#FFD700)
- Easy on the eyes for night viewing

### Sepia Theme (Vintage Brown & Cream)
- Background: Vintage cream (#F5EFE7)
- Accent: Warm brown (#C67C4E)
- Classic, nostalgic aesthetic

### Ocean Theme (Deep Teal & Aqua)
- Background: Deep teal (#0F2F3F)
- Accent: Bright aqua (#00D9FF)
- Cool, calming atmosphere

### Forest Theme (Emerald & Sage)
- Background: Dark green (#1A3A2A)
- Accent: Emerald (#52D17A)
- Natural, organic feel

### Sunset Theme (Orange & Purple)
- Background: Deep purple (#3A1F4D)
- Accent: Vibrant orange (#FF7F50)
- Warm, energetic vibe

##  Privacy & Attribution

- **Unsplash Attribution** - All photos are properly attributed to photographers
- **Local Storage** - Favorites, recent views, and downloads are stored locally in your browser
- **No Data Collection** - Application does not collect or store personal data
- **Open Source** - Built with transparent, readable code

##  Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full Support |
| Firefox | Latest | ✅ Full Support |
| Safari | Latest | ✅ Full Support |
| Edge | Latest | ✅ Full Support |
| Opera | Latest | ✅ Full Support |

##  Performance

- **No Build Process** - Pure vanilla JavaScript, no compilation needed
- **Lightweight** - Total size: ~23 KB (compressed)
- **Fast Loading** - Optimized CSS and JavaScript
- **Lazy Loading** - Images load on demand
- **Smooth Animations** - Hardware-accelerated CSS transitions

##  Troubleshooting

### Photos Not Loading
- **Check Internet Connection** - Application requires internet access
- **Verify API Key** - Ensure your Unsplash API key is valid
- **Check Browser Console** - Look for error messages (F12 → Console)

### Search Not Working
- **Clear Cache** - Try clearing browser cache and reloading
- **Check API Limit** - Unsplash has rate limits (50 requests/hour for free tier)

### Theme Not Saving
- **Enable Cookies** - Browser must allow local storage
- **Check Storage** - Open DevTools (F12) → Application → Local Storage

### Lightbox Not Opening
- **Update Browser** - Ensure you have the latest browser version
- **Disable Extensions** - Some extensions may interfere

##  API Reference

### Unsplash API Endpoints Used
- `GET /photos` - Get random or paginated photos
- `GET /search/photos` - Search for photos
- `GET /topics/{id}/photos` - Get photos by topic
- `POST /photos/{id}/statistics` - Track downloads

##  Future Enhancements

- Cloud sync for favorites across devices
- Advanced search with multiple filters
- Photo upload functionality
- User authentication and profiles
- Social sharing features
- Collections and albums
- Advanced image editing tools
- Dark mode auto-detection

##  License

This project uses the Unsplash API. Please refer to [Unsplash License](https://unsplash.com/license) for usage terms.

##  Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Verify API key and internet connection
4. Check Unsplash API status

## 🎓 Learning Resources

- [Unsplash API Documentation](https://unsplash.com/developers)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

##  Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ 6 theme system with diverse colors
- ✅ Category filtering
- ✅ Search with history
- ✅ Favorites and recent views
- ✅ Multiple view modes (Masonry, Grid, List)
- ✅ Responsive design
- ✅ Auto-hiding header on scroll
- ✅ Download tracking
- ✅ Accessibility features

##  Credits

**Built with:**
- Vanilla HTML5, CSS3, JavaScript ES6
- [Unsplash API](https://unsplash.com/developers) for photos
- Modern web standards and best practices

**Inspired by:**
- Modern design principles
- User-centric interface design
- Web accessibility standards

---

**Tomzora** - Your elegant image gallery companion. Explore, discover, and enjoy beautiful photography.

Made with ❤️ for photography enthusiasts and web developers.
