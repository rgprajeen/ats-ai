import DOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";
import {
  BROWSER_OPTIONS,
  FONT_URL,
  DEFAULT_STYLES,
} from "@/constants/exporter-config";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, ...BROWSER_OPTIONS.args],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      BROWSER_OPTIONS.executablePath
    ),
    headless: true,
  });
}
export function processHtml(html: string): string {
  const dom = new JSDOM();
  const jsdoc = dom.window.document;

  const sanitizedHtml = DOMPurify.sanitize(html);
  jsdoc.body.innerHTML = sanitizedHtml;

  const fontStyles = jsdoc.createElement("link");
  fontStyles.rel = "stylesheet";
  fontStyles.href = FONT_URL;
  jsdoc.head.appendChild(fontStyles);

  const style = jsdoc.createElement("style");
  style.textContent = DEFAULT_STYLES;
  jsdoc.head.appendChild(style);

  return dom.serialize();
}
