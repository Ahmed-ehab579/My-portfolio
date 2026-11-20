# Ahmed Ehab, portfolio

Portfolio site in plain HTML, CSS and JavaScript (no framework, no build step), coded from the Framer design.

Design reference: https://next-features-904898.framer.app/

| Path | What it holds |
|---|---|
| `*.html` (root) | The pages: `index` (Home). Next: `project` (Recita case study) |
| `css/` | Styles. `tokens.css` (colors, fonts, text styles) and `base.css` (reset, cursor) are shared; `header.css`; `home.css` |
| `js/` | Scripts. `fx.js` holds the shared motion helpers (text reveals, appear, smooth scroll, cursor); `header.js`; `home.js` |
| `assets/fonts` | Self-hosted fonts: Satoshi, Instrument Sans, Jost, Geist, Switzer |
| `assets/images`, `assets/videos` | Images and videos taken from the published Framer site |
| `assets/vendor` | Motion 12.23.12 (MIT), the animation engine Framer uses, and Lenis 1.1.20 (MIT) for smooth scroll |
| `ANIMATIONS.md` | Every animation with its exact Framer values |

## Run it locally

```bash
python3 -m http.server 8130
```

Then open http://127.0.0.1:8130 . Opening `index.html` directly also works, but fonts load more reliably through the local server.
