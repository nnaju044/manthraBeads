# ManthraBeads Hero Section

Pixel-oriented replica of the ManthraBeads Abacus Academy hero, built with EJS + Tailwind CSS (CDN) + Font Awesome. No custom CSS — Tailwind utility classes only.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000

## Add the real images

Drop your actual files into `public/assets/` with these exact names (referenced directly in `views/index.ejs`):

- `public/assets/hippo.png` — mascot (also reused as the small nav logo)
- `public/assets/abacus.png` — the wooden abacus
- `public/assets/island.png` — reused three times: the small castle island (top-left), the village island (right), and the large base island the scene sits on

Each `<img>` uses `object-contain`/percentage-based width so proportions stay intact no matter the source image's native size — just keep each PNG's own aspect ratio consistent with the screenshot crop for the closest match.

## Structure

```
views/index.ejs      → the hero markup (single template)
public/assets/        → drop-in placeholders for the three images
server.js             → minimal Express app, renders views/index.ejs at "/"
```

## Responsive behavior

- ≥1024px (lg): two-column hero (copy left, illustration right), full pill navbar, side-by-side bottom panel.
- <1024px: content stacks vertically, center nav links collapse behind a hamburger button, illustration scales via `aspect-ratio` + percentage-based absolute positioning so the abacus/hippo/islands keep their relative placement at any width.
- All glassmorphism (`bg-white/5` + `backdrop-blur`), glow (`shadow-glow*` custom shadow tokens), and floating decorative elements (numbers, balloon, butterfly, treasure icon) are preserved at every breakpoint.

## Bead click sound

A wooden-click sound plays every time a bead is toggled on the interactive abacus page.

- **Sound file:** `public/sound/tunetank.com_button-wooden-click.wav`
- **Rapid clicking:** Playback position resets before each play so rapid clicks produce instant, overlapping feedback.
- **Toggle:** A 🔊 / 🔇 button appears in the navbar (only on the abacus page). Default state is **ON**.
- **Persistence:** The mute/unmute preference is saved in `localStorage` (`manthra_sound`) and restored on reload.
- **Performance:** A single `Audio` instance is created once and reused — no new objects per click, no memory leaks.
- **Accessibility:** The toggle button includes `aria-label`, keyboard support, and follows the existing navbar styling.
