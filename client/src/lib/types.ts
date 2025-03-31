// Spotify Types
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  followers?: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  preview_url: string | null;
}

// YouTube Types
export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
  };
  publishedAt: string;
  duration: string;
  viewCount: string;
  category: string;
}

// Instagram Types
export interface InstagramImage {
  id: string;
  url: string;
  caption: string;
  thumbnail: string;
  timestamp: string;
  permalink: string;
}

// Artist Info Types
export interface ArtistInfo {
  name: string;
  bio: string;
  location: string;
  since: number;
  monthlyListeners: number;
  releases: number;
  countriesVisited: number;
  genres: string[];
}

export interface TourDate {
  id: string;
  date: string;
  venue: string;
  location: string;
  ticketLink: string;
}
