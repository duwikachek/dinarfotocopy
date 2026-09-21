---
name: Lumia Metro Glass
colors:
  surface: '#14121f'
  surface-dim: '#14121f'
  surface-bright: '#3a3746'
  surface-container-lowest: '#0e0c1a'
  surface-container-low: '#1c1a27'
  surface-container: '#201e2c'
  surface-container-high: '#2b2836'
  surface-container-highest: '#363342'
  on-surface: '#e5e0f3'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#e5e0f3'
  inverse-on-surface: '#312f3d'
  outline: '#88929c'
  outline-variant: '#3e4851'
  surface-tint: '#8ecdff'
  primary: '#8ecdff'
  on-primary: '#00344f'
  primary-container: '#00a4ef'
  on-primary-container: '#003653'
  inverse-primary: '#006494'
  secondary: '#ffb4aa'
  on-secondary: '#690003'
  secondary-container: '#c5020b'
  on-secondary-container: '#ffd2cc'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#d88a00'
  on-tertiary-container: '#4a2c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cbe6ff'
  primary-fixed-dim: '#8ecdff'
  on-primary-fixed: '#001e30'
  on-primary-fixed-variant: '#004b71'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930005'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#14121f'
  on-background: '#e5e0f3'
  surface-variant: '#363342'
  lumia-cyan: '#00a4ef'
  lumia-cobalt: '#005a9e'
  lumia-coral: '#ff3b30'
  lumia-amber: '#f59e0b'
  lumia-emerald: '#10b981'
  glass-surface: rgba(255, 255, 255, 0.08)
  glass-surface-hover: rgba(255, 255, 255, 0.14)
  glass-border: rgba(255, 255, 255, 0.18)
  glass-border-bright: rgba(255, 255, 255, 0.35)
  deep-purple-start: '#1b0a2a'
  deep-purple-mid: '#100e24'
  deep-purple-end: '#080612'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 3.5rem
    fontWeight: '300'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '300'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  price-display:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.08em
  tile-stat:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: '200'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system reimagines the iconic Windows Phone / Lumia UI design language merged with modern glassmorphism and deep atmospheric backdrops. It bridges the utility-first printing and document workflow of a high-speed copy and stationery center with an energetic, content-forward visual experience.

### Aesthetic Paradigm
- **Metro Modernism meets Glassmorphic Depth:** Solid, vibrant modular color blocks (Cyan, Cobalt, Coral, Amber) stand side-by-side with translucent, frosted glass panels (`backdrop-filter: blur(16px)` to `blur(24px)`).
- **Expressive Typography & Information Hierarchy:** Large light-weight headlines inspired by Metro UI typography paired with high-contrast, crisp numerals (`font-variant-numeric: tabular-nums`) optimized for real-time quotation tables, price calculations, and tracking IDs.
- **Atmospheric Canvas:** A deep indigo/violet nocturnal gradient background allows rich neon tiles and illuminated translucent frosted cards to gleam with ambient inner highlights and hairline glass borders.

### Tone & Experience
- **Functional, High-Speed, Direct:** Every interactive module acts like an active widget: instant price calculation, rapid file drop-zones, one-tap WhatsApp dispatch, and live status tiles.
- **Tactile & Responsive:** Tile components simulate responsive live tiles, responding with subtle perspective shifts, luminance changes, and glassy inner reflections.

## Colors

The palette draws directly from classic Metro tile accents and high-end glass OS interfaces, anchored on a deep nocturnal canvas.

### Core Roles
- **Primary (`#00a4ef` Lumia Cyan):** Used for primary actions, active print configuration toggles, download CTAs, and interactive calculation highlights.
- **Secondary (`#ff3b30` Lumia Coral):** Powers urgent notifications, batch print job flags, destructive alerts, and high-impact promo badges.
- **Tertiary (`#f59e0b` Dinar Amber):** The signature warmth accent used for gold foil finishes, special paper selections, pending statuses, and price summary callouts.
- **Neutral (`#0d0b18` Nocturne Canvas):** Deep indigo-tinted dark base serving as the stage for luminous glass cards and vivid flat tiles.

### Semantic Glass Tints
- **Glass Surface:** Translucent white tint (`rgba(255, 255, 255, 0.08)`) with `backdrop-filter: blur(16px)` provides depth without occluding ambient background gradients.
- **Glass Border:** Crisp 1px translucent rule (`rgba(255, 255, 255, 0.18)`) establishing clean boundaries. Hover states elevate this border to `rgba(255, 255, 255, 0.35)`.
- **Lumia Emerald (`#10b981`):** Reserved for WhatsApp direct order dispatches, live printer ready signals, and completed tracking states.

## Typography

Typography honors the Windows Phone / Metro philosophy: clean, spacious, uncluttered, and typographically driven.

### OpenType & Features
- Inter is configured with stylistic sets `cv11` (single-storey 'a') and `ss01` (modern open 'G' and 'R') for a minimalist, geometric feel.
- **Tabular Numerals (`tabular-nums`):** Mandatory across all price calculations, paper GSM specifications, copy page counters, and tracking status timelines to guarantee rock-solid column alignment.

### Expressive Hierarchy
- **Light Weights on Large Scales:** Hero and section headlines use light weights (`300` and `200`) at scale (`3.5rem` and `2.5rem`), referencing Metro's typographic elegance.
- **Ultra-Readable Body & Metas:** Standard interface elements rely on normal (`400`) and semibold (`600`) weights for rapid scanning during complex print specifications.
- **All-Caps Overhead Labels:** `label-caps` (`0.6875rem`, `0.08em` tracking) standardizes tile categories, paper weight tags (e.g., `ART PAPER 260G`), and live status indicators.

## Layout & Spacing

The layout is built on a modular widget grid system inspired by Lumia Start screens and desktop dashboards.

### Grid Framework
- **Modular Tile Grid:** A multi-span grid composed of uniform square modules (1x1 small tile, 2x1 wide tile, 2x2 large tile, 4x2 panoramic hero tile).
- **Desktop (1200px+):** 12-column modular grid with `1.5rem` gutters. Admin workspaces integrate a fixed `240px` translucent glass navigation rail.
- **Tablet (768px - 1199px):** 6-column grid with `1rem` gutters. Wide tiles reflow to fit two columns comfortably.
- **Mobile (< 768px):** 2-column or single-column stack with `1rem` gutters and outer margins, keeping live tiles fluid and finger-tappable.

### Spacing Rhythm
- Baseline increments strictly follow a 4px module (4px, 8px, 16px, 24px, 40px).
- Container insets use `space-md` (`1rem`) for compact widgets and `space-lg` (`1.5rem`) for primary calculator workspaces.

## Elevation & Depth

Visual hierarchy combines the crisp modular planes of Metro UI with multi-layered optical glass depth.

### Atmospheric Base
- A deep gradient canvas (`radial-gradient(ellipse at top left, #230d3d 0%, #0d0b18 65%, #05040a 100%)`) provides background ambient light that shines through translucent glass surfaces.

### Glassmorphic Surfaces
1. **Frosted Base Tier (Glass Containers):**
   - Background: `rgba(255, 255, 255, 0.06)`
   - Blur: `backdrop-filter: blur(20px)`
   - Border: `1px solid rgba(255, 255, 255, 0.15)`
   - Inner Glow: `box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)`
2. **Elevated Tile Tier (Active / Hover Tiles):**
   - Background: `rgba(255, 255, 255, 0.12)`
   - Border: `1px solid rgba(255, 255, 255, 0.3)`
   - Drop Shadow: `0 12px 32px -8px rgba(0, 0, 0, 0.5)`
3. **Solid Metro Tile Tier:**
   - Opaque, saturated color fills (Lumia Cyan, Coral, Cobalt, Emerald) with zero blur and pure white text/iconography, providing striking visual contrast against frosted glass modules.

### Lighting & Borders
No heavy, muddy drop shadows. Instead, elevation is expressed via edge illumination (1px hairline highlight borders) and subtle 15% opacity diffused color blooms corresponding to the tile's dominant hue.

## Shapes

To balance Windows Phone's pure geometric flat rectangles with modern soft glassmorphism, shapes adopt a disciplined "Soft" curvature (`roundedness: 1`).

### Geometry Rules
- **Interactive Tiles & Glass Cards:** `0.5rem` (`8px`) corner radius. This softens the stark Metro grid into an elegant desktop widget experience while preserving modular grid tightness.
- **Form Inputs, Segmented Toggles, Buttons:** `0.375rem` to `0.5rem` (`6px` - `8px`).
- **Pill Exceptions (`rounded-full`):** Strictly reserved for floating badge counters (e.g., `8` notifications, `PROMO`), small interactive tags, and avatar circular masks. Content containers must never use pill borders.
- **Borders:** Consistent `1px` stroke width across all glass borders and dividers.

## Components

### 1. Live Action Tiles (Widget Cards)
- **Structure:** Modular container with fixed aspect ratios (1:1 square, 2:1 landscape banner).
- **Variants:**
  - *Solid Tile:* Direct background fill with Lumia Cyan, Cobalt, Coral, or Amber. Bold icon top-right or center, thin stat/label bottom-left.
  - *Glass Tile:* Frosted glass surface with semi-transparent tinted backdrop. Contains interactive widgets (e.g., direct WhatsApp dispatcher, live order search bar).
- **Interaction:** On hover, tiles scale gently (`scale: 1.015`) with an illuminated top border highlight and an ambient glow matching the accent color.

### 2. Buttons & CTAs
- **Primary Metro Button:** Solid `#00a4ef` Lumia Cyan fill, crisp white text (`Inter 600`), 1px cyan highlight border, `8px` rounded corners.
- **Glass Secondary Button:** `rgba(255, 255, 255, 0.08)` background, `1px solid rgba(255, 255, 255, 0.2)` border, smooth hover fill to `rgba(255, 255, 255, 0.16)`.
- **WhatsApp Direct Button:** Solid `#10b981` Lumia Emerald fill with white messaging icon and text, launching order details instantly to the chat interface.
- **Destructive Button:** Soft red (`#ff3b30`) fill, solid white text, no gradient.

### 3. Interactive Pricing Calculator
- **Segmented Controllers:** Frosted glass rail housing modular toggle buttons (e.g., Paper Size: `A4`, `F4`, `A3`; Paper Weight: `70gsm`, `80gsm`, `Art Paper`). Active state highlights in solid cyan or amber.
- **Tabular Dynamic Price Display:** Bold tabular typography displaying real-time unit price and total quotation with animated digit transitions.
- **Counter Controls:** Flat square `+` and `-` steppers integrated cleanly into numeric input fields.

### 4. Input Fields & File Drop Zones
- **Text Inputs:** Dark glass background (`rgba(0, 0, 0, 0.35)`), `1px solid rgba(255, 255, 255, 0.18)` border, `8px` radius. Focus applies a vivid 2px `#00a4ef` ring with `rgba(0, 164, 239, 0.25)` ambient edge bloom.
- **File Drop Target:** Frosted glass panel with dashed `1.5px rgba(255, 255, 255, 0.3)` border, prominent document icon, and instantaneous preview chips for uploaded PDFs or image batches.

### 5. Chips & Status Badges
- **Status Pills:** Compact `rounded-full` badges with translucent tinted backgrounds:
  - *Pending / Queued:* Amber background (`rgba(245, 158, 11, 0.15)`), text `#f59e0b`.
  - *Printing / Processing:* Cyan background (`rgba(0, 164, 239, 0.15)`), text `#00a4ef`.
  - *Ready / Completed:* Emerald background (`rgba(16, 185, 129, 0.15)`), text `#10b981`.
- **Notification Counter Badge:** Circular pill perched at the tile corner with white bold numeral on glowing coral (`#ff3b30`) background.

### 6. Order Tracking Timeline
- **Visual Path:** Continuous vertical or horizontal 2px hairline guide connecting illuminated node dots.
- **Active Node:** Pulsing ring in Lumia Emerald or Cyan indicating current stage (Order Placed → In Production → Quality Check → Ready for Pickup).