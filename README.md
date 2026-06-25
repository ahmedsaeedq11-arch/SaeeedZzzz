# SAEED.EXE — Pixel Portfolio

> A retro pixel RPG-themed portfolio for **Ahmed Saeed**, second-year Design student at Innovation University.
> Built as a single-file static site, deployed via GitHub Pages.

🌐 **Live:** https://ahmedsaeedq11-arch.github.io/SaeeedZzzz/

---

## 🎮 The Experience

Every visit starts with a CRT splash screen — `▶ PRESS START` — that plays a 4-note 8-bit jingle. The portfolio is framed as a side-scrolling RPG:

- **Player 01** — Ahmed Saeed, Level 02 Design Student
- **HUD sidebar** — HP/XP/MP bars, equipped tools, mission progress
- **Level map** — each project is a "Mission" with progress bars and a "Return to Map" / "Next Mission" flow
- **Victory toast** — `🏆 ALL MISSIONS COMPLETE` after clearing all three
- **Pixel SFX engine** — square-wave melodies generated live with Web Audio API (no audio files)
- **CRT overlay** — flickering scanlines + purple-gold palette
- **Konami Code easter egg** — `↑↑↓↓←→←→BA` activates cheat mode
- **Theme toggle** — switch between purple CRT and amber CRT
- **Audio toggle** — mute/unmute with localStorage persistence
- **Certificate lightbox** — click any cert for fullscreen view
- **Responsive** — full mobile support with re-stacked layout

## 🛠️ Built With

- Pure **HTML5 + CSS3 + Vanilla JS** — zero build step, zero dependencies
- **Web Audio API** for the pixel SFX engine
- **Press Start 2P** + **Silkscreen** fonts (Google Fonts)
- **Momento360** embed for the 360° booth experience
- **GitHub Pages** + **GitHub Actions** for CI/CD

## 📁 File Structure

```
SaeeedZzzz/
├── index.html              # The whole site (~80KB, 1800+ lines)
├── 404.html                # Pixel-styled 404 page
├── favicon.ico             # Multi-size favicon
├── robots.txt              # SEO crawler config
├── sitemap.xml             # XML sitemap for SEO
├── README.md               # You are here
├── .gitignore              # Standard ignores
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages auto-deploy on push to main
└── assets/
    ├── photo.png           # Profile photo (sidebar)
    ├── about-pixel.png     # Pixel avatar (used in CSS background)
    ├── zara-banner.png     # Mission 01 banner
    ├── kitchen-banner.png  # Mission 02 banner
    ├── booth-banner.jpg    # Mission 03 banner
    ├── cert-{cucina,knauf,iti-1,iti-2}.{jpg,webp}  # Training certificates
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    └── og-image.png        # 1200x630 social share preview
```

## 🚀 Development

### Local Preview

The site is 100% static. Any HTTP server works:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .

# Then open http://localhost:8000/
```

### Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which deploys to GitHub Pages in ~20 seconds.

### Branching

- `main` — production, deployed
- `upgrade/*` — feature branches for upgrades

## 🎨 Design Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `--purple-900` | `#0d0820` | Body background |
| `--purple-500` | `#6845b0` | Primary borders |
| `--gold` | `#f4c842` | CTAs, highlights |
| `--green` | `#4ade80` | Mission complete |
| `--pixel` | Press Start 2P | Headings |
| `--silk` | Silkscreen | UI text |
| `--body` | Space Grotesk | Body copy |

## 📊 Performance

- **HTML size**: ~80KB (single file)
- **Total assets**: ~17MB pre-WebP, ~13MB after (saved ~4MB on certs)
- **Lazy loading** on all off-fold images
- **WebP** primary format for certificates with JPG fallback

## ♿ Accessibility

- Semantic HTML (`<main>`, `<aside>`, `<nav>`, `<section>`, `<header>`)
- ARIA labels on interactive elements
- Skip-link for keyboard users
- Focus-visible outlines
- `prefers-reduced-motion` support
- 0 console errors on load

## 🔍 SEO

- Open Graph + Twitter Card meta tags
- JSON-LD Person schema
- Canonical URL
- XML sitemap
- robots.txt
- Semantic headings hierarchy

## 📜 License

© 2026 Ahmed Saeed — All rights reserved. Portfolio content and code are personal; not for redistribution without permission.

---

🎮 _Press START to begin._