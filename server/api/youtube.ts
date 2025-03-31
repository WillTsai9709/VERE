import { YouTubeVideo } from "@/lib/types";
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
    console.error(`YouTube API error for ${key}:`, error);
    
    // If we have stale cache, return it as fallback
    if (cached) {
      console.log(`Using stale cache for ${key}`);
      return cached.data as T;
    }
    
    throw error;
  }
};

// Format duration from ISO 8601 format
const formatDuration = (isoDuration: string): string => {
  // PT1H23M45S -> 1:23:45
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format view count
const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount, 10);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return viewCount;
};

// Fetch data from YouTube API
const fetchFromYouTube = async (endpoint: string, params: Record<string, string>) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error("YouTube API key not available");
  }
  
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  url.searchParams.append('key', apiKey);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
    throw new Error(`YouTube API error: ${error.error?.message || response.statusText}`);
  }
  
  return response.json();
};

// Determine video category based on title and description
const determineCategory = (video: any): string => {
  const title = video.snippet.title.toLowerCase();
  const description = video.snippet.description?.toLowerCase() || '';
  
  if (title.includes('live') || title.includes('perform') || description.includes('live') || description.includes('performance')) {
    return 'live';
  }
  
  if (title.includes('music video') || title.includes('official video') || title.includes('official audio')) {
    return 'music';
  }
  
  if (title.includes('behind') || title.includes('making of') || description.includes('behind the scenes')) {
    return 'behind';
  }
  
  if (title.includes('interview') || description.includes('interview')) {
    return 'interview';
  }
  
  return 'music'; // Default category
};

// Transform YouTube API response to our desired format
const transformVideo = async (video: any, contentDetails?: any, statistics?: any): Promise<YouTubeVideo> => {
  let duration = "0:00";
  let viewCount = "0";
  
  // If we have content details and statistics (from videos endpoint)
  if (contentDetails && statistics) {
    duration = formatDuration(contentDetails.duration);
    viewCount = formatViewCount(statistics.viewCount);
  } 
  // If we need to fetch them separately (from search endpoint)
  else if (video.id.videoId) {
    try {
      const details = await fetchFromYouTube('videos', {
        part: 'contentDetails,statistics',
        id: video.id.videoId
      });
      
      if (details.items && details.items.length > 0) {
        duration = formatDuration(details.items[0].contentDetails.duration);
        viewCount = formatViewCount(details.items[0].statistics.viewCount);
      }
    } catch (error) {
      console.error('Error fetching video details', error);
    }
  }
  
  return {
    id: video.id.videoId || video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnails: video.snippet.thumbnails,
    publishedAt: video.snippet.publishedAt,
    duration,
    viewCount,
    category: determineCategory(video)
  };
};

// YouTube API client
const youtubeApi = {
  // Get videos
  getVideos: async (): Promise<YouTubeVideo[]> => {
    return getCachedOrFetch<YouTubeVideo[]>(
      'youtube:videos',
      async () => {
        const data = await fetchFromYouTube('search', {
          part: 'snippet',
          channelId: 'UC_kRDdJJBmZ-RUEUKLqu3Ug', // VERE channel ID (example)
          maxResults: '6',
          order: 'date',
          type: 'video'
        });
        
        // Process videos in parallel
        const videos = await Promise.all(
          data.items.map((item: any) => transformVideo(item))
        );
        
        return videos;
      },
      CACHE_DURATION.MEDIUM
    );
  },
  
  // Get featured video
  getFeaturedVideo: async (): Promise<YouTubeVideo> => {
    return getCachedOrFetch<YouTubeVideo>(
      'youtube:featured',
      async () => {
        const data = await fetchFromYouTube('search', {
          part: 'snippet',
          channelId: 'UC_kRDdJJBmZ-RUEUKLqu3Ug', // VERE channel ID (example)
          maxResults: '1',
          order: 'viewCount',
          type: 'video'
        });
        
        if (!data.items || data.items.length === 0) {
          throw new Error('No featured video found');
        }
        
        return await transformVideo(data.items[0]);
      },
      CACHE_DURATION.MEDIUM
    );
  },
  
  // Get a specific video
  getVideo: async (videoId: string): Promise<YouTubeVideo> => {
    return getCachedOrFetch<YouTubeVideo>(
      `youtube:video:${videoId}`,
      async () => {
        const data = await fetchFromYouTube('videos', {
          part: 'snippet,contentDetails,statistics',
          id: videoId
        });
        
        if (!data.items || data.items.length === 0) {
          throw new Error(`Video with ID ${videoId} not found`);
        }
        
        const video = data.items[0];
        return await transformVideo(
          {
            id: video.id,
            snippet: video.snippet
          },
          video.contentDetails,
          video.statistics
        );
      },
      CACHE_DURATION.LONG
    );
  },
  
  // Search for videos
  searchVideos: async (query: string): Promise<YouTubeVideo[]> => {
    return getCachedOrFetch<YouTubeVideo[]>(
      `youtube:search:${query}`,
      async () => {
        const data = await fetchFromYouTube('search', {
          part: 'snippet',
          q: query,
          maxResults: '10',
          type: 'video'
        });
        
        const videos = await Promise.all(
          data.items.map((item: any) => transformVideo(item))
        );
        
        return videos;
      },
      CACHE_DURATION.SHORT
    );
  }
};

export default youtubeApi;
