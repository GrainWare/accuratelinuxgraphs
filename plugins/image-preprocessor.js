// Note: This Vite plugin approach can't access request cookies directly.
// The actual HDR processing is now handled by the custom image service
// in src/services/custom-image-service.ts which can access cookies.

export default function imagePreprocessor() {
  return {
    name: "astro:hdr-image-preprocessor",
    enforce: "pre",
    // This plugin is now mainly for development/build-time processing
    // Runtime cookie-based processing happens in the custom image service
    async load(id) {
      // Let the custom image service handle all image processing
      return null;
    },
  };
}
