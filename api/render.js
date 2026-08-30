const fs = require("node:fs");
const path = require("node:path");

const FAVICON_DATA = "https://docroi.marketing/wp-content/uploads/2026/07/1b4b0df9-dfd6-4c1f-ba7f-235d2bf88de2.png";

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
  html = repairUtf8Mojibake(html);

  const typography = `<style id="doc-roi-system-typography">
    html, body, button, input, select, textarea {
      font-family: Arial, Helvetica, sans-serif !important;
    }

    body,
    p, li, td, th, label, small, span,
    button, input, select, textarea,
    .btn, .mini, .field label, .callout, .rule, .safeguard,
    .card-head span, .section-head p, .learning-body p,
    .learning-body li, .area-chip {
      font-size: 12px !important;
      line-height: 1.45 !important;
    }

    h2, h3, h4,
    .section-head h2,
    .card-head h3,
    .learning-body h3,
    .came-row strong,
    .work-row strong {
      font-size: 16px !important;
      line-height: 1.35 !important;
    }

    .came-row textarea,
    .work-row textarea,
    .field input,
    .field select,
    .field textarea {
      font-size: 12px !important;
      line-height: 1.45 !important;
    }
  </style>`;

  const favicon = `<link rel="icon" type="image/png" sizes="any" href="${FAVICON_DATA}">
  <link rel="shortcut icon" type="image/png" href="${FAVICON_DATA}">`;

  html = html.replace(
    /<link\b[^>]*\brel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>\s*/gi,
    ""
  );

  if (!/<meta\s+charset=/i.test(html)) {
    html = html.replace(/<head>/i, '<head>\n<meta charset="utf-8">');
  }
  html = html.replace(/<\/head>/i, favicon + "\n" + typography + "\n</head>");

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.end(html);
};
