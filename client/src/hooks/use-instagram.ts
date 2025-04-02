import { useQuery, useMutation } from "@tanstack/react-query";
import { InstagramImage } from "../lib/types";
import { apiRequest, queryClient } from "../lib/queryClient";

// 获取Instagram授权状态
export function useInstagramAuthStatus() {
  return useQuery({
    queryKey: ['/api/instagram/status'],
    refetchOnWindowFocus: false,
  });
}

// 获取Instagram相册图片
export function useInstagramGallery() {
  return useQuery<InstagramImage[]>({
    queryKey: ['/api/instagram/gallery'],
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// 获取特定Instagram帖子
export function useInstagramPost(postId: string | undefined) {
  return useQuery<InstagramImage>({
    queryKey: ['/api/instagram/post', postId],
    enabled: !!postId,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

// 清除Instagram缓存
export function useClearInstagramCache() {
  return useMutation({
    mutationFn: async () => {
      return fetch('/api/instagram/clear-cache', { 
        method: 'POST',
        credentials: 'include'
      });
    },
    onSuccess: () => {
      // 清除所有相关的查询缓存
      queryClient.invalidateQueries({ queryKey: ['/api/instagram/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/instagram/post'] });
    },
  });
}