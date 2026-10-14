# Filmyhardik

Portfolio site for **Filmy Hardik**, a funny content creator with 350M+ views across Instagram, YouTube, Snapchat and Facebook. Built with React and Vite.

## Features

- **Live network hero**: a canvas animation linking the creator to platforms and brands. Pulses travel along the connections, nodes are pulled toward the cursor, and hovering shows a tooltip.
- **Scroll effects**: reading progress bar, a side rail of dots that tracks the current section, scroll-in reveals and count-up stats.
- **Platform cards**: 3D tilt and a cursor spotlight on hover.
- **Brand bento and ticker**: headline campaigns with log-scale bars, plus a looping marquee of every brand worked with.
- **Contact**: copy-to-clipboard buttons for email and phone, and a brief form that builds a pre-filled `mailto:` link.
- **Accessible and responsive**: respects `prefers-reduced-motion`, has visible focus states, and works down to small phone widths.

## Tech stack

- [React 18](https://react.dev)
- [Vite 5](https://vitejs.dev)
- Plain CSS (no UI framework) and the HTML canvas API
- Google Fonts: Bowlby One, DM Sans, DM Mono

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
├── index.html              # Vite entry, loads fonts
├── Filmyhardik.html        # original single-file HTML version
└── src/
    ├── main.jsx            # React entry
    ├── App.jsx             # page layout and cursor glow
    ├── index.css           # all styles and design tokens
    ├── data.js             # brands, platforms, stats and contact details
    ├── hooks.js            # useReveal, useActiveSection, useScrollProgress
    └── components/
        ├── Nav.jsx, Rail.jsx, Hero.jsx, Stats.jsx,
        │   Platforms.jsx, Brands.jsx, Contact.jsx, Footer.jsx
        ├── Network.jsx     # canvas network animation
        ├── Count.jsx       # count-up number
        └── Reveal.jsx      # scroll-in wrapper
```

## SEO, AEO, GEO and agent browsing

- **Prerendered HTML:** `npm run build` renders the React app to static HTML (`scripts/prerender.mjs`), so crawlers and AI bots that don't run JavaScript still get the full page. The browser then hydrates it.
- **SEO:** title, description, Open Graph and Twitter large-image card (`public/og-image.png`), `robots.txt`, `sitemap.xml`, manifest and icons, a semantic heading structure and a skip link.
- **AEO (answer engines):** a visible FAQ section (`src/components/Faq.jsx`) with the same text exposed as `FAQPage` JSON-LD, plus `Person`, `WebSite` and `ProfilePage` schema. All facts live in `src/seo-data.js`.
- **GEO (generative engines):** `/llms.txt` and `/llms-full.txt`, and a `robots.txt` that explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and other AI crawlers. Edit `buildRobots` in `src/seo-data.js` to restrict any of them.
- **Agentic browsing:** labelled landmarks and form fields, stable ids, and WebMCP tools (`src/agent.js`) that expose the profile, brand list, FAQ and a "prepare collaboration brief" action to browser agents. The tools never send anything on their own.
- **Live domain:** canonical, `og:url`, `og:image` and the sitemap need the real URL. Set `SITE_URL` at build time, or deploy on Vercel (it provides `VERCEL_PROJECT_PRODUCTION_URL`). Without it, those tags are skipped.

## Editing content

Most copy lives in `src/data.js`: stats, platform cards, brand tiles, ticker and chips, network nodes, and contact details. Colors and fonts are CSS variables at the top of `src/index.css`.

## Deploying

The build output is a static site, so it works on any static host. On Vercel, import the repo and use the defaults (framework: Vite, build command `npm run build`, output directory `dist`).

## Contact

- Email: filmyyhardik@gmail.com
- Instagram: [@filmyhardik](https://www.instagram.com/filmyhardik/)
- YouTube: [@filmyyhardik](https://www.youtube.com/@filmyyhardik)
