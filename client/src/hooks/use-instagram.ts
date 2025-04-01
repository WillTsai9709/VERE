import { useQuery } from "@tanstack/react-query";

export function useInstagramGallery() {
  return useQuery({
    queryKey: ['/api/instagram/gallery'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useInstagramPost(postId: string | undefined) {
  return useQuery({
    queryKey: ['/api/instagram/post', postId],
    enabled: !!postId,
  });
}
