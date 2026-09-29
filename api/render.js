const fs = require("node:fs");
const path = require("node:path");

const FAVICON_DATA = "https://docroi.marketing/wp-content/uploads/2026/07/1b4b0df9-dfd6-4c1f-ba7f-235d2bf88de2.png";
const MY_CABINET_URL = "https://doc-roi-my-cabinet.vercel.app/";
const SWOT_PILL_URL = "https://doc-roi-treatment-pill-swot-directi.vercel.app/";

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

  const navigationPatch = `<style id="doc-roi-navigation-patch">
    .doc-roi-swot-helper {
      margin-top: 8px !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      flex-wrap: wrap !important;
    }

    .doc-roi-swot-helper__text {
      margin: 0 !important;
      font-size: 12px !important;
      line-height: 1.45 !important;
    }

    .doc-roi-swot-helper__link {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 34px !important;
      padding: 7px 11px !important;
      border: 1px solid #0A6FAE !important;
      border-radius: 8px !important;
      background: #FFFFFF !important;
      color: #003B5C !important;
      text-decoration: none !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      line-height: 1.2 !important;
      cursor: pointer !important;
    }

    .doc-roi-swot-helper__link:hover,
    .doc-roi-swot-helper__link:focus-visible {
      background: #EAF6FB !important;
    }
  </style>
  <script id="doc-roi-navigation-script">
    (() => {
      const MY_CABINET_URL = ${JSON.stringify(MY_CABINET_URL)};
      const SWOT_PILL_URL = ${JSON.stringify(SWOT_PILL_URL)};

      function isDocRoiLogo(img) {
        const semanticText = [
          img.alt || "",
          img.title || "",
          img.id || "",
          typeof img.className === "string" ? img.className : "",
          img.getAttribute("aria-label") || ""
        ].join(" ");

        const src = (img.getAttribute("src") || "").toLowerCase();

        return /doc[\\s_-]*roi/i.test(semanticText) ||
          /logo[^/?#]*doc[^/?#]*roi/i.test(src) ||
          /logo[_-]?negro[_-]?doc[_-]?roi/i.test(src);
      }

      function wireDocRoiLogos() {
        document.querySelectorAll("img").forEach((img) => {
          if (!isDocRoiLogo(img)) return;

          const link = img.closest("a");

          if (link) {
            link.href = MY_CABINET_URL;
            link.removeAttribute("target");
            link.removeAttribute("rel");
            return;
          }

          img.style.cursor = "pointer";
          img.setAttribute("role", "link");
          img.setAttribute("tabindex", "0");

          const goToCabinet = () => {
            window.location.href = MY_CABINET_URL;
          };

          img.addEventListener("click", goToCabinet);

          img.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              goToCabinet();
            }
          });
        });
      }

      function textLooksLikeSwotLoad(text) {
        const normalized = String(text || "")
          .replace(/\\s+/g, " ")
          .trim();

        if (!normalized || normalized.length > 180) return false;

        return /(?:load|upload|import).{0,60}s\\.?w\\.?o\\.?t\\.?/i.test(normalized) ||
          /s\\.?w\\.?o\\.?t\\.?.{0,60}(?:load|upload|import)/i.test(normalized);
      }

      function addSwotShortcut() {
        if (document.querySelector('[href="' + SWOT_PILL_URL + '"]')) {
          return;
        }

        const selectors =
          "button, label, h1, h2, h3, h4, p, span, strong, div";

        const candidates = Array.from(
          document.querySelectorAll(selectors)
        )
          .filter((element) =>
            textLooksLikeSwotLoad(element.textContent)
          )
          .filter((element) =>
            !Array.from(element.children).some((child) =>
              textLooksLikeSwotLoad(child.textContent)
            )
          )
          .sort(
            (a, b) =>
              a.textContent.trim().length -
              b.textContent.trim().length
          );

        const target = candidates[0];

        if (!target) return;

        const anchorPoint =
          target.closest("button, label, .btn") || target;

        const helper = document.createElement("div");
        helper.className = "doc-roi-swot-helper";

        helper.innerHTML =
          '<span class="doc-roi-swot-helper__text">' +
          'Don&apos;t have the SWOT file yet?' +
          '</span>' +
          '<a class="doc-roi-swot-helper__link" ' +
          'href="' +
          SWOT_PILL_URL +
          '" target="_blank" rel="noopener noreferrer">' +
          'Open SWOT Direction Index' +
          '</a>';

        anchorPoint.insertAdjacentElement(
          "afterend",
          helper
        );
      }

      function applyDocRoiNavigationPatch() {
        wireDocRoiLogos();
        addSwotShortcut();
      }

      if (document.readyState === "loading") {
        document.addEventListener(
          "DOMContentLoaded",
          applyDocRoiNavigationPatch,
          { once: true }
        );
      } else {
        applyDocRoiNavigationPatch();
      }
    })();
  </script>`;

  html = html.replace(
    /<link\b[^>]*\brel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>\s*/gi,
    ""
  );

  if (!/<meta\s+charset=/i.test(html)) {
    html = html.replace(
      /<head>/i,
      '<head>\n<meta charset="utf-8">'
    );
  }

  html = html.replace(
    /<\/head>/i,
    favicon + "\n" + typography + "\n</head>"
  );

  if (/<\/body>/i.test(html)) {
    html = html.replace(
      /<\/body>/i,
      navigationPatch + "\n</body>"
    );
  } else {
    html += navigationPatch;
  }

  response.statusCode = 200;
  response.setHeader(
    "Content-Type",
    "text/html; charset=utf-8"
  );
  response.setHeader(
    "Cache-Control",
    "no-store, max-age=0"
  );

  response.end(html);
};
