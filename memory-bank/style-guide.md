# Todo App Style Guide

## Colors
### Primary Colors
```css
--primary: #4CAF50;      /* Green */
--primary-dark: #388E3C;
--primary-light: #A5D6A7;
```

### Secondary Colors
```css
--secondary: #FF5252;    /* Red */
--secondary-dark: #D32F2F;
--secondary-light: #FF8A80;
```

### Neutral Colors
```css
--text-primary: #333333;
--text-secondary: #757575;
--disabled: #E0E0E0;
--divider: #E0E0E0;
--background: #F5F5F5;
--surface: #FFFFFF;
```

### Status Colors
```css
--success: #4CAF50;
--error: #FF5252;
--warning: #FFC107;
--info: #2196F3;
```

## Typography
### Font Family
```css
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

### Font Sizes
```css
--font-size-title: 32px;
--font-size-subtitle: 24px;
--font-size-body: 16px;
--font-size-caption: 14px;
--font-size-small: 12px;
```

### Font Weights
```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

## Spacing
### Base Unit: 8px
```css
--spacing-xxs: 4px;   /* 0.5x */
--spacing-xs: 8px;    /* 1x */
--spacing-sm: 16px;   /* 2x */
--spacing-md: 24px;   /* 3x */
--spacing-lg: 32px;   /* 4x */
--spacing-xl: 48px;   /* 6x */
--spacing-xxl: 64px;  /* 8x */
```

## Shadows
```css
--shadow-1: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
--shadow-2: 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12);
--shadow-3: 0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10);
```

## Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-full: 9999px;
```

## Animations
### Durations
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 450ms;
```

### Easings
```css
--easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
```

## Component Styles

### Buttons
```css
.button {
  height: 48px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-normal) var(--easing-standard);
}

.button-primary {
  background-color: var(--primary);
  color: white;
}

.button-secondary {
  background-color: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}
```

### Input Fields
```css
.input {
  height: 48px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--divider);
  font-size: var(--font-size-body);
  background-color: var(--surface);
  transition: border-color var(--duration-normal) var(--easing-standard);
}

.input:focus {
  border-color: var(--primary);
}
```

### Cards
```css
.card {
  background-color: var(--surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  box-shadow: var(--shadow-1);
}
```

### Loading States
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--disabled) 25%,
    var(--background) 50%,
    var(--disabled) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Toast/Snackbar
```css
.snackbar {
  background-color: #323232;
  color: white;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
  min-width: 288px;
  max-width: 568px;
}

.snackbar-action {
  color: var(--primary-light);
  font-weight: var(--font-weight-medium);
  margin-left: var(--spacing-sm);
}
```

## Icons
- Use Material Icons from @expo/vector-icons
- Standard icon size: 24px
- Interactive icon size: 24px
- Decorative icon size: 16px

## Layout
### Container
```css
.container {
  padding: var(--spacing-sm);
  max-width: 600px;
  margin: 0 auto;
}
```

### Grid
- Use 8px grid system
- Maintain consistent spacing between elements
- Use appropriate spacing variables

## Accessibility
### Focus States
```css
:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum touch target size: 48x48px
- Minimum spacing between touch targets: 8px

### Color Contrast
- Meet WCAG AA standards
- Text on background: 4.5:1 minimum
- Large text on background: 3:1 minimum

## Responsive Design
### Breakpoints
```css
--breakpoint-sm: 600px;
--breakpoint-md: 960px;
--breakpoint-lg: 1280px;
```

### Responsive Patterns
- Stack elements vertically on small screens
- Use appropriate spacing based on screen size
- Adjust font sizes for readability
- Ensure touch targets are accessible 