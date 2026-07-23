/* ============================================================
   ENTRY POINT
   ------------------------------------------------------------
   This is the file wrangler.toml points at. Same runtime style
   as your original single-file version (Service Worker syntax,
   addEventListener('fetch', ...)) — nothing about deployment
   changes, this is just the top of the same script, now with
   the rest of the code split into readable files next to it.
   ============================================================ */
import { handleRequest } from './router.js';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event));
});
