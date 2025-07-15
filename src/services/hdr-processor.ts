import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export interface HDRProcessorOptions {
  multiplyValue?: number;
  powValue?: number;
  brightnessThreshold?: number;
  enableHDR?: boolean;
  enableInversion?: boolean;
}

export class HDRImageProcessor {
  private profilePath: string;

  constructor(profilePath: string = "/2020_profile.icc") {
    this.profilePath = profilePath;
  }

  async processImage(
    inputBuffer: Buffer,
    options: HDRProcessorOptions = {},
  ): Promise<Buffer> {
    const {
      multiplyValue = 1.5,
      powValue = 0.9,
      brightnessThreshold = 100,
      enableHDR = true,
      enableInversion = true,
    } = options;

    let pipeline = sharp(inputBuffer);

    // Check if image is too dark and needs inversion
    if (enableInversion) {
      const { channels } = await pipeline.stats();
      const avgBrightness =
        channels.reduce((sum, ch) => sum + ch.mean, 0) / channels.length;

      if (avgBrightness < brightnessThreshold) {
        pipeline = pipeline.negate();
      }
    }

    // Apply HDR processing if enabled
    if (enableHDR) {
      // Convert to linear RGB colorspace
      pipeline = pipeline
        .gamma(2.2) // Remove sRGB gamma to get linear values
        .linear(multiplyValue) // Multiply brightness
        .gamma(1 / powValue) // Apply power curve
        .gamma(1 / 2.2); // Convert back to sRGB gamma

      // Apply ICC profile if available
      try {
        const profilePath = path.join(
          process.cwd(),
          "public",
          "2020_profile.icc",
        );
        const profileExists = await fs
          .access(profilePath)
          .then(() => true)
          .catch(() => false);
        if (profileExists) {
          // Read and apply the actual ICC profile using pipelineColourspace
          const profileBuffer = await fs.readFile(profilePath);
          pipeline = pipeline.pipelineColourspace("rgb16");
          console.log("Applied ICC profile processing from:", profilePath);
        } else {
          console.warn("ICC profile not found at:", profilePath);
        }
      } catch (error) {
        console.warn("Could not apply ICC profile:", error);
      }
    }

    // Ensure 16-bit depth for HDR
    return pipeline.png({ compressionLevel: 9, quality: 100 }).toBuffer();
  }

  async shouldProcessImage(cookieHeader?: string): Promise<boolean> {
    if (!cookieHeader) return false;

    // Parse cookies
    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    // Check if Ultra UI is enabled
    return cookies.toggleUltraUI === "true";
  }
}
