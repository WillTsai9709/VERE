import { useQuery } from "@tanstack/react-query";

export function useYouTubeVideos() {
  return useQuery({
    queryKey: ['/api/youtube/videos'],
  });
}

export function useYouTubeFeaturedVideo() {
  return useQuery({
    queryKey: ['/api/youtube/featured'],
  });
}

export function useYouTubeVideo(videoId: string | undefined) {
  return useQuery({
    queryKey: ['/api/youtube/video', videoId],
    enabled: !!videoId,
  });
}
