/**
 * Generate optimized Cloudinary URL with transformations
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param quality - Image quality (default: auto)
 * @returns Optimized URL
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  width?: number,
  quality: string | number = 'auto'
): string {
  // If not a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Extract parts from URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Build transformation string
  const transformations: string[] = [];
  
  if (width) {
    transformations.push(`w_${width}`);
  }
  
  transformations.push(`q_${quality}`);
  transformations.push('f_auto'); // Auto format (WebP, AVIF)
  transformations.push('c_limit'); // Don't upscale

  const transformStr = transformations.join(',');
  
  return `${parts[0]}/upload/${transformStr}/${parts[1]}`;
}
