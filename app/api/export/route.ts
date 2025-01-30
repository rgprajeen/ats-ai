import { type NextRequest, NextResponse } from "next/server";
import { getBrowser, processHtml } from "@/lib/exporter";
import { PDF_OPTIONS } from "@/constants/exporter-config";

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "Invalid HTML input" },
        { status: 400 }
      );
    }

    const processedHtml = processHtml(html);

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(processedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf(await PDF_OPTIONS());
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="output.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
