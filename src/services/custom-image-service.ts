import type { LocalImageService, ImageTransform } from "astro";

const service: LocalImageService = {
  getURL(options: ImageTransform, imageConfig) {
    // Generate URL for the image API endpoint that can access cookies
    const { src, width, height, format } = options;
    const params = new URLSearchParams();

    if (width) params.set("w", width.toString());
    if (height) params.set("h", height.toString());
    if (format) params.set("f", format);

    // Include source path - handle both string and ImageMetadata
    const srcString = typeof src === "string" ? src : src.src;
    params.set("src", srcString);

    const queryString = params.toString();
    return `/api/image?${queryString}`;
  },

  parseURL(url: URL) {
    // Parse the URL and extract image transform options
    const params = url.searchParams;

    return {
      src: params.get("src") || "",
      width: params.has("w") ? parseInt(params.get("w")!) : undefined,
      height: params.has("h") ? parseInt(params.get("h")!) : undefined,
      format: (params.get("f") as any) || undefined,
    };
  },

  async transform(
    inputBuffer: Uint8Array,
    transform: ImageTransform,
    imageConfig,
  ) {
    // This shouldn't be called since we're redirecting to the API endpoint
    // But we'll provide a fallback just in case
    return {
      data: inputBuffer,
      format: transform.format || "png",
    };
  },
};

export default service;
