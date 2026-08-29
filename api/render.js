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

  if (!/<meta\s+charset=/i.test(html)) {
    html = html.replace(/<head>/i, '<head>\n<meta charset="utf-8">');
  }
  html = html.replace(/<\/head>/i, typography + "\n</head>");

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.end(html);
};
