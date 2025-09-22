# Hotel Management System - Branding & Theming Guide

## 🎨 Overview

The Hotel Management System is designed with a flexible theming and branding system that allows you to customize the appearance, colors, typography, and branding elements to match your restaurant's identity.

## 🏗️ Theme Architecture

The theming system is built on top of:
- **Tailwind CSS**: For utility-first styling
- **CSS Custom Properties**: For dynamic theming
- **Component Variants**: For consistent styling patterns
- **Design Tokens**: For systematic color and spacing management

## 🎯 Branding Components

### 1. **Logo & Brand Identity**

#### Logo Configuration
```typescript
// In your layout or header component
const brandConfig = {
  logoUrl: "/images/your-logo.png", // Path to your logo
  logoText: "Your Restaurant Name",
  logoSubtext: "Fine Dining Experience",
  favicon: "/favicon.ico"
}
```

#### Implementation Locations:
- **Header Component**: `components/layout/header.tsx`
- **Sidebar Component**: `components/layout/sidebar.tsx`
- **Login Page**: `app/auth/login/page.tsx`

### 2. **Color Scheme Customization**

#### Primary Colors (Brand Colors)
```css
/* In your global CSS or component styles */
:root {
  /* Primary Brand Color */
  --primary: 221 83% 53%;        /* Your main brand color */
  --primary-foreground: 210 40% 98%;
  
  /* Secondary Brand Color */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  
  /* Accent Color */
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
}
```

#### Role-Based Color Themes
```typescript
// In components/layout/sidebar.tsx or header.tsx
const roleColors = {
  ADMIN: {
    primary: 'bg-red-600',
    secondary: 'bg-red-100',
    text: 'text-red-800',
    accent: 'border-red-200'
  },
  WAITER: {
    primary: 'bg-green-600',
    secondary: 'bg-green-100', 
    text: 'text-green-800',
    accent: 'border-green-200'
  },
  CASHIER: {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-100',
    text: 'text-blue-800', 
    accent: 'border-blue-200'
  },
  COOK: {
    primary: 'bg-orange-600',
    secondary: 'bg-orange-100',
    text: 'text-orange-800',
    accent: 'border-orange-200'
  }
}
```

### 3. **Typography Customization**

#### Font Configuration
```typescript
// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    }
  }
}
```

#### Typography Implementation
```css
/* In app/globals.css */
body {
  font-family: var(--font-sans);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 700;
}
```

## 🎨 Complete Theming Guide

### Step 1: Update Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your custom brand colors
        brand: {
          primary: '#3B82F6',     // Your primary color
          secondary: '#10B981',   // Your secondary color
          accent: '#F59E0B',      // Your accent color
          neutral: '#6B7280',     // Your neutral color
        },
        // Restaurant-specific colors
        restaurant: {
          gold: '#D4AF37',        // Premium feel
          burgundy: '#800020',    // Elegant dining
          sage: '#9CAF88',        // Fresh, organic
          charcoal: '#36454F',    // Modern, sophisticated
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
```

### Step 2: Create Brand Configuration

```typescript
// lib/brand-config.ts
export const brandConfig = {
  // Basic Information
  restaurantName: "Your Restaurant Name",
  tagline: "Fine Dining Experience",
  description: "Premium restaurant management solution",
  
  // Visual Identity
  logo: {
    url: "/images/logo.png",
    width: 120,
    height: 40,
    alt: "Restaurant Logo"
  },
  favicon: "/favicon.ico",
  
  // Color Scheme
  colors: {
    primary: "#3B82F6",
    secondary: "#10B981", 
    accent: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#1F2937",
    textSecondary: "#6B7280"
  },
  
  // Typography
  typography: {
    fontFamily: "Inter",
    headingFont: "Poppins",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem", 
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    }
  },
  
  // Layout
  layout: {
    maxWidth: "1280px",
    sidebarWidth: "280px",
    headerHeight: "64px",
    borderRadius: "0.5rem"
  },
  
  // Features
  features: {
    showLogo: true,
    showTagline: true,
    customFavicon: true,
    customColors: true
  }
}
```

### Step 3: Update Components with Brand Configuration

#### Header Component
```typescript
// components/layout/header.tsx
import { brandConfig } from '@/lib/brand-config'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Brand Logo and Name */}
        <div className="flex items-center space-x-3">
          {brandConfig.features.showLogo && (
            <img 
              src={brandConfig.logo.url}
              alt={brandConfig.logo.alt}
              width={brandConfig.logo.width}
              height={brandConfig.logo.height}
              className="h-8 w-auto"
            />
          )}
          <div>
            <h1 className="text-xl font-bold" style={{ color: brandConfig.colors.text }}>
              {brandConfig.restaurantName}
            </h1>
            {brandConfig.features.showTagline && (
              <p className="text-sm" style={{ color: brandConfig.colors.textSecondary }}>
                {brandConfig.tagline}
              </p>
            )}
          </div>
        </div>
        {/* Rest of header content */}
      </div>
    </header>
  )
}
```

#### Sidebar Component
```typescript
// components/layout/sidebar.tsx
import { brandConfig } from '@/lib/brand-config'

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      {/* Brand Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {brandConfig.features.showLogo && (
            <img 
              src={brandConfig.logo.url}
              alt={brandConfig.logo.alt}
              width={brandConfig.logo.width}
              height={brandConfig.logo.height}
              className="h-8 w-auto"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold" style={{ color: brandConfig.colors.text }}>
              {brandConfig.restaurantName}
            </h2>
          </div>
        </div>
      </div>
      {/* Rest of sidebar content */}
    </aside>
  )
}
```

### Step 4: Update Global Styles

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');

:root {
  /* Brand Colors */
  --brand-primary: 59 130 246;        /* #3B82F6 */
  --brand-secondary: 16 185 129;      /* #10B981 */
  --brand-accent: 245 158 11;         /* #F59E0B */
  
  /* Restaurant Colors */
  --restaurant-gold: 212 175 55;      /* #D4AF37 */
  --restaurant-burgundy: 128 0 32;    /* #800020 */
  --restaurant-sage: 156 175 136;     /* #9CAF88 */
  --restaurant-charcoal: 54 69 79;    /* #36454F */
  
  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-display: 'Poppins', system-ui, sans-serif;
  
  /* Layout */
  --max-width: 1280px;
  --sidebar-width: 280px;
  --header-height: 64px;
}

/* Custom Brand Classes */
.brand-primary {
  background-color: rgb(var(--brand-primary));
  color: white;
}

.brand-secondary {
  background-color: rgb(var(--brand-secondary));
  color: white;
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 600;
}

.restaurant-premium {
  background: linear-gradient(135deg, rgb(var(--restaurant-gold)) 0%, rgb(var(--restaurant-burgundy)) 100%);
  color: white;
}
```

### Step 5: Update Login Page Branding

```typescript
// app/auth/login/page.tsx
import { brandConfig } from '@/lib/brand-config'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Brand Logo and Name */}
        <div className="text-center">
          {brandConfig.features.showLogo && (
            <img 
              src={brandConfig.logo.url}
              alt={brandConfig.logo.alt}
              width={brandConfig.logo.width}
              height={brandConfig.logo.height}
              className="mx-auto h-16 w-auto mb-4"
            />
          )}
          <h2 className="text-3xl font-bold brand-text" style={{ color: brandConfig.colors.text }}>
            {brandConfig.restaurantName}
          </h2>
          {brandConfig.features.showTagline && (
            <p className="mt-2 text-sm" style={{ color: brandConfig.colors.textSecondary }}>
              {brandConfig.tagline}
            </p>
          )}
        </div>
        
        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  )
}
```

## 🎨 Theme Presets

### Restaurant Theme Presets

#### 1. **Luxury Fine Dining**
```typescript
const luxuryTheme = {
  colors: {
    primary: "#D4AF37",      // Gold
    secondary: "#800020",    // Burgundy
    accent: "#2C1810",       // Dark Brown
    background: "#FDFCFB",   // Cream
    surface: "#F5F5DC",      // Beige
  },
  typography: {
    fontFamily: "Playfair Display",
    headingFont: "Cinzel"
  }
}
```

#### 2. **Modern Bistro**
```typescript
const modernTheme = {
  colors: {
    primary: "#2C3E50",      // Navy
    secondary: "#E74C3C",    // Red
    accent: "#F39C12",       // Orange
    background: "#FFFFFF",   // White
    surface: "#F8F9FA",      // Light Gray
  },
  typography: {
    fontFamily: "Roboto",
    headingFont: "Montserrat"
  }
}
```

#### 3. **Organic Cafe**
```typescript
const organicTheme = {
  colors: {
    primary: "#27AE60",      // Green
    secondary: "#9CAF88",    // Sage
    accent: "#F39C12",       // Orange
    background: "#FFFFFF",   // White
    surface: "#F0F8F0",      // Light Green
  },
  typography: {
    fontFamily: "Open Sans",
    headingFont: "Nunito"
  }
}
```

## 🔧 Advanced Customization

### Dynamic Theme Switching

```typescript
// hooks/use-theme.ts
import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState('default')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])
  
  const applyTheme = (themeName: string) => {
    const themeConfig = getThemeConfig(themeName)
    
    // Apply CSS custom properties
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value)
    })
    
    // Apply typography
    document.documentElement.style.setProperty('--font-family', themeConfig.typography.fontFamily)
    
    localStorage.setItem('theme', themeName)
    setTheme(themeName)
  }
  
  return { theme, applyTheme }
}
```

### Component-Level Theming

```typescript
// components/ui/themed-button.tsx
import { brandConfig } from '@/lib/brand-config'

interface ThemedButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export function ThemedButton({ children, variant = 'primary', className = '' }: ThemedButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: brandConfig.colors.primary,
          color: 'white'
        }
      case 'secondary':
        return {
          backgroundColor: brandConfig.colors.secondary,
          color: 'white'
        }
      case 'accent':
        return {
          backgroundColor: brandConfig.colors.accent,
          color: 'white'
        }
      default:
        return {}
    }
  }
  
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
      style={getVariantStyles()}
    >
      {children}
    </button>
  )
}
```

## 📱 Responsive Branding

### Mobile-First Branding

```css
/* app/globals.css */
/* Mobile (default) */
.brand-logo {
  height: 2rem;
  width: auto;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Tablet */
@media (min-width: 768px) {
  .brand-logo {
    height: 2.5rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .brand-logo {
    height: 3rem;
  }
  
  .brand-title {
    font-size: 1.875rem;
  }
}
```

## 🚀 Quick Branding Checklist

### Essential Branding Elements
- [ ] Logo image (PNG/SVG, high resolution)
- [ ] Primary brand color (hex code)
- [ ] Secondary brand color (hex code)
- [ ] Restaurant name and tagline
- [ ] Font selection (Google Fonts recommended)
- [ ] Favicon (16x16, 32x32, 192x192)

### Files to Update
- [ ] `lib/brand-config.ts` - Main brand configuration
- [ ] `tailwind.config.js` - Color and typography settings
- [ ] `app/globals.css` - Global styles and CSS variables
- [ ] `components/layout/header.tsx` - Header branding
- [ ] `components/layout/sidebar.tsx` - Sidebar branding
- [ ] `app/auth/login/page.tsx` - Login page branding
- [ ] `public/images/` - Logo and brand images
- [ ] `public/favicon.ico` - Favicon

### Testing Your Branding
- [ ] Test on different screen sizes
- [ ] Verify color contrast for accessibility
- [ ] Check logo clarity at different sizes
- [ ] Test font loading performance
- [ ] Verify favicon displays correctly
- [ ] Test with different user roles (Admin, Waiter, etc.)

## 🎨 Brand Asset Guidelines

### Logo Requirements
- **Format**: PNG (with transparency) or SVG
- **Size**: Minimum 512x512px for high-DPI displays
- **Background**: Transparent or white
- **Usage**: Works on light and dark backgrounds

### Color Accessibility
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Blindness**: Test with color blindness simulators
- **WCAG Compliance**: Ensure AA level compliance

### Typography Guidelines
- **Readability**: Choose fonts optimized for screen reading
- **Loading**: Use Google Fonts or self-host for performance
- **Fallbacks**: Always provide system font fallbacks
- **License**: Ensure commercial use licensing

This comprehensive theming system allows you to create a unique brand identity for your restaurant while maintaining the professional functionality of the Hotel Management System.
