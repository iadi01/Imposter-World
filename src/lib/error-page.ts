export function renderErrorPage(err?: unknown): string {
  const message = err instanceof Error ? (err.stack || err.message) : typeof err === "object" ? JSON.stringify(err, null, 2) : String(err || "Unknown SSR Error");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Application Error — Imposter World</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 14px/1.6 system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
      .card { max-width: 48rem; margin: 0 auto; background: #1e293b; border-radius: 0.75rem; border: 1px solid #334155; padding: 2rem; }
      h1 { font-size: 1.5rem; margin: 0 0 1rem; color: #f87171; }
      pre { background: #090d16; color: #38bdf8; padding: 1rem; border-radius: 0.5rem; overflow: auto; font-size: 12px; }
      button { background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>[Imposter World] Server Rendering Error</h1>
      <p>Diagnostic details for debugging:</p>
      <pre>${escapeHtml(message)}</pre>
      <button onclick="location.reload()">Reload Page</button>
    </div>
  </body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
