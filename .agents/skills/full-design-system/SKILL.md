---
name: full-design-system
description: >-
  Comprehensive Design System skill for building, extracting, auditing, and maintaining consistent design systems, tokens, CSS variables, typography scales, component architecture, and theme contracts. Use when asked to "build a design system", "extract design system", "setup design tokens", "ensure component consistency", or "create UI brand book".
---

# Full Design System & Token Management Skill

This skill provides a complete, production-grade source of truth for creating, managing, and enforcing unified design systems across web applications.

---

## 1. Core Principles & Design Architecture

1. **Single Source of Truth**: All visual attributes (colors, typography, spacing, elevations, radii, animations) MUST be defined as design tokens or CSS custom properties.
2. **Component Hierarchy**:
   - **Primitives**: Base atomic tokens (`--color-brand-500`, `--spacing-4`, `--radius-md`).
   - **Semantic Tokens**: Contextual bindings (`--bg-surface-primary`, `--text-body-muted`, `--border-interactive-focus`).
   - **Component Tokens**: Specific component overrides (`--btn-height`, `--card-padding`).
3. **No Magic Values**: Never write inline hex colors, arbitrary pixel paddings (e.g. `padding: 13px`), or hardcoded font sizes in CSS/JSX.

---

## 2. Design System Structure & Blueprint

When establishing or updating a design system in a project, construct or align with the following structure:

```text
src/
├── styles/
│   ├── tokens/
│   │   ├── colors.css       # Palette & semantic color variables
│   │   ├── typography.css   # Font families, scale, line heights, weights
│   │   ├── spacing.css      # 4px/8px spatial grid system
│   │   ├── elevation.css    # Shadows, z-index layers, overlays
│   │   └── animations.css   # Easing functions, duration tokens, keyframes
│   ├── components/      # Global component utility styles
│   └── globals.css      # Core reset & token imports
```

---

## 3. Standard Token Specification

### 3.A Spatial Grid (8pt / 4pt baseline)
```css
:root {
  --space-0-5: 0.125rem; /* 2px */
  --space-1:   0.25rem;  /* 4px */
  --space-2:   0.5rem;   /* 8px */
  --space-3:   0.75rem;  /* 12px */
  --space-4:   1rem;     /* 16px */
  --space-6:   1.5rem;   /* 24px */
  --space-8:   2rem;     /* 32px */
  --space-12:  3rem;     /* 48px */
  --space-16:  4rem;     /* 64px */
}
```

### 3.B Typography Scale & Ratios (Minor Third / Major Third)
```css
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Geist', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:   calc(12rem / 16);
  --text-sm:   calc(14rem / 16);
  --text-base: calc(16rem / 16);
  --text-lg:   calc(18rem / 16);
  --text-xl:   calc(20rem / 16);
  --text-2xl:  calc(24rem / 16);
  --text-3xl:  calc(30rem / 16);
  --text-4xl:  calc(36rem / 16);

  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### 3.C Color Architecture (Semantic Tokens)
```css
:root {
  /* Surface Tokens */
  --bg-app: #09090b;
  --bg-surface-primary: #121215;
  --bg-surface-secondary: #1a1a1e;
  --bg-surface-tertiary: #242429;

  /* Border Tokens */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-default: rgba(255, 255, 255, 0.14);
  --border-interactive: rgba(255, 255, 255, 0.25);

  /* Text Tokens */
  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --text-brand: #38bdf8;
}
```

---

## 4. Workflows & Actions

### 4.A Extracting a Design System
When asked to extract a design system from a site or design reference:
1. Identify primary, neutral, accent, and semantic color scales.
2. Determine typography families, modular scale ratios, and line heights.
3. Map component primitive patterns (buttons, inputs, cards, dialogs, badges).
4. Output a clean CSS token file (`tokens.css`) and Tailwind / UI configuration.

### 4.B Auditing Component Consistency
When auditing UI code:
1. Verify all UI components import and consume design tokens instead of hardcoded CSS values.
2. Check color contrast ratios (WCAG AAA for text, AA for UI controls).
3. Validate focus ring styles, hover states, disabled states, and dark/light mode toggles.
4. Ensure dark/light mode balance without contrast degradation.

---

## 5. Verification Checkpoints

- **Zero hardcoded colors**: Search codebase for raw hex `#...` or `rgb(...)` outside `tokens.css`.
- **Responsive Fluid Scale**: Verify layouts use fluid container bounds rather than static pixel widths.
- **Theme Contract Integrity**: Switching `data-theme="dark"` or `data-theme="light"` on `<html>` updates all visual tokens seamlessly.
