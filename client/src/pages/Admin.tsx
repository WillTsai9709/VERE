import React from 'react';
import { InstagramAuthButton } from '../components/InstagramAuthButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useClearYouTubeCache } from '../hooks/use-youtube';
import { useClearInstagramCache } from '../hooks/use-instagram';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const clearYouTubeCacheMutation = useClearYouTubeCache();
  const clearInstagramCacheMutation = useClearInstagramCache();

  const handleClearYouTubeCache = async () => {
    try {
      await clearYouTubeCacheMutation.mutateAsync();
      toast({
        title: "YouTube缓存已清除",
        description: "视频数据将在下次加载时更新",
        variant: "default",
      });
    } catch (error) {
      console.error('Error clearing YouTube cache:', error);
      toast({
        title: "操作失败",
        description: "清除YouTube缓存时出错",
        variant: "destructive",
      });
    }
  };
  
  const handleClearInstagramCache = async () => {
    try {
      await clearInstagramCacheMutation.mutateAsync();
      toast({
        title: "Instagram缓存已清除",
        description: "Instagram相册数据将在下次加载时更新",
        variant: "default",
      });
    } catch (error) {
      console.error('Error clearing Instagram cache:', error);
      toast({
        title: "操作失败",
        description: "清除Instagram缓存时出错",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">网站管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Instagram连接卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>Instagram连接</CardTitle>
            <CardDescription>
              连接Instagram账户以显示您的最新照片和帖子
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              连接后，您的Instagram照片将自动显示在网站的相册部分。授权过程将在新窗口中打开。
            </p>
            <InstagramAuthButton />
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={handleClearInstagramCache}
              disabled={clearInstagramCacheMutation.isPending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${clearInstagramCacheMutation.isPending ? 'animate-spin' : ''}`} />
              {clearInstagramCacheMutation.isPending ? '清除中...' : '清除Instagram缓存'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* YouTube缓存管理卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>YouTube视频缓存</CardTitle>
            <CardDescription>
              管理网站上显示的YouTube视频数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              清除缓存将强制网站在下次加载时从YouTube获取最新的视频数据，而不是使用缓存的内容。
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={handleClearYouTubeCache}
              disabled={clearYouTubeCacheMutation.isPending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${clearYouTubeCacheMutation.isPending ? 'animate-spin' : ''}`} />
              {clearYouTubeCacheMutation.isPending ? '清除中...' : '清除YouTube缓存'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}