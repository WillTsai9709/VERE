import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

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

export function useClearYouTubeCache() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/youtube/clear-cache");
    },
    onSuccess: () => {
      // 清除所有相关的YouTube查询缓存
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/featured'] });
      // 不必针对每个单独视频清除缓存，因为它们会在下次请求时重新获取
    },
  });
}
