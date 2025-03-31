import { SpotifyTrack, SpotifyAlbum } from "@/lib/types";
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
    console.error(`Spotify API error for ${key}:`, error);
    
    // If we have stale cache, return it as fallback
    if (cached) {
      console.log(`Using stale cache for ${key}`);
      return cached.data as T;
    }
    
    throw error;
  }
};

// Fetch data from Spotify API
const fetchFromSpotify = async (endpoint: string) => {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error("Spotify access token not available");
  }
  
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
    throw new Error(`Spotify API error: ${error.error?.message || response.statusText}`);
  }
  
  return response.json();
};

// Spotify API client
const spotifyApi = {
  // Get featured track
  getFeaturedTrack: async (): Promise<SpotifyTrack> => {
    return getCachedOrFetch<SpotifyTrack>(
      'spotify:featured-track',
      async () => {
        const data = await fetchFromSpotify('/artists/4LE04Repf0XC6R1oAFU1bA/top-tracks?market=US');
        return data.tracks[0];
      },
      CACHE_DURATION.MEDIUM
    );
  },
  
  // Get popular tracks
  getPopularTracks: async (): Promise<SpotifyTrack[]> => {
    return getCachedOrFetch<SpotifyTrack[]>(
      'spotify:popular-tracks',
      async () => {
        const data = await fetchFromSpotify('/artists/4LE04Repf0XC6R1oAFU1bA/top-tracks?market=US');
        return data.tracks.slice(0, 4);
      },
      CACHE_DURATION.SHORT
    );
  },
  
  // Get albums
  getAlbums: async (): Promise<SpotifyAlbum[]> => {
    return getCachedOrFetch<SpotifyAlbum[]>(
      'spotify:albums',
      async () => {
        const data = await fetchFromSpotify('/artists/4LE04Repf0XC6R1oAFU1bA/albums?include_groups=album,single,compilation&limit=5&market=US');
        return data.items;
      },
      CACHE_DURATION.LONG
    );
  },
  
  // Get a specific track
  getTrack: async (trackId: string): Promise<SpotifyTrack> => {
    return getCachedOrFetch<SpotifyTrack>(
      `spotify:track:${trackId}`,
      async () => {
        return await fetchFromSpotify(`/tracks/${trackId}?market=US`);
      },
      CACHE_DURATION.LONG
    );
  },
  
  // Get artist profile
  getArtistProfile: async (artistId: string = '4LE04Repf0XC6R1oAFU1bA') => {
    return getCachedOrFetch(
      `spotify:artist:${artistId}`,
      async () => {
        return await fetchFromSpotify(`/artists/${artistId}`);
      },
      CACHE_DURATION.LONG
    );
  },
  
  // Search for tracks
  searchTracks: async (query: string) => {
    return getCachedOrFetch(
      `spotify:search:${query}`,
      async () => {
        const data = await fetchFromSpotify(`/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
        return data.tracks.items;
      },
      CACHE_DURATION.SHORT
    );
  }
};

export default spotifyApi;
