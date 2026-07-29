import jsQR from "jsqr";

export interface ScanResult {
  text: string;
  location?: {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
  };
}

/**
 * Scan QR Code from an HTML Image Element or Canvas
 */
export function scanImageData(imageData: ImageData): ScanResult | null {
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  if (code) {
    return {
      text: code.data,
      location: code.location,
    };
  }
  return null;
}

/**
 * Scan QR Code from File (File -> Image -> ImageData -> jsQR)
 */
export async function decodeQRFromFile(file: File): Promise<ScanResult | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(null);
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const result = scanImageData(imageData);
        resolve(result);
      };
      img.onerror = () => reject(new Error("Failed to load image file"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
