import { describe, it, expect } from "vitest";
import { getBrowser, processHtml } from "../lib/exporter";
import { FONT_URL } from "@/constants/exporter-config";

describe("Exporter", () => {
  describe("processHtml", () => {
    const inputHtml = "<div>Test</div>";
    const result = processHtml(inputHtml);

    it("should include the content", () => {
      expect(result).toContain(inputHtml);
    });

    it("should include the default styles", () => {
      expect(result).toContain("style");
    });

    it("should include the font loader stylesheet", () => {
      const sanitizedFontUrl = FONT_URL.replace(/&/g, "&amp;");
      expect(result).toContain(sanitizedFontUrl);
    });
  });

  describe("getBrowser", async () => {
    const browser = await getBrowser();

    it("should not provide null", () => {
      expect(browser).not.toBeNull();
    });

    it("should be able to open URL", async () => {
      const page = await browser.newPage();
      const content = await page.goto("https://google.com");

      expect(content).not.toBeNull();
    });
  });
});
