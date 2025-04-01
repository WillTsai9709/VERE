import { useQuery } from "@tanstack/react-query";

export function useSpotifyFeaturedTrack() {
  return useQuery({
    queryKey: ['/api/spotify/featured-track'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSpotifyPopularTracks() {
  return useQuery({
    queryKey: ['/api/spotify/popular-tracks'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSpotifyAlbums() {
  return useQuery({
    queryKey: ['/api/spotify/albums'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSpotifyTrack(trackId: string | undefined) {
  return useQuery({
    queryKey: ['/api/spotify/track', trackId],
    enabled: !!trackId,
  });
}
