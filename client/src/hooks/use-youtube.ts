import { useQuery } from "@tanstack/react-query";

export function useYouTubeVideos() {
  return useQuery({
    queryKey: ['/api/youtube/videos'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useYouTubeFeaturedVideo() {
  return useQuery({
    queryKey: ['/api/youtube/featured'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useYouTubeVideo(videoId: string | undefined) {
  return useQuery({
    queryKey: ['/api/youtube/video', videoId],
    enabled: !!videoId,
  });
}
