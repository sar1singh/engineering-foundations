---
name: EngineeringOS
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#dbb8ff'
  on-secondary: '#3f2160'
  secondary-container: '#573878'
  on-secondary-container: '#caa6ef'
  tertiary: '#fff5e7'
  on-tertiary: '#402d00'
  tertiary-container: '#ffd47a'
  on-tertiary-container: '#7a5a00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dbb8ff'
  on-secondary-fixed: '#29074a'
  on-secondary-fixed-variant: '#573878'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  technical-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.02em
  technical-xs:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 4px
  gutter: 16px
  margin-sm: 16px
  margin-md: 32px
  margin-lg: 48px
  max-width: 1440px
---

## Brand & Style
This design system is built on the principles of **Cyber-Noir Architecturalism**. It is designed for high-stakes engineering environments where precision, performance, and technical clarity are paramount. The aesthetic rejects the "softness" of consumer web trends in favor of a raw, industrial, and high-contrast interface that feels like a premium terminal for architects of the digital age.

The target audience consists of senior engineers, cloud architects, and technical leaders who value information density and rapid navigation. The emotional response is one of controlled power—evoking the feeling of operating a sophisticated, low-latency machine. The style combines elements of **Brutalism** (sharp edges, monospaced data) with **High-Contrast Modernism** (vibrant neon accents against deep obsidian voids).

## Colors
The palette is rooted in a "Deep Obsidian" void to maximize contrast and reduce eye strain during extended technical sessions. 

- **Primary (Neon Cyan):** Reserved for technical actions, code-level interactions, and the core identity of the platform.
- **Domain Colors:** Specific hues are assigned to cognitive domains to aid in rapid scanning—Purple for Architecture, Amber for Cloud/AWS, and Violet for Interpersonal/Soft Skills.
- **Alerts & Success:** High-saturation Rose and Lime are used sparingly to cut through the dark UI, ensuring critical status changes are never missed.
- **Surface Strategy:** Layers are defined by `121214` surfaces against the `050505` background, separated by 1px borders rather than soft shadows.

## Typography
The typographic hierarchy is designed for maximum legibility of complex data.

- **Headlines:** Space Grotesk provides a geometric, slightly futuristic character that feels engineered. Use it for page titles and major section headers.
- **Body:** Inter is the workhorse for long-form content, documentation, and descriptions, providing a neutral and highly readable balance to the sharper display faces.
- **Data & Metadata:** JetBrains Mono is used for all technical outputs, code snippets, system logs, and UI labels (like buttons and chips). This reinforces the "OS" nature of the platform, treating every piece of data with mathematical precision.

## Layout & Spacing
This design system utilizes an **Architectural Fixed Grid**. All layouts are based on a 4px baseline grid to ensure vertical rhythm.

- **Desktop:** 12-column grid with a maximum width of 1440px. Gutters are kept tight (16px) to maintain high information density.
- **Dot-Matrix Background:** Map views and large canvas areas must feature a 16px or 32px dot-matrix grid overlay in `#121214` to provide a sense of scale and alignment.
- **Precision Margins:** Components are often nested with precise 1px "internal gutters" created by their borders, mimicking the layout of a blueprint or technical schematic.

## Elevation & Depth
Depth in this design system is expressed through **Tonal Layering** and **Luminescence** rather than physical simulation.

- **The Void:** The base layer is always `#050505`. 
- **The Surface:** Interactive or elevated modules use `#121214`. 
- **Structural Borders:** Every container must have a 1px solid border. Use `#71717A` (Muted) for inactive states and Domain colors (Cyan, Purple, etc.) for active or focused states.
- **Neon Glow:** Active components do not use shadows. Instead, they use a "backlight" effect—a subtle, saturated `box-shadow` or `drop-shadow` with 0px offset and a 10px-15px blur using the component’s primary accent color at 40% opacity.

## Shapes
The shape language is strictly **Sharp**. There are no rounded corners in this design system. 

Every element—from buttons and input fields to large modal containers—must feature 0px border radius. This choice emphasizes the "engineered" and "precise" nature of the system. Visual interest is generated through 1px border intersections and high-contrast color transitions rather than organic curves.

## Components
- **Buttons:** Rectangular with 0px radius. Primary buttons use a solid Neon Cyan background with black text. Secondary buttons use 1px Cyan borders with transparent backgrounds. On hover, apply the Neon Glow effect.
- **Chips/Badges:** Small, monospaced text containers using JetBrains Mono. Use subtle background tints (10% opacity) of the domain colors (Amber for Cloud, etc.) with 1px solid borders at 100% opacity.
- **Input Fields:** Bottom-border only or full 1px border. Background should be slightly darker than the surface layer. Focus state triggers a full 1px Neon Cyan border.
- **Cards:** No shadows. Define boundaries using 1px `#71717A` borders. For "Critical" or "Alert" cards, use a 1px `#FB7185` border.
- **Data Tables:** High-density, monospaced data. Use zebra-striping with `#0A0A0A` and `#121214`. Header text should be `technical-xs` in JetBrains Mono.
- **Code Blocks:** Syntax highlighting should follow the platform's domain colors. The container should feel like an integrated part of the surface, not a separate entity.