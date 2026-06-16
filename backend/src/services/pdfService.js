import ApiError from "../utils/ApiError.js";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractText(buffer) {
  let pdf = null;

  try {
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true,
    });

    pdf = await loadingTask.promise;

    const pageTexts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      pageTexts.push(pageText);
    }

    const text = pageTexts.join("\n").trim();

    if (!text || text.length < 50) {
      throw ApiError.badRequest(
        "Could not extract readable text - is this a scanned/image-only PDF?"
      );
    }

    return {
      text,
      meta: {
        numPages: pdf.numPages,
      },
    };
  } catch (err) {
    if (err.isOperational) throw err;

    throw ApiError.badRequest(
      "Failed to parse PDF: " + err.message
    );
  } finally {
    await pdf?.destroy?.();
  }
}