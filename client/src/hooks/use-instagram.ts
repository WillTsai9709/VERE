import { useQuery } from "@tanstack/react-query";

export function useInstagramGallery() {
  return useQuery({
    queryKey: ['/api/instagram/gallery'],
  });
}

export function useInstagramPost(postId: string | undefined) {
  return useQuery({
    queryKey: ['/api/instagram/post', postId],
    enabled: !!postId,
  });
}
