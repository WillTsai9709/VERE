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

// Token management
let tokenData: {
  access_token: string;
  expires_at: number;
} | null = null;

/**
 * Get a valid Spotify access token, requesting a new one if needed
 */
const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  
  // If we have a valid token, return it
  if (tokenData && tokenData.expires_at > now) {
    return tokenData.access_token;
  }
  
  // Otherwise, get a new token
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("Spotify client credentials are not available");
  }
  
  try {
    console.log("Requesting new Spotify access token...");
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to get Spotify access token: ${response.status} ${response.statusText} - ${errorData}`);
    }
    
    const data = await response.json();
    
    // Store token with expiry time (subtracting 60 seconds as a buffer)
    tokenData = {
      access_token: data.access_token,
      expires_at: now + (data.expires_in * 1000) - 60000
    };
    
    console.log("New Spotify access token received");
    return tokenData.access_token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
};

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
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // If token is expired (401), clear token data and retry once
      if (response.status === 401 && tokenData) {
        console.log("Access token expired, clearing and retrying...");
        tokenData = null;
        return fetchFromSpotify(endpoint);
      }
      
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      throw new Error(`Spotify API error: ${error.error?.message || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching from Spotify API (${endpoint}):`, error);
    throw error;
  }
};

// Spotify API client
const spotifyApi = {
  // Get featured track
  getFeaturedTrack: async (): Promise<SpotifyTrack> => {
    return getCachedOrFetch<SpotifyTrack>(
      'spotify:featured-track',
      async () => {
        const data = await fetchFromSpotify('/artists/4EXkqFOhrs5mcfZwFgiEOF/top-tracks?market=US');
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
        const data = await fetchFromSpotify('/artists/4EXkqFOhrs5mcfZwFgiEOF/top-tracks?market=US');
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
        const data = await fetchFromSpotify('/artists/4EXkqFOhrs5mcfZwFgiEOF/albums?include_groups=album,single,compilation&limit=5&market=US');
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
  getArtistProfile: async (artistId: string = '4EXkqFOhrs5mcfZwFgiEOF') => {
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
