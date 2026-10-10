function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * The small page a recipient sees after following an unsubscribe or tracked link. `title` and
 * `message` are plain text; `action` is an optional form button posting to the same address.
 */
function renderPage({ title, message, action }) {
  const form = action
    ? `<form method="post"><button type="submit">${escapeHtml(action)}</button></form>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${escapeHtml(title)}</title>
<style>
  body { margin: 0; background: #f4f5f7; color: #1f2933; font-family: Arial, Helvetica, sans-serif; }
  main { max-width: 440px; margin: 12vh auto 0; padding: 32px 24px; background: #fff;
    border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); text-align: center; }
  h1 { margin: 0 0 12px; font-size: 20px; }
  p { margin: 0; font-size: 14px; line-height: 1.5; color: #52606d; }
  button { margin-top: 24px; padding: 10px 20px; border: 0; border-radius: 8px; background: #1f6feb;
    color: #fff; font-size: 14px; cursor: pointer; }
</style>
</head>
<body>
<main>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(message)}</p>
${form}
</main>
</body>
</html>`;
}

module.exports = renderPage;
