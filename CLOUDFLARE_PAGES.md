# B4NDX Utility on Cloudflare Workers

This project is configured for **Cloudflare Workers Static Assets**, not Cloudflare Pages. The deployment configuration is in `wrangler.jsonc` and serves the Vite build output from `dist/public`.

## Build locally

```bash
pnpm install --frozen-lockfile
pnpm run build
```

The production assets are written to `dist/public`.

## Deploy with Wrangler

```bash
pnpm exec wrangler deploy
```

The Worker name is `b4ndx-utility`. Keep the deployed URL and any custom domain configuration in Cloudflare rather than hardcoding a temporary preview domain in the application.

## Routing and assets

The Vite build includes the SPA entry point and `client/public/manus-routes.json`. Cloudflare must serve `index.html` for client routes, including `/privacy` and `/terms`, while serving `/assets/b4ndx/*` as static files.

Before a production deploy, verify:

- `/` loads the B4NDX homepage.
- `/privacy` and `/terms` work on direct navigation and refresh.
- `/assets/b4ndx/mercedes-hero.webp` and `/assets/b4ndx/pursuit-mode-hero.mp4` return successfully.
- The site does not require Manus environment variables or Manus-hosted asset URLs.
