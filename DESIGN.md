# B4NDX Utility — Website Design System

Committed design direction for the redesign. One coherent system, applied everywhere.
Reference feeling: precision instrument panel — graphite surfaces, hairline borders,
one warm copper accent, mono labels. No purple, no cyan, no neon, no glass blobs.

---

## 1. Color tokens — "Graphite & Ember"

Deep cool-graphite base (never pure black), restrained copper-ember accent.
The accent appears only on: primary CTAs, active states, eyebrows, focus rings,
status rails, and one hairline per surface. Discord blurple is reserved for the
Discord glyph itself.

| Token            | Value                       | Use                                          |
| ---------------- | --------------------------- | -------------------------------------------- |
| `base-0`         | `#0B0C0E`                   | Page canvas                                  |
| `base-1`         | `#101215`                   | Hero / alternate sections                    |
| `base-2`         | `#15181D`                   | Card + panel surfaces                        |
| `base-3`         | `#1A1E24`                   | Raised / hover surfaces                      |
| `base-4`         | `#22272E`                   | Pressed states, strong fills                 |
| `ink-1`          | `#ECEFF1`                   | Primary text                                 |
| `ink-2`          | `#A8B0B7`                   | Secondary text                               |
| `ink-3`          | `#6F777F`                   | Meta, labels at rest                         |
| `ember-1`        | `#D28E5F`                   | Accent — CTAs, active tab, eyebrows          |
| `ember-2`        | `#E5AB80`                   | Accent hover                                 |
| `ember-3`        | `#9C6238`                   | Accent deep — rails, active tab left border  |
| `ember-ink`      | `#1A1108`                   | Text on accent                               |
| `line-1`         | `rgba(236,239,241,0.08)`    | Hairline borders                             |
| `line-2`         | `rgba(236,239,241,0.14)`    | Strong borders                               |
| `ok`             | `#86B392`                   | "Open / OK" status dots only                 |
| `blurple`        | `#5865F2`                   | Discord glyph only                           |

Rules: radii max 4px (chips 3px, buttons 3px, panels 4px, status dots round).
Shadows are barely used — separation comes from surface steps + hairlines.
Opacity is controlled: nothing below 0.45 except decorative grid (0.04 lines).

## 2. Type scale

- **Display / headlines**: Archivo (variable, 600), tight tracking. Engineered, calm.
- **Body**: Inter (variable, 400–500), 1.6–1.7 line height.
- **Labels / code**: IBM Plex Mono (400/500), uppercase eyebrows + command chips.

| Role          | Spec                                                        |
| ------------- | ----------------------------------------------------------- |
| Display-1     | clamp(2.6rem → 4.75rem) / 1.04 / 600 / −0.025em             |
| Display-2     | clamp(1.7rem → 2.5rem) / 1.12 / 600 / −0.02em               |
| Title (cards) | 1.06–1.125rem / 1.35 / 600                                  |
| Lead          | 1.125rem / 1.7 / 400 / ink-2                                |
| Body          | 0.9375–1rem / 1.65                                          |
| Label         | 0.6875rem / IBM Plex Mono 500 / uppercase / +0.16em         |
| Chip / code   | 0.78rem / IBM Plex Mono 400                                 |

Eyebrow pattern: `01 — Modules` (mono, ember index, ink-3 text) — section numbers
are real order markers, not decoration.

## 3. Hero scroll sequence (desktop, scroll-linked)

Structure: **240vh wrapper → sticky 100vh stage**, progress `p ∈ [0,1]` driven by
`requestAnimationFrame` into CSS custom property `--p` (no React re-renders).
The next section overlaps the pinned stage (negative margin), so the hand-off is
continuous — no hard cut.

- **Layer A — backdrop**: 1px blueprint grid (44px cells, 4% ink) under a radial
  vignette; drifts up 6% and dims to 0.4 across the sequence.
- **Layer B — headline block**: eyebrow, Display-1 headline, lead, CTAs
  (`Invite Bot` primary, `Explore features` secondary).
  - p 0 → 0.32: fully legible, static.
  - p 0.32 → 0.62: translateY −12vh, fade to 0.
- **Layer C — product surface** ("command desk", real DOM, no imagery):
  Discord-native slash-command input + autocomplete, ticket panel, log feed,
  giveaway/poll strip. `PREVIEW` badge in the chrome bar.
  - p 0 → 0.32: peeks from bottom edge, scale 0.94, rotateX 5°, opacity 0.55.
  - p 0.32 → 0.62: rises to optical center, scales to 1, flattens, opacity → 1.
  - p 0.62 → 0.88: docks up 6vh; module chips (MODERATION · TICKETS · WELCOME /
    GOODBYE · LOGGING · GIVEAWAYS · POLLS) stagger in beneath it.
  - p 0.88 → 1.0: dims slightly as the next section slides over the pinned stage.
- **Mobile (<lg) & prefers-reduced-motion**: no pinning, no parallax — static
  100svh hero, headline + CTAs above the fold, surface cropped at the bottom edge.

## 4. Honesty constraints (enforced in code)

- All command examples carry a `PREVIEW` chip + a footnote: names are interaction
  previews, not a shipped command list; the support server has the live list.
- No stats, uptime, member counts, testimonials, or pricing claims anywhere.
- Invite URL uses `client_id=1542513806255853688`, scopes `bot applications.commands`,
  permissions `1099511721174` (11 named permissions, no Administrator).
- Support/Community links use the real server: `https://discord.gg/bpE7tcwNCV`.
- Footer states non-affiliation with Discord Inc.

## 5. Motion & interaction standards

- Scroll-linked hero (above) via rAF → CSS vars; transforms/opacity only.
- Micro-interactions: 140–180ms ease-out; tab/panel swaps 160ms fade+4px rise.
- Visible focus everywhere: 2px `ember-1` outline, 2px offset, never removed.
- Feature explorer: ARIA tabs pattern — roving tabindex, Arrow/Home/End keys,
  click, touch; panels labelled and linked via `aria-controls`.
- Mobile nav: accessible dialog — focus trap, Escape closes, body scroll lock,
  focus returns to the trigger, `aria-modal` + `aria-expanded`.
- `prefers-reduced-motion: reduce` disables pinning, parallax, staggers, and
  long transitions globally.
