import type { APIRoute } from "astro";
import { HDRImageProcessor } from "../../services/hdr-processor.js";
import fs from "fs/promises";
import path from "path";

const processor = new HDRImageProcessor();

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const src = searchParams.get("src");
    const width = searchParams.get("w")
      ? parseInt(searchParams.get("w")!)
      : undefined;
    const height = searchParams.get("h")
      ? parseInt(searchParams.get("h")!)
      : undefined;
    const format = searchParams.get("f") || "png";

    if (!src) {
      return new Response("Missing src parameter", { status: 400 });
    }

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie") || "";

    // Check if HDR processing should be applied
    const shouldProcess = await processor.shouldProcessImage(cookieHeader);

    // Get the image file
    let imagePath = src;
    if (src.startsWith("/")) {
      imagePath = path.join(process.cwd(), "public", src);
    }

    const imageBuffer = await fs.readFile(imagePath);

    if (!shouldProcess) {
      // Return original image
      const contentType = `image/${format}`;
      return new Response(imageBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Process the image with HDR
    const processedBuffer = await processor.processImage(imageBuffer, {
      enableHDR: true,
      enableInversion: true,
      multiplyValue: 1.5,
      powValue: 0.9,
      brightnessThreshold: 100,
    });

    return new Response(processedBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-HDR-Processed": "true",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response("Image processing error", { status: 500 });
  }
};
