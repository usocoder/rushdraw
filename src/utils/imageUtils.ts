
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
      resolve(true);
    };
    
    img.onerror = () => {
      resolve(false);
    };
    
    img.src = url;
  });
}
