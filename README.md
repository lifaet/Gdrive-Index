# gdrive-index

A Google Drive file index/browser, running as a Cloudflare Worker.

## Layout

```
src/
├── index.js         entry point — addEventListener('fetch', ...), same as before
├── config.js         edit this: drive folder IDs, site theme, feature toggles
├── templates.js       all page HTML, as template strings (no separate .html files)
├── google-drive.js    the Drive client: auth, list, search, download
├── router.js           request routing + JSON API handlers
└── utils.js            small helpers, plus the optional Auth0 login flow
```

Day to day, you'll almost always only touch `src/config.js` — that's where
the list of indexed Drive folders (`authConfig.roots`), the OAuth
client_id/secret/refresh_token, and the UI theme/toggles live.

## Deploying

This repo is connected to Cloudflare Workers Builds (Settings → Builds in
the Cloudflare dashboard). Every push to `main` is automatically built and
deployed — there's nothing to run manually.

To test locally before pushing:

```bash
npm install
npx wrangler dev
```

To deploy manually if you ever need to:

```bash
npx wrangler deploy
```

## Notes

- No secrets are used yet — `authConfig.client_secret` /
  `authConfig.refresh_token` are plain values in `config.js`. If you'd
  rather not have those committed to GitHub in plaintext, they can be moved
  to `wrangler secret put` later; ask and I'll wire that up.
- The Auth0-based whole-site login (`authConfig.enable_auth0_com`) is off
  by default. If you turn it on, you'll need a KV namespace — see the
  commented-out block in `wrangler.toml`.
- Two small blocks of code (`rewrite()` and part of `gdiencode()` in
  `utils.js`/`router.js`) are minified/obfuscated code inherited from the
  upstream template. They were moved as-is rather than rewritten, since
  re-deriving obfuscated logic without the original source risks silently
  changing behavior.
