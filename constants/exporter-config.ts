import { fetchToDataUri } from "@/lib/utils";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.BASE_URL;

export const LOGO_URL = BASE_URL + "/HJLogo.png";

export const PDF_OPTIONS = async () => ({
  format: "A4" as const,
  printBackground: true,
  margin: { top: "72px", right: "1cm", bottom: "1cm", left: "1cm" },
  displayHeaderFooter: true,
  headerTemplate: `
      <style>
        html { -webkit-print-color-adjust: exact; }
        #header, #footer { all: unset !important; }
      </style>
      <div style="width: 100%; height: 64px; background: #000000; display: flex; align-items: center; margin: 0; padding: 4px; border-bottom: 6px solid; border-image: linear-gradient(to right, rgba(9,9,121), rgba(0,212,255)) 1;">
        <img src="${await fetchToDataUri(
          LOGO_URL
        )}" style="height: 48px; width: auto; margin-left: 8px;">
      </div>
    `,
  footerTemplate: `<span></span>`,
});

export const BROWSER_OPTIONS = {
  args: ["--hide-scrollbars", "--disable-web-security"],
  executablePath:
    "https://github.com/Sparticuz/chromium/releases/download/v129.0.0/chromium-v129.0.0-pack.tar",
};

export const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap";

export const DEFAULT_STYLES = `
    body { 
      margin: 0; 
      padding: 0; 
      font-family: Figtree, Arial, sans-serif;
      font-size: 12pt;
    }
    h1, h2 { 
      page-break-after: avoid; 
      margin-top: 1.5em;
    }
    ul, ol { 
      page-break-before: avoid; 
    }
    p {
      margin-bottom: 1em;
    }
    @page {
      margin-top: 100px;
    }
  `;
