import { useQuery } from "@tanstack/react-query";

export function useSpotifyFeaturedTrack() {
  return useQuery({
    queryKey: ['/api/spotify/featured-track'],
  });
}

export function useSpotifyPopularTracks() {
  return useQuery({
    queryKey: ['/api/spotify/popular-tracks'],
  });
}

export function useSpotifyAlbums() {
  return useQuery({
    queryKey: ['/api/spotify/albums'],
  });
}

export function useSpotifyTrack(trackId: string | undefined) {
  return useQuery({
    queryKey: ['/api/spotify/track', trackId],
    enabled: !!trackId,
  });
}
