# Mythic

An illustrated, interactive guide to the **Dashavatara**, the ten celebrated avatars of Vishnu. Built with accessible HTML, CSS, and browser-native JavaScript; no framework, package dependencies, accounts, cookies, or analytics.

## Experience

- Original Vishnu hero artwork and eleven original vector character emblems.
- Ten detailed profiles: Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, and Kalki.
- Alternate Balarama tradition: Balarama eighth, Krishna ninth, Kalki tenth.
- Stories, character qualities, symbols, relationships, textual traditions, and reflection questions.
- Theme filters, search, an ordered journey, random discovery, and copyable profile URLs.
- Responsive layouts, keyboard-accessible dialogs and tabs, reduced-motion support, and source links.

## Run locally

Requires Node.js 20 or newer. No dependency installation is necessary.

```sh
npm run check
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. A profile can be linked directly, for example `/#avatar/narasimha`. The `/` keyboard shortcut focuses search, Escape closes a profile, and arrow keys switch profile tabs.

## Cloudflare Pages

The existing Cloudflare Git integration is connected to project `dasavathar` and automatically deploys pushes to `main`. GitHub checks and Cloudflare upload checks pass; an upload status alone does not verify the published homepage. This repository adds no deployment workflow of its own.

The site supports two deployment modes. With Cloudflare’s default repository-root upload, the tracked root `index.html` uses the canonical assets under `src/` and needs no build. For a clean build output, use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| Node.js version | 22 |

The build produces a self-contained static site. No API keys, database, or environment secrets are required. `src/_headers` provides browser security headers; `src/404.html` provides a custom not-found page. Hash-based profile routes need no rewrite configuration. `.openai/hosting.json` is local preview configuration, with no hosted Site identity.

## Structure

- `index.html`, `_headers`, `404.html` — generated root entry points for no-build hosting; refreshed by `npm run build`.

- `src/data.js` — original character profiles and the two supported sequences.
- `src/art.js` — original vector emblems.
- `src/app.js` — gallery, filtering, modal, keyboard and URL behavior.
- `src/styles.css` — responsive visual design.
- `src/assets/vishnu.webp` — optimized hero artwork (about 556 KB).
- `scripts/build.mjs` — deterministic copy to `dist/` and synchronization of the root entry points.
- `scripts/sync-entry.mjs` — root asset-path handling; edit the canonical HTML under `src/`.
- `tests/content.test.mjs` — collection integrity, profile completeness, and local asset checks.
- `.github/workflows/check.yml` — runs checks on pushes and pull requests; does not deploy.

## Editorial approach

These are introductory retellings of living sacred traditions, rather than a claim that all communities share one account. The site distinguishes narrative from modern reflection; explains Buddha/Balarama list variations; acknowledges Buddhist perspectives; and presents Kalki as religious prophecy without assigning a modern date. The sequence is not a scientific evolution timeline.

Reference context:

- [UCLA MANAS: Avatars of Vishnu](https://southasia.ucla.edu/religions/avatars-divinities/avatars-of-vishnu/)
- [Michael C. Carlos Museum: The Avatars of Vishnu](https://digitalprojects.carlos.emory.edu/exhibits/show/avatarsofvishnu/avatarsofvishnu-intro)
- [British Museum: Ten-avatar print](https://www.britishmuseum.org/collection/object/A_2003-1022-0-38)
- [The Met: Vishnu and his avatars](https://www.metmuseum.org/art/collection/search/38552)
- [Smithsonian National Museum of Asian Art: Krishna Fluting](https://asia.si.edu/education/educator-resources/encountering-religion-in-asian-art/explore-by-object/object/krishna-fluting/)
- [Kerala Tourism: The Mahabali legend](https://www.keralatourism.org/onam/history/mahabali-legend)

## Artwork

Hero artwork was made for this project using built-in image generation, then encoded as WebP. It is an illustrative interpretation, not a historical artwork. Character emblems are original SVG code and are symbolic rather than exact iconographic reconstructions. No museum images are reproduced.

Hero art brief: a reverent, Indian-miniature-inspired Vishnu seated on a pink lotus above a cosmic ocean, with four arms, conch, chakra, lotus, mace, a golden mandala halo, rich antique gold and teal against midnight navy, pigment texture, and no lettering.

## Validation

`npm run check` checks JavaScript syntax, validates both ten-avatar sequences and all eleven character profiles, checks assets, and builds the site. Browser checks cover gallery navigation, search, theme filtering, profile tabs, next-avatar navigation, alternate tradition selection, and direct profile URLs. GitHub Actions repeats the automated checks.
