
/**
 * Enhanced utility functions for handling images
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
    // Strip spaces and validate URL format
    const trimmedUrl = url.trim();
    
    // Parse the URL to validate it
    const parsedUrl = new URL(trimmedUrl);
    
    // If it's a Supabase URL, ensure it has the correct format
    if (parsedUrl.hostname.includes('supabase.co')) {
      console.log('Processing Supabase URL:', trimmedUrl);
      
      // Ensure public access URLs have the correct format
      if (trimmedUrl.includes('/storage/v1/object/public/')) {
        return trimmedUrl;
      }
      
      // If it's not a public URL already, try to convert it
      if (trimmedUrl.includes('/storage/v1/object/')) {
        return trimmedUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
      }
    }
    
    // Handle other common image URLs
    if (parsedUrl.hostname.includes('imgur.com') || 
        parsedUrl.hostname.includes('cloudinary.com') || 
        parsedUrl.hostname.includes('amazonaws.com')) {
      console.log('Using cloud storage URL:', trimmedUrl);
    }
    
    // Return the validated URL
    return trimmedUrl;
  } catch (error) {
    console.error('Invalid URL format:', url, error);
    
    // If it doesn't parse as a URL but looks like a path, try to make it a valid URL
    if (url.startsWith('/') && !url.startsWith('//')) {
      console.log('Attempting to convert relative path to absolute URL');
      // Convert relative path to absolute URL using current origin
      return `${window.location.origin}${url}`;
    }
    
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
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      console.log('Image loaded successfully:', url);
      resolve(true);
    };
    
    img.onerror = (error) => {
      console.error('Image failed to load:', url, error);
      resolve(false);
    };
    
    // Add crossOrigin attribute to handle CORS issues
    img.crossOrigin = 'anonymous';
    img.src = url;
    
    // Set a timeout to resolve false after 10 seconds in case the image takes too long
    const timeout = setTimeout(() => {
      console.warn('Image load timed out:', url);
      resolve(false);
    }, 10000);
    
    // Clear the timeout if the image loads or errors out before the timeout
    img.onload = () => {
      clearTimeout(timeout);
      console.log('Image loaded successfully:', url);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.error('Image failed to load:', url);
      resolve(false);
    };
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
  
  if (!validatedUrl) return '';
  
  // Add cache-busting parameter for development environments
  if (import.meta.env.DEV) {
    const separator = validatedUrl.includes('?') ? '&' : '?';
    return `${validatedUrl}${separator}t=${Date.now()}`;
  }
  
  return validatedUrl;
}

/**
 * Handles errors when images fail to load
 * 
 * @param event The error event
 * @param fallbackSrc Optional fallback image source
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, fallbackSrc = '/placeholder.svg'): void {
  const img = event.currentTarget;
  console.warn('Image failed to load, using fallback:', img.src);
  img.src = fallbackSrc;
  img.onerror = null; // Prevent infinite error loop
}

/**
 * Gets an optimized image URL for different screen sizes
 * 
 * @param url The original image URL
 * @param size The desired size (small, medium, large)
 * @returns The optimized image URL
 */
export function getOptimizedImageUrl(url: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!url) return '';
  
  const validatedUrl = validateImageUrl(url);
  
  if (!validatedUrl) return '';
  
  // For cloud storage providers that support image transformations
  if (validatedUrl.includes('cloudinary.com')) {
    const widths = { small: 256, medium: 512, large: 1024 };
    const width = widths[size];
    return validatedUrl.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  
  // No optimization available, return the validated URL
  return validatedUrl;
}
