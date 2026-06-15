# Design

## Color

Strategy: **Committed** — the amber/honey primary carries 30–50% of the
surface. Civic navy accent provides authority and contrast. Pure white bg
lets the primary breathe without muddying.

```css
:root {
  /* Palette */
  --color-bg:       oklch(1.000 0.000 0);       /* pure white */
  --color-surface:  oklch(0.975 0.000 0);       /* near-white for cards/panels */
  --color-primary:  oklch(0.640 0.175 56);      /* amber/honey — brand anchor */
  --color-accent:   oklch(0.300 0.090 252);     /* deep civic navy */
  --color-ink:      oklch(0.150 0.015 56);      /* near-black, slight amber warmth */
  --color-muted:    oklch(0.460 0.008 56);      /* secondary text — ≥3.5:1 vs bg */

  /* Semantic */
  --color-cta-bg:       var(--color-primary);
  --color-cta-text:     oklch(1.000 0.000 0);   /* white on saturated fill */
  --color-link:         var(--color-accent);
  --color-border:       oklch(0.880 0.000 0);
  --color-focus-ring:   var(--color-primary);
  --color-success:      oklch(0.520 0.140 148);
  --color-warning:      oklch(0.720 0.160 72);
  --color-danger:       oklch(0.520 0.180 25);
}
```

Text-on-fill rule: white text on `--color-primary` (L 0.64, saturated).
Dark text only on fills with L > 0.85 or chroma near 0.

## Typography

Font pairing strategy: **serif display + humanist sans body** — civic
authority meets readable warmth.

- **Display / headings**: `Playfair Display` or `Lora` (Google Fonts,
  serif) — editorial confidence without feeling fusty
- **Body / UI**: `Inter` or `Source Sans 3` — neutral, highly legible,
  excellent at small sizes

```css
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Inter', 'Source Sans 3', system-ui, sans-serif;

  /* Scale */
  --text-xs:   0.75rem;   /* 12px — labels, legal */
  --text-sm:   0.875rem;  /* 14px — captions, meta */
  --text-base: 1rem;      /* 16px — body */
  --text-lg:   1.125rem;  /* 18px — lead / intro */
  --text-xl:   1.25rem;   /* 20px — section sub-heads */
  --text-2xl:  1.5rem;    /* 24px — h3 */
  --text-3xl:  1.875rem;  /* 30px — h2 */
  --text-4xl:  clamp(2rem, 4vw, 3rem);   /* h1 */
  --text-hero: clamp(2.5rem, 6vw, 4.5rem); /* hero display */

  --leading-tight:  1.2;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  --tracking-display: -0.02em;  /* display headings — never below -0.04em */
  --tracking-normal:  0;
  --tracking-wide:    0.04em;   /* all-caps labels only */
}
```

Body line length: max 70ch. Use `text-wrap: balance` on h1–h3.

## Spacing

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

## Layout

- Max content width: 1200px, centered
- Body padding: `clamp(1rem, 4vw, 2rem)`
- Grid: `repeat(auto-fit, minmax(280px, 1fr))` for card grids
- Z-index scale: dropdown 100, sticky 200, modal-backdrop 300, modal 400,
  toast 500, tooltip 600

## Border Radius

```css
:root {
  --radius-sm:   4px;   /* inputs, badges */
  --radius-md:   8px;   /* cards, panels */
  --radius-lg:  12px;   /* modals, large cards */
  --radius-pill: 9999px; /* tags, pills only */
}
```

Cards cap at 12px. Never 24px+ on cards or sections.

## Motion

```css
:root {
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --duration-fast:  150ms;
  --duration-base:  220ms;
  --duration-slow:  400ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Components

### Buttons

```css
.btn-primary {
  background: var(--color-primary);
  color: oklch(1 0 0);          /* white text on saturated fill */
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: filter var(--duration-fast) var(--ease-out-quart);
}
.btn-primary:hover  { filter: brightness(0.92); }
.btn-primary:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 3px;
}

.btn-secondary {
  background: transparent;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-6);
}
```

### Cards

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  padding: var(--space-6);
  /* No box-shadow paired with border — pick one */
}
```

### Focus

All interactive elements: `outline: 2px solid var(--color-focus-ring); outline-offset: 3px;`
Never `outline: none` without a visible alternative.
