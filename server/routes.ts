import type { Express } from "express";
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

  const httpServer = createServer(app);

  return httpServer;
}
