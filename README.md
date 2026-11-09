# B4NDX Utility — Website

Official site for **B4NDX Utility**, a Discord utility bot for moderation,
support tickets, welcome/goodbye flows, logging, giveaways, and polls.

Dark, engineered, honest. No fake stats, no fake testimonials, no emoji, no
Administrator permission.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (CSS-first tokens — see `src/index.css` and `DESIGN.md`)
- Self-hosted fonts (Archivo / Inter / IBM Plex Mono via Fontsource)
- Cloudflare Workers Static Assets, worker name `bot`, SPA fallback

## Routes

| Route      | Page                                  |
| ---------- | ------------------------------------- |
| `/`        | Home (hero, modules, install, perms, FAQ) |
| `/privacy` | Privacy                               |
| `/terms`   | Terms                                 |

`not_found_handling: "single-page-application"` in `wrangler.jsonc` serves
`index.html` for unknown paths, so refreshing `/privacy` or `/terms` works.

## Scripts

```bash
npm run dev        # local dev server
npm run typecheck  # tsc -b
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
npm run deploy     # build + wrangler deploy (worker "bot")
```

## Deploying

1. `npm ci`
2. `npx wrangler login`
3. `npm run deploy`

`assets.jsonc` mirrors the deployment target (`wrangler.jsonc`) — the public
URL stays `https://bot.b4ndxutility.workers.dev/`.

## Honesty rules (enforced in `src/lib/site.ts`)

- Invite: `client_id=1542513806255853688`, scopes `bot applications.commands`,
  permissions `1099511721174` — eleven named permissions, **no Administrator**.
- Every command example on the site is labeled **Preview**; nothing is
  presented as a live capture or a shipped command list.
- No stats, uptime numbers, member counts, or testimonials anywhere.
- Support/community links point to the real server: `discord.gg/bpE7tcwNCV`.
