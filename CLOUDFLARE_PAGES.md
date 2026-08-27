# B4NDX Utility on Cloudflare Pages

Use **Cloudflare Pages** with the project name `b4ndx-utility`. If that name is available, your free public address will be:

```text
https://b4ndx-utility.pages.dev
```

In Cloudflare Pages, import the Git repository that contains this project and use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `pnpm run build` |
| Build output directory | `dist/public` |
| Root directory | `/` |
| Node version | `22` |

The project uses absolute public asset links, so the Mercedes video and B4NDX visuals continue to load when the page is served from `pages.dev`.

> A free `pages.dev` address is conditional on the project name being available. A custom domain such as `.com` or `.gg` normally requires a paid registration.
