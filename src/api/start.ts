// src/api/start.ts
/* Robust bootstrap that works whether server.ts exports an http.Server or an Express app */
import * as mod from './server';

const port = Number(process.env.API_PORT ?? 3001);

// Prefer an http.Server if exported; otherwise fall back to the Express app (default or named).
const candidate =
  mod.server ??
  mod.default ??
  mod.app;

if (!candidate || typeof candidate.listen !== 'function') {
  // If you hit this, adjust to your actual exports or log the keys to inspect them.
  // e.g., console.log(Object.keys(mod));
  throw new Error('Unable to start server: no listen()-able export found from ./server');
}

const srv = candidate.listen(port, () => {
  console.log(`🚀 API listening on ${port} (NODE_ENV=${process.env.NODE_ENV})`);
});

// If your server module expects to attach WebSocket to the HTTP server, and it
// exported a factory,