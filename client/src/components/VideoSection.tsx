import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  thumbnails?: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };
  publishedAt: string;
  duration: string;
  viewCount: string;
  category: string;
  description: string;
}

const VideoSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [featuredVideoId, setFeaturedVideoId] = useState<string | null>(null);
  
  const { data: videos = [], isError: videosError } = useQuery<Video[]>({
    queryKey: ['/api/youtube/videos'],
  });
  
  const { data: featuredVideo, isError: featuredError } = useQuery<Video>({
    queryKey: ['/api/youtube/featured'],
  });

  // Use useEffect to update the featured video ID when data changes
  useEffect(() => {
    if (featuredVideo && featuredVideo.id) {
      setFeaturedVideoId(featuredVideo.id);
    }
  }, [featuredVideo]);
  
  const filteredVideos = videos 
    ? activeCategory === "all" 
      ? videos 
      : videos.filter(video => video.category.toLowerCase() === activeCategory)
    : [];
  
  const playVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const categories = [
    { id: "all", name: "All Videos" },
    { id: "live", name: "Live Shows" },
    { id: "music", name: "Music Videos" },
    { id: "behind", name: "Behind the Scenes" },
    { id: "interview", name: "Interviews" }
  ];

  return (
    <section id="videos" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-2">Videos</h2>
        <p className="text-gray-400 mb-12 max-w-2xl">Watch live performances, music videos, and behind-the-scenes content from VERE.</p>
        
        {/* API Error Message */}
        {(videosError || featuredError) && (
          <div className="mb-8 p-4 border border-[#FF0000]/30 bg-[#FF0000]/10 rounded-lg">
            <p className="text-white">
              <span className="font-medium">Note:</span> We're currently experiencing issues connecting to YouTube. Please visit our 
              <a 
                href="https://youtube.com/@vere9809?si=1KOkzlhCcFVbWZZD" 
                className="text-[#FF0000] ml-1 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube channel
              </a> directly to see our latest videos.
            </p>
          </div>
        )}
        
        {/* Featured Video */}
        <div className="mb-12">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            {featuredVideoId ? (
              <iframe 
                src={`https://www.youtube.com/embed/${featuredVideoId}?rel=0`}
                title="VERE Featured Video"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Live performance video thumbnail" 
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-zinc-900/30"></div>
                <button 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-800 hover:bg-purple-900 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                  onClick={() => featuredVideo && playVideo(featuredVideo.id)}
                >
                  <Play className="h-8 w-8" />
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-montserrat font-semibold text-xl text-white">
              {featuredVideo?.title || "VERE - Live at Electric Forest Festival"}
            </h3>
            <p className="text-gray-400">
              {featuredVideo?.description || "Full performance from the main stage, June 2023"}
            </p>
          </div>
        </div>
        
        {/* Video Categories */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin">
            {categories.map((category) => (
              <button 
                key={category.id}
                className={`px-5 py-2 ${activeCategory === category.id ? 'bg-purple-800' : 'bg-zinc-800 hover:bg-purple-800'} text-white rounded-full whitespace-nowrap transition-colors duration-300`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div key={video.id} className="group cursor-pointer" onClick={() => playVideo(video.id)}>
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                  <img 
                    src={video.thumbnail || video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url}
                    alt={`${video.title} thumbnail`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-zinc-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 right-3 bg-zinc-900/80 text-white text-sm px-2 py-1 rounded">{video.duration}</div>
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Play className="h-5 w-5" />
                  </button>
                </div>
                <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors duration-300">{video.title}</h4>
                <p className="text-gray-400 text-sm">{new Date(video.publishedAt).toLocaleDateString()} • {video.viewCount} views</p>
              </div>
            ))
          ) : (
            // Fallback for loading state or no videos
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="group">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-zinc-800"></div>
                <div className="h-5 w-full bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-zinc-800 rounded"></div>
              </div>
            ))
          )}
        </div>
        
        {/* YouTube Link */}
        <div className="mt-12 text-center">
          <a 
            href="https://youtube.com/@vere9809?si=1KOkzlhCcFVbWZZD" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-medium rounded-full transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
