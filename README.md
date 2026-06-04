# Saeed Pixel Portfolio

Retro-inspired bilingual portfolio for Ahmed Saeed (`Saeed`) from Innovation University.

## Live target

- GitHub Pages URL: `https://ahmedsaeedq11-arch.github.io/SaeeedZzzz/`

## Project structure

- `index.html` main page
- `styles.css` visual system and responsive layout
- `script.js` rendering logic
- `data/content.js` personal data, links, and project placeholders
- `assets/qr/` generated QR assets
- `scripts/generate-qr.mjs` local QR generator
- `scripts/generate-qr-card.mjs` printable QR card generator

## Local usage

```bash
npm install
npm run generate:qr
npm run generate:qr-card
npm run build
```

Then open `index.html` directly or serve the folder with any static server.

## Figma

- File URL: `https://www.figma.com/design/0YZwi96bSg4QVBKHOEGUUD`

The Figma file was created for this portfolio direction. Automated population was blocked by the current Figma Starter-plan MCP rate limit during implementation.

## Deployment note

If the GitHub Actions deploy workflow fails on `Setup Pages`, open the repository on GitHub and enable:

`Settings -> Pages -> Build and deployment -> Source -> GitHub Actions`

After that, re-run the `Deploy Portfolio` workflow or push a new commit.
