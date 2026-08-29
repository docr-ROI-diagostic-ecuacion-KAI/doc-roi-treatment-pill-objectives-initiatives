const fs = require("node:fs");
const path = require("node:path");

module.exports = function renderCorrectedIndex(request, response) {
  const indexPath = path.join(process.cwd(), "index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  // Repair the common UTF-8/Windows-1252 mojibake without touching valid text.
  html = html.replace(/\u00c2\u00b7/g, "\u00b7");

  // Guarantee that browsers interpret the document as UTF-8.
  if (!/<meta\s+charset=/i.test(html)) {
    html = html.replace(/<head>/i, '<head>\n<meta charset="utf-8">');
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.end(html);
};
