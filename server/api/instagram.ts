import { InstagramImage } from "@/lib/types";
import { storage } from "../storage";

// Cache durations in milliseconds
const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 60 * 60 * 1000, // 1 hour
  LONG: 24 * 60 * 60 * 1000 // 24 hours
};

// In-memory cache
const cache = new Map<string, { data: any, expires: number }>();

// Get data from cache or fetch it if not cached or expired
const getCachedOrFetch = async <T>(key: string, fetchFn: () => Promise<T>, duration: number): Promise<T> => {
  const now = Date.now();
  const cached = cache.get(key);
  
  if (cached && cached.expires > now) {
    return cached.data as T;
  }
  
  try {
    const data = await fetchFn();
    cache.set(key, {
      data,
      expires: now + duration
    });
    return data;
  } catch (error) {
    console.error(`Instagram API error for ${key}:`, error);
    
    // If we have stale cache, return it as fallback
    if (cached) {
      console.log(`Using stale cache for ${key}`);
      return cached.data as T;
    }
    
    throw error;
  }
};

// Fetch data from Instagram API (Basic Display API)
const fetchFromInstagram = async (endpoint: string, accessToken?: string) => {
  const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error("Instagram access token not available");
  }
  
  const url = new URL(`https://graph.instagram.com/v13.0${endpoint}`);
  
  // Add access token to query parameters if not already in the URL
  if (!url.searchParams.has('access_token')) {
    url.searchParams.append('access_token', token);
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
    throw new Error(`Instagram API error: ${error.error?.message || response.statusText}`);
  }
  
  return response.json();
};

// Helper function to clean caption text
const cleanCaption = (caption: string): string => {
  // Remove hashtags
  let cleaned = caption.replace(/#[^\s#]+/g, '').trim();
  
  // Limit length
  if (cleaned.length > 120) {
    cleaned = cleaned.substring(0, 120) + '...';
  }
  
  return cleaned;
};

// Transform Instagram media to our format
const transformMedia = (media: any): InstagramImage => {
  return {
    id: media.id,
    url: media.media_url || media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url,
    caption: media.caption ? cleanCaption(media.caption) : 'VERE Instagram post',
    thumbnail: media.thumbnail_url || media.media_url,
    timestamp: media.timestamp,
    permalink: media.permalink
  };
};

// Instagram API client
const instagramApi = {
  // Get user profile
  getUserProfile: async (): Promise<any> => {
    return getCachedOrFetch(
      'instagram:profile',
      async () => {
        return await fetchFromInstagram('/me?fields=id,username,account_type,media_count');
      },
      CACHE_DURATION.LONG
    );
  },
  
  // Get media (posts)
  getMedia: async (limit: number = 20): Promise<any[]> => {
    return getCachedOrFetch(
      `instagram:media:${limit}`,
      async () => {
        const data = await fetchFromInstagram(`/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}`);
        return data.data;
      },
      CACHE_DURATION.MEDIUM
    );
  },
  
  // Get gallery (processed images)
  getGallery: async (): Promise<InstagramImage[]> => {
    return getCachedOrFetch<InstagramImage[]>(
      'instagram:gallery',
      async () => {
        const media = await instagramApi.getMedia(8);
        
        // Filter out only photo and video posts
        const images = media
          .filter(item => ['IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'].includes(item.media_type))
          .map(transformMedia);
        
        return images;
      },
      CACHE_DURATION.SHORT
    );
  },
  
  // Get a specific post
  getPost: async (mediaId: string): Promise<InstagramImage> => {
    return getCachedOrFetch<InstagramImage>(
      `instagram:post:${mediaId}`,
      async () => {
        const data = await fetchFromInstagram(`/${mediaId}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp`);
        return transformMedia(data);
      },
      CACHE_DURATION.LONG
    );
  },
  
  // Get long-lived access token
  refreshAccessToken: async (accessToken: string): Promise<string> => {
    const clientSecret = process.env.INSTAGRAM_APP_SECRET;
    
    if (!clientSecret) {
      throw new Error("Instagram app secret not available");
    }
    
    const url = new URL('https://graph.instagram.com/access_token');
    url.searchParams.append('grant_type', 'ig_refresh_token');
    url.searchParams.append('access_token', accessToken);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to refresh Instagram access token: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  },
  
  // Clear cache for testing or refreshing data
  clearCache: () => {
    cache.clear();
    console.log("Instagram API cache cleared");
  }
};

export default instagramApi;
