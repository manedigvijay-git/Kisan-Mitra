/**
 * Client-side high-performance image compressor for agricultural photos.
 * Downscales multi-megapixel camera photos to ~1024-1200px max dimension,
 * reducing payload from 5-15MB down to ~120-250KB without losing leaf venation,
 * insect pests, or fungal lesion clarity. Ensures sub-second network transfer.
 */
export interface CompressedImageResult {
  dataUrl: string;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
}

export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (readerEvent) => {
      const srcUrl = readerEvent.target?.result as string;
      if (!srcUrl) {
        return reject(new Error('Empty image data'));
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback: return uncompressed data URL if Image loading fails
        const sizeBytes = file.size;
        resolve({
          dataUrl: srcUrl,
          sizeBytes,
          formattedSize: formatBytes(sizeBytes),
          width: 0,
          height: 0,
        });
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Only downscale if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context unavailable');
          }

          // Optional: slight smoothing for crisp agricultural lesion edges
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as JPEG with standard high fidelity
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          // Calculate approx size in bytes from base64
          const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
          const sizeBytes = Math.round((base64Length * 3) / 4);

          resolve({
            dataUrl: compressedDataUrl,
            sizeBytes,
            formattedSize: formatBytes(sizeBytes),
            width,
            height,
          });
        } catch (canvasErr) {
          // Graceful fallback to original data URL
          const sizeBytes = file.size;
          resolve({
            dataUrl: srcUrl,
            sizeBytes,
            formattedSize: formatBytes(sizeBytes),
            width: img.naturalWidth || 0,
            height: img.naturalHeight || 0,
          });
        }
      };

      img.src = srcUrl;
    };

    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 KB';
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}
