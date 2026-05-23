# Saheer MK Portfolio - Architecture & User Guide

Welcome to the documentation for the Saheer MK Developer Portfolio. This document outlines the technical architecture, design decisions, and a guide on how to manage and customize the portfolio.

## 🏗 Architecture Overview

The portfolio is built as a highly optimized, single-page application (SPA) focused on cinematic animations, premium design, and aggressive SEO/AEO (Artificial Intelligence Engine Optimization).

### Tech Stack
* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS v4 (using the modern `@theme` directive)
* **Animations:** Framer Motion (for UI transitions and scroll reveals)
* **3D Graphics:** React Three Fiber (`@react-three/fiber`) & Drei (`@react-three/drei`)
* **Smooth Scrolling:** Lenis (for buttery-smooth, physics-based global scrolling)
* **Fonts:** 100% locally hosted via `@fontsource` and custom woff2/ttf files (No external CDNs for maximum performance and privacy).

### Key Architectural Decisions

1. **Cinematic Entry Timeline (Hero.tsx):**
   * The Hero section operates on a complex, multi-stage timeline.
   * **Stage 1:** A rapid multi-language greeting overlay (using `framer-motion` `AnimatePresence`).
   * **Stage 2:** A 3D WebGL glowing orb scene featuring typewriter text.
   * **Stage 3:** The text fades and scales out using `useTransform` tied to scroll position, followed by an automated, ease-in-out cinematic scroll to the main bio content.

2. **Unified Scroll Reveal Engine (`ScrollReveal.tsx`):**
   * All sections (About, Projects, Contact) use a custom `ScrollReveal` wrapper component.
   * It supports multiple directions (`up`, `left`, `right`), configurable distances, and stagger delays.
   * Crucially, it uses `viewport={{ once: false }}` so that animations re-trigger elegantly when the user scrolls back up the page, keeping the site feeling "alive".

3. **SEO & AEO First (`index.html`):**
   * The site implements advanced Structured Data (JSON-LD).
   * It uses a multi-entity schema including `Person`, `WebSite`, `SoftwareApplication` (for projects), and `FAQPage`.
   * This is explicitly designed to make the portfolio easily readable by AI search engines (like ChatGPT, Claude, Perplexity) as well as traditional crawlers (Googlebot).

4. **100% Local Assets:**
   * No external CDNs are used. All fonts (Inter, IBM Plex Mono, Playfair Display, Geist, KodeMono) are bundled locally via Vite and `@fontsource`. This eliminates external DNS lookups and privacy-leaking third-party network requests.

---

## 📖 User Guide (Customization)

The portfolio is designed to be easily maintainable without needing to dig deep into the complex animation logic.

### 1. Global Configuration
Most global variables (Name, Email, Social Links, SEO Meta) are centralized in a single file:
* **File:** `src/config/site.ts`
* Update your email, LinkedIn URL, GitHub URL, and SEO descriptions here. The `Contact` section and navigation automatically pull from this file.

### 2. Updating Projects
Projects are managed via a static array, making it easy to add or remove items.
* **File:** `src/sections/Projects.tsx`
* **How:** Locate the `PROJECTS` array at the top of the file. Add a new object following the existing schema (`title`, `category`, `description`, `image`, `stack`, `link`, `aspectRatio`).
* **Note:** The `aspectRatio` property (`'square' | 'wide' | 'tall'`) automatically handles the CSS Grid spanning to create a dynamic, masonry-like bento grid.

### 3. Updating Skills & Bio
* **File:** `src/sections/About.tsx`
* **Skills:** Update the `SKILLS` array at the top of the file. The skill pills will automatically stagger-animate in.
* **Bio Text:** Modify the paragraphs within the `ScrollReveal` blocks. The text has been written in a natural, first-person human tone.

### 4. Changing Theme Colors
* **File:** `src/index.css`
* Colors are defined in the Tailwind v4 `@theme` block.
* To change the primary accent color (currently the vibrant orange `#ff4d00`), simply update the `--color-accent` variable. The glowing orb, text highlights, and selection colors will automatically adapt.

---

## 🚀 Development

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Typecheck and build optimized static files to /dist
npm run build

# Preview production build locally
npm run preview
```

### Deployment
The output in the `dist` directory is a pure static site. It can be deployed to any static hosting provider like Cloudflare Pages, Vercel, Netlify, or GitHub Pages.
