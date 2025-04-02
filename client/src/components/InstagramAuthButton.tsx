import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '../lib/queryClient';

export function InstagramAuthButton() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    checkInstagramAuth();
  }, []);

  const checkInstagramAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/instagram/status');
      const data = await response.json();
      
      setIsAuthenticated(data.authenticated);
      if (!data.authenticated && data.authUrl) {
        setAuthUrl(data.authUrl);
      }
    } catch (error) {
      console.error('Error checking Instagram auth:', error);
      toast({
        title: '无法检查Instagram授权状态',
        description: '请稍后再试',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = () => {
    if (authUrl) {
      // 在新窗口中打开授权URL
      window.open(authUrl, '_blank', 'width=600,height=700');
    }
  };

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="w-full">
        检查Instagram状态...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100" disabled>
        Instagram已连接
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleAuth} 
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
    >
      连接Instagram帐户
    </Button>
  );
}