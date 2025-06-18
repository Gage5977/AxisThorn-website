# Contributing to Axis Thorn Website

Thank you for your interest in contributing to the Axis Thorn website project! This guide will help you get started.

## 🎨 Design Principles

Before contributing, please familiarize yourself with our design philosophy:

- **Ultra-minimalist aesthetic** with purposeful elements
- **Cinematic visual impact** through motion and transitions
- **Geometric harmony** in layouts and components
- **Premium brand positioning** for AI consultancy market
- **Accessibility-first** approach to inclusive design

## 🛠 Development Guidelines

### Code Style
- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes where applicable
- Maintain consistent indentation (2 spaces)
- Comment complex CSS animations and transforms
- Ensure cross-browser compatibility

### Color Palette Consistency
Always use CSS custom properties for colors:
```css
var(--accent-primary)    /* #8B1538 - Dark Red */
var(--accent-secondary)  /* #A21621 - Medium Red */
var(--accent-tertiary)   /* #6B0F2A - Darker Red */
var(--text-primary)      /* #ffffff - White */
var(--text-secondary)    /* #cccccc - Light Gray */
var(--text-muted)        /* #999999 - Muted Gray */
```

### Typography Guidelines
- **Headlines**: Playfair Display, 700 weight
- **Body Text**: Inter, 400-600 weights
- **Letter Spacing**: Tight tracking (-0.025em to -0.04em)
- **Line Height**: 1.1 for headlines, 1.6-1.8 for body

## 📝 Contribution Process

### 1. Issue Creation
- Use appropriate issue templates
- Include detailed descriptions and mockups
- Label issues correctly (bug, enhancement, etc.)
- Reference any design specifications

### 2. Branch Naming
- `feature/enhancement-name` for new features
- `fix/bug-description` for bug fixes
- `design/visual-update` for design changes

### 3. Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for visual changes
- Test across multiple browsers and devices
- Ensure accessibility compliance
- Update documentation if needed

## 🎯 Areas for Contribution

### High Priority
- **Performance Optimization**: Image compression, CSS optimization
- **Accessibility Improvements**: ARIA labels, keyboard navigation
- **Mobile Experience**: Touch interactions, responsive refinements
- **SEO Enhancement**: Meta tags, structured data

### Medium Priority
- **Animation Enhancements**: Micro-interactions, loading states
- **Content Updates**: Copy refinements, service descriptions
- **Form Functionality**: Contact form backend integration
- **Analytics Integration**: User behavior tracking

### Future Considerations
- **Dark/Light Mode Toggle**: Theme switching capability
- **Internationalization**: Multi-language support
- **CMS Integration**: Content management system
- **Progressive Web App**: PWA capabilities

## 🧪 Testing Requirements

### Browser Testing
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Device Testing
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024, 1024x768)
- Mobile (375x812, 414x896, 360x640)

### Performance Benchmarks
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 📞 Communication

### Questions & Support
- Create a GitHub issue for feature discussions
- Use clear, descriptive titles
- Include relevant context and requirements

### Design Decisions
- Major visual changes require approval
- Maintain brand consistency
- Consider user experience impact
- Document design rationale

## 🚀 Deployment

The website uses GitHub Actions for automated deployment:
- Push to `main` triggers deployment
- HTML/CSS validation runs automatically
- Lighthouse performance testing included
- GitHub Pages deployment for live site

---

*Thank you for contributing to the Axis Thorn website project! Your efforts help create a world-class digital presence for AI-powered financial consulting.*