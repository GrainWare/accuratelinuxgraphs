// HDR Image Processing - Client Side Implementation
// This applies CSS-based HDR effects when Ultra UI is enabled

export class ClientHDRProcessor {
  private static instance: ClientHDRProcessor;

  private constructor() {}

  static getInstance(): ClientHDRProcessor {
    if (!ClientHDRProcessor.instance) {
      ClientHDRProcessor.instance = new ClientHDRProcessor();
    }
    return ClientHDRProcessor.instance;
  }

  // Check if Ultra UI is enabled via cookies
  private isUltraUIEnabled(): boolean {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "toggleUltraUI" && value === "true") {
        return true;
      }
    }
    return false;
  }

  // Analyze image brightness (simplified client-side version)
  private async analyzeImageBrightness(img: HTMLImageElement): Promise<number> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(128); // Default brightness
        return;
      }

      // Create a small canvas for performance
      canvas.width = 50;
      canvas.height = 50;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, 50, 50);

      try {
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;

        let totalBrightness = 0;
        let pixelCount = 0;

        // Calculate average brightness
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate perceived brightness
          const brightness = r * 0.299 + g * 0.587 + b * 0.114;
          totalBrightness += brightness;
          pixelCount++;
        }

        resolve(totalBrightness / pixelCount);
      } catch (error) {
        // Handle CORS issues with external images
        console.warn("Could not analyze image brightness:", error);
        resolve(128); // Default brightness
      }
    });
  }

  // Apply HDR effects to an image
  private async applyHDRToImage(img: HTMLImageElement): Promise<void> {
    // Wait for image to load if not already loaded
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    // Analyze brightness
    const brightness = await this.analyzeImageBrightness(img);
    console.log(`Image brightness analysis: ${brightness} for image:`, img.src);

    // Apply appropriate effects based on brightness
    if (brightness < 100) {
      // Dark image - apply inversion + HDR
      img.classList.add("hdr-inverted", "hdr-processed");
      console.log("Applied hdr-inverted + hdr-processed classes");
    } else {
      // Normal/bright image - apply HDR only
      img.classList.add("hdr-ultra");
      console.log("Applied hdr-ultra class");
    }

    // Add a data attribute to mark as processed
    img.setAttribute("data-hdr-processed", "true");
  }

  // Remove HDR effects from an image
  private removeHDRFromImage(img: HTMLImageElement): void {
    img.classList.remove("hdr-processed", "hdr-inverted", "hdr-ultra");
    img.removeAttribute("data-hdr-processed");
  }

  // Apply HDR effects to background images
  private applyHDRToBackgrounds(): void {
    const isEnabled = this.isUltraUIEnabled();

    console.log("HDR Background processing - Ultra UI enabled:", isEnabled);

    // Apply to body background (this targets the tux background specifically)
    if (isEnabled) {
      // Change background image to tuximproved.apng when Ultra UI is enabled
      document.body.style.backgroundImage =
        'url("../assets/img/tuximproved.apng")';
      document.documentElement.style.backgroundImage =
        'url("../assets/img/tuximproved.apng")';

      // Since tux images are typically dark, apply inverted HDR effect
      document.body.classList.add("hdr-background-inverted");
      document.documentElement.classList.add("hdr-background-inverted");

      // Remove other background classes to avoid conflicts
      document.body.classList.remove("hdr-background-ultra", "hdr-background");
      document.documentElement.classList.remove(
        "hdr-background-ultra",
        "hdr-background",
      );
    } else {
      // Restore original background image when Ultra UI is disabled
      document.body.style.backgroundImage = 'url("../assets/img/tux.avif")';
      document.documentElement.style.backgroundImage =
        'url("../assets/img/tux.avif")';

      document.body.classList.remove(
        "hdr-background-ultra",
        "hdr-background",
        "hdr-background-inverted",
      );
      document.documentElement.classList.remove(
        "hdr-background-ultra",
        "hdr-background",
        "hdr-background-inverted",
      );

      console.log(
        "Restored original tux.avif background and removed all HDR background classes",
      );
    }

    // Apply to any elements with explicit background images via inline styles
    const elementsWithInlineBg = document.querySelectorAll(
      '[style*="background-image"]',
    );
    elementsWithInlineBg.forEach((element) => {
      if (isEnabled) {
        element.classList.add("hdr-background");
      } else {
        element.classList.remove(
          "hdr-background",
          "hdr-background-ultra",
          "hdr-background-inverted",
        );
      }
    });

    // Apply to common background-related classes (specifically target tux background)
    const bgElements = document.querySelectorAll(
      '.bg-grain-bg, .bg-grain-panel, [class*="bg-"]',
    );
    bgElements.forEach((element) => {
      if (isEnabled) {
        // Apply inverted HDR to bg-grain-bg (which contains the tux background)
        if (element.classList.contains("bg-grain-bg")) {
          element.classList.add("hdr-background-inverted");
          console.log("Applied hdr-background-inverted to bg-grain-bg element");
        } else {
          element.classList.add("hdr-background");
        }
      } else {
        element.classList.remove(
          "hdr-background",
          "hdr-background-ultra",
          "hdr-background-inverted",
        );
      }
    });
  }

  // Process all images on the page
  public async processAllImages(): Promise<void> {
    const isEnabled = this.isUltraUIEnabled();
    const images = document.querySelectorAll("img");

    console.log(
      `HDR Processing: Ultra UI enabled: ${isEnabled}, Found ${images.length} images`,
    );

    // Handle regular images
    for (const img of images) {
      if (isEnabled) {
        // Only process if not already processed
        if (!img.hasAttribute("data-hdr-processed")) {
          console.log("Processing image:", img.src);
          await this.applyHDRToImage(img);
        }
      } else {
        // Remove HDR effects if Ultra UI is disabled
        this.removeHDRFromImage(img);
      }
    }

    // Handle background images
    this.applyHDRToBackgrounds();
  }

  // Initialize the processor
  public init(): void {
    // Process images on page load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.processAllImages(),
      );
    } else {
      this.processAllImages();
    }

    // Set up mutation observer to handle dynamically added images
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === "IMG" || element.querySelector("img")) {
              hasNewImages = true;
            }
          }
        });
      });

      if (hasNewImages) {
        this.processAllImages();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen for cookie changes (via storage events or periodic checks)
    this.startCookieMonitoring();
  }

  // Monitor cookie changes
  private startCookieMonitoring(): void {
    let lastUltraUIState = this.isUltraUIEnabled();

    setInterval(() => {
      const currentUltraUIState = this.isUltraUIEnabled();
      if (currentUltraUIState !== lastUltraUIState) {
        lastUltraUIState = currentUltraUIState;
        this.processAllImages();
      }
    }, 1000); // Check every second
  }
}

// Auto-initialize when script loads
if (typeof window !== "undefined") {
  ClientHDRProcessor.getInstance().init();
}
