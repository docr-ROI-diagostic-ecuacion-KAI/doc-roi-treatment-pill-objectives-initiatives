const fs = require("node:fs");
const path = require("node:path");

function repairUtf8Mojibake(value) {
  return value
    .replace(/(?:Ã.|Â.|â..)/g, (sequence) =>
      Buffer.from(sequence, "latin1").toString("utf8")
    )
    .replace(/\u00b7/g, "\u2022");
}

module.exports = function renderCorrectedIndex(request, response) {
  const indexPath = path.join(process.cwd(), "index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  // Repair every common UTF-8 sequence previously decoded as Windows-1252.
  html = repairUtf8Mojibake(html);

  // Use dependable system typography throughout the complete model.
  const typography = `<style id="doc-roi-system-typography">
    html, body, button, input, select, textarea {
      font-family: Arial, Helvetica, sans-serif !important;
    }
  </style>`;

  if (!/<meta\s+charset=/i.test(html)) {
    html = html.replace(/<head>/i, '<head>\n<meta charset="utf-8">');
  }
  html = html.replace(/<\/head>/i, typography + "\n</head>");

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.end(html);
};
