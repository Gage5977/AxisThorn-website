# Axis Thorn LLC Website Backup
**Backup Date:** June 19, 2025 - 20:01:24

## Website Status Summary
- **Production URL:** https://axisthorn.com
- **GitHub Repository:** https://github.com/Gage5977/AxisThorn-website.git
- **Deployment Platform:** Vercel
- **Current Commit:** 5e2e56f

## Key Features Implemented
1. **Static HTML Site** - Converted from Next.js to pure static HTML
2. **Code-Style Navigation** - Portal links: /home, /client-portal, /axis-ai, /axis-terminal
3. **Service Pages** - consultation.html, implementation.html, support.html
4. **Styling** - Dark theme with cyan accents, Space Mono font for code elements
5. **Clean URLs** - Vercel handles .html extension removal

## Directory Structure
```
public/           - Main website files (served by Vercel)
├── css/         - All stylesheets
├── js/          - JavaScript modules
├── *.html       - All HTML pages
└── *.svg        - Logo and favicon files

src/             - Source files
dist/            - Built distribution files
out/             - Next.js build output (legacy)
```

## Recent Changes
- Fixed service card links to redirect to service pages
- Updated navigation with code-style portal names
- Added CSS for better link visibility and clickability
- Fixed /app link to point to terminal.html
- Ensured all pages have proper CSS imports

## Known Working Pages
- / (home)
- /invoices (client portal)
- /axis-ai (AI demo)
- /terminal (terminal interface)
- /consultation (service page)
- /implementation (service page)
- /support (service page)

## Deployment Configuration
- **vercel.json:** Static hosting with clean URLs enabled
- **Build Command:** None (static files)
- **Output Directory:** public

## Backup Contents
This backup includes all website files at the time of snapshot, including:
- All HTML pages
- CSS stylesheets
- JavaScript files
- SVG graphics
- Configuration files
- Source and distribution directories