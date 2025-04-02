import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import spotifyApi from "./api/spotify";
import youtubeApi from "./api/youtube";
import instagramApi from "./api/instagram";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/artist/info", async (req, res) => {
    try {
      const artistData = await storage.getArtistInfo();
      res.json(artistData);
    } catch (error) {
      console.error("Error fetching artist info:", error);
      res.status(500).json({ message: "Failed to fetch artist information" });
    }
  });

  app.get("/api/artist/tour-dates", async (req, res) => {
    try {
      const tourDates = await storage.getTourDates();
      res.json(tourDates);
    } catch (error) {
      console.error("Error fetching tour dates:", error);
      res.status(500).json({ message: "Failed to fetch tour dates" });
    }
  });

  // Spotify API routes
  app.get("/api/spotify/featured-track", async (req, res) => {
    try {
      const track = await spotifyApi.getFeaturedTrack();
      res.json(track);
    } catch (error) {
      console.error("Error fetching featured track:", error);
      res.status(500).json({ message: "Failed to fetch featured track from Spotify" });
    }
  });

  app.get("/api/spotify/popular-tracks", async (req, res) => {
    try {
      const tracks = await spotifyApi.getPopularTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching popular tracks:", error);
      res.status(500).json({ message: "Failed to fetch popular tracks from Spotify" });
    }
  });

  app.get("/api/spotify/albums", async (req, res) => {
    try {
      const albums = await spotifyApi.getAlbums();
      res.json(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ message: "Failed to fetch albums from Spotify" });
    }
  });

  app.get("/api/spotify/track/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const track = await spotifyApi.getTrack(id);
      res.json(track);
    } catch (error) {
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Failed to fetch track from Spotify" });
    }
  });
  
  // API health check and status routes
  app.get("/api/status", async (req: Request, res: Response) => {
    const services = {
      spotify: { status: "unknown", message: "" },
      youtube: { status: "unknown", message: "" },
      instagram: { status: "unknown", message: "" }
    };
    
    // Check Spotify API status
    try {
      await spotifyApi.getArtistProfile();
      services.spotify = { status: "up", message: "Spotify API is working" };
    } catch (error: any) {
      services.spotify = { 
        status: "down", 
        message: `Spotify API error: ${error.message}` 
      };
    }
    
    // Check YouTube API status
    try {
      await youtubeApi.getVideos();
      services.youtube = { status: "up", message: "YouTube API is working" };
    } catch (error: any) {
      services.youtube = {
        status: "down",
        message: `YouTube API error: ${error.message}`
      };
    }
    
    // Return status of all services
    res.json({
      status: "ok",
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      services
    });
  });

  // YouTube API routes
  app.get("/api/youtube/videos", async (req, res) => {
    try {
      const videos = await youtubeApi.getVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos from YouTube" });
    }
  });

  app.get("/api/youtube/featured", async (req, res) => {
    try {
      const video = await youtubeApi.getFeaturedVideo();
      res.json(video);
    } catch (error) {
      console.error("Error fetching featured video:", error);
      res.status(500).json({ message: "Failed to fetch featured video from YouTube" });
    }
  });

  app.get("/api/youtube/video/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const video = await youtubeApi.getVideo(id);
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video from YouTube" });
    }
  });
  
  // 清除 YouTube API 缓存的路由
  app.post("/api/youtube/clear-cache", async (req, res) => {
    try {
      youtubeApi.clearCache();
      res.json({ success: true, message: "YouTube API cache cleared successfully" });
    } catch (error) {
      console.error("Error clearing YouTube API cache:", error);
      res.status(500).json({ message: "Failed to clear YouTube API cache" });
    }
  });

  // Instagram API routes
  app.get("/api/instagram/gallery", async (req, res) => {
    try {
      const gallery = await instagramApi.getGallery();
      res.json(gallery);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery from Instagram" });
    }
  });

  app.get("/api/instagram/post/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await instagramApi.getPost(id);
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post from Instagram" });
    }
  });
  
  // Instagram OAuth 流程
  app.get("/api/instagram/auth", (req, res) => {
    const appId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/instagram/callback`);
    const scope = 'user_profile,user_media';
    
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    res.json({ authUrl });
  });
  
  app.get("/api/instagram/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ error: "Authorization code missing" });
      }
      
      const appId = process.env.INSTAGRAM_APP_ID;
      const appSecret = process.env.INSTAGRAM_APP_SECRET;
      const redirectUri = `${req.protocol}://${req.get('host')}/api/instagram/callback`;
      
      // 获取短期访问令牌
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: appId as string,
          client_secret: appSecret as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code as string
        })
      });
      
      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Failed to get Instagram access token: ${error}`);
      }
      
      const shortLivedToken = await tokenResponse.json();
      console.log('Short-lived token received:', shortLivedToken);
      
      // 获取长期访问令牌
      const longLivedTokenRes = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken.access_token}`
      );
      
      if (!longLivedTokenRes.ok) {
        const error = await longLivedTokenRes.text();
        throw new Error(`Failed to get long-lived token: ${error}`);
      }
      
      const longLivedToken = await longLivedTokenRes.json();
      console.log('Long-lived token received:', longLivedToken);
      
      // 将令牌保存到内存中（在生产环境应存储到安全的位置）
      process.env.INSTAGRAM_ACCESS_TOKEN = longLivedToken.access_token;
      
      // 重定向回应用首页
      res.redirect('/');
    } catch (error) {
      console.error('Instagram auth error:', error);
      res.status(500).json({ error: 'Instagram authentication failed' });
    }
  });
  
  app.get("/api/instagram/status", async (req, res) => {
    try {
      const hasToken = !!process.env.INSTAGRAM_ACCESS_TOKEN;
      
      if (!hasToken) {
        const appId = process.env.INSTAGRAM_APP_ID;
        const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/instagram/callback`);
        const scope = 'user_profile,user_media';
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        
        return res.json({ 
          authenticated: false, 
          authUrl 
        });
      }
      
      // 尝试获取用户资料以验证令牌是否有效
      try {
        const profile = await instagramApi.getUserProfile();
        return res.json({ 
          authenticated: true, 
          profile 
        });
      } catch (profileError) {
        console.error('Instagram profile error:', profileError);
        return res.json({ 
          authenticated: false,
          error: 'Token invalid or expired'
        });
      }
    } catch (error) {
      console.error('Instagram status error:', error);
      res.status(500).json({ error: 'Failed to check Instagram status' });
    }
  });
  
  // 清除 Instagram API 缓存的路由
  app.post("/api/instagram/clear-cache", async (req, res) => {
    try {
      instagramApi.clearCache();
      res.json({ success: true, message: "Instagram API cache cleared successfully" });
    } catch (error) {
      console.error("Error clearing Instagram API cache:", error);
      res.status(500).json({ message: "Failed to clear Instagram API cache" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
