
/**
 * Utility functions for handling images
 */

/**
 * Validates and formats an image URL
 * This helps handle different URL formats and ensures they work properly
 * 
 * @param url The image URL to validate and format
 * @returns A properly formatted URL for use in the application
 */
export function validateImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Parse the URL to validate it
    const parsedUrl = new URL(url);
    
    // If it's a Supabase URL, ensure it has the correct format
    if (parsedUrl.hostname.includes('supabase.co')) {
      console.log('Processing Supabase URL:', url);
      // Ensure public access URLs have the correct format
      if (url.includes('/storage/v1/object/public/')) {
        return url;
      }
    }
    
    // Return the validated URL
    return url;
  } catch (error) {
    console.error('Invalid URL format:', url, error);
    return '';
  }
}

/**
 * Checks if an image exists at the given URL
 * 
 * @param url The image URL to check
 * @returns Promise that resolves to true if image exists, false otherwise
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      console.log('Image exists at URL:', url);
      resolve(true);
    };
    
    img.onerror = () => {
      console.error('Image does not exist at URL:', url);
      resolve(false);
    };
    
    img.src = url;
  });
}

/**
 * Formats image URLs for display
 * This is particularly helpful for Supabase storage URLs
 * 
 * @param url The original image URL
 * @returns A properly formatted URL for display
 */
export function formatImageUrl(url: string): string {
  if (!url) return '';
  
  const validatedUrl = validateImageUrl(url);
  
  // Add cache-busting parameter to prevent caching issues
  if (validatedUrl) {
    const separator = validatedUrl.includes('?') ? '&' : '?';
    return `${validatedUrl}${separator}t=${Date.now()}`;
  }
  
  return '';
}
