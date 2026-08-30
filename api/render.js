const fs = require("node:fs");
const path = require("node:path");

const FAVICON_DATA = "data:image/png;base64,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";

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

  const favicon = `<link rel="icon" type="image/png" sizes="64x64" href="${FAVICON_DATA}">
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
