# Axis Thorn Brand Guide 2025
## Pioneering Financial Technology Through Minimal Design

### Design Philosophy
Inspired by leading tech innovators, our new brand identity embodies:
- **Radical Minimalism**: Every element serves a purpose
- **Bold Typography**: Confident statements through type
- **Subtle Sophistication**: Understated luxury in details
- **Technical Precision**: Geometric forms and mathematical ratios
- **Dynamic Restraint**: Animation that enhances, never distracts

### Color Palette

#### Primary Colors
```css
--axis-pure-black: #000000;        /* Primary background */
--axis-pure-white: #FFFFFF;        /* Primary text on dark */
--axis-neutral-950: #0A0A0A;       /* Subtle elevation */
--axis-neutral-900: #171717;       /* Card backgrounds */
--axis-neutral-800: #262626;       /* Borders and dividers */
```

#### Accent Colors
```css
--axis-accent-primary: #0066FF;    /* Electric blue - primary actions */
--axis-accent-secondary: #00DC82;  /* Mint green - success states */
--axis-accent-tertiary: #FF0066;   /* Magenta - alerts/special */
--axis-accent-muted: #7C7C7C;      /* Muted gray - secondary text */
```

#### Gradient System
```css
--axis-gradient-primary: linear-gradient(135deg, #0066FF 0%, #00DC82 100%);
--axis-gradient-dark: linear-gradient(180deg, #000000 0%, #0A0A0A 100%);
--axis-gradient-light: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
```

### Typography

#### Font Stack
```css
--font-primary: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
--font-mono: "SF Mono", "JetBrains Mono", "Fira Code", monospace;
--font-display: "SF Pro Display", -apple-system, sans-serif;
```

#### Type Scale
```css
--text-6xl: clamp(3.5rem, 8vw, 7rem);     /* Hero headlines */
--text-5xl: clamp(2.5rem, 6vw, 5rem);     /* Section titles */
--text-4xl: clamp(2rem, 4vw, 3.5rem);     /* Subsection heads */
--text-3xl: clamp(1.5rem, 3vw, 2.5rem);   /* Card titles */
--text-2xl: clamp(1.25rem, 2.5vw, 2rem);  /* Feature heads */
--text-xl: 1.25rem;                        /* Large body */
--text-base: 1rem;                         /* Body text */
--text-sm: 0.875rem;                       /* Small text */
--text-xs: 0.75rem;                        /* Micro text */
```

#### Font Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
Based on 8px grid:
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
```

### Animation & Interaction

#### Timing Functions
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--spring: cubic-bezier(0.43, 0.13, 0.23, 0.96);
```

#### Standard Durations
```css
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;
```

### Component Patterns

#### Cards
- Pure black or white backgrounds
- No borders in light mode, subtle borders in dark mode
- Large internal padding (2-3rem)
- Hover: subtle scale (1.02) and shadow elevation

#### Buttons
- Rectangular with minimal border-radius (4px max)
- High contrast between text and background
- Hover: invert colors or subtle opacity change
- Active: scale(0.98)

#### Navigation
- Fixed position with backdrop blur
- Minimal height (64px)
- Logo as wordmark or geometric symbol
- Links with subtle underline on hover

#### Hero Sections
- Full viewport height or generous padding
- Massive typography (6xl or larger)
- Minimal supporting text
- Single, clear CTA

### Visual Effects

#### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.16);
```

#### Blur Effects
```css
--blur-sm: blur(4px);
--blur-md: blur(8px);
--blur-lg: blur(16px);
--blur-xl: blur(24px);
```

### Logo Concept
- Geometric monogram: "AT" merged into single form
- Mathematical precision in proportions
- Works in pure black or white
- Scales from 16px favicon to billboard
- Optional: animated version for loading states

### Implementation Notes
1. Remove ALL gradients except for special accent moments
2. Eliminate unnecessary decorative elements
3. Use white space as a design element
4. Typography should do the heavy lifting
5. Animations should feel inevitable, not surprising
6. Every interaction should feel premium

### Inspiration References
- HM.la: Bold typography, black/white contrast, minimal navigation
- Monograph: Clean geometry, subtle animations, professional restraint
- Slite: Clear hierarchy, thoughtful spacing, refined interactions