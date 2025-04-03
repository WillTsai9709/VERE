import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Play, Volume2 } from "lucide-react";
import MusicPlayer from "./ui/music-player";

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  release_date: string;
}

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
  album_type: string;
}

const MusicSection = () => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  
  const { 
    data: featuredTrack, 
    isLoading: isLoadingFeaturedTrack,
    isError: isErrorFeaturedTrack
  } = useQuery<Track>({
    queryKey: ['/api/spotify/featured-track'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  const { 
    data: popularTracks = [], 
    isLoading: isLoadingPopularTracks,
    isError: isErrorPopularTracks
  } = useQuery<Track[]>({
    queryKey: ['/api/spotify/popular-tracks'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  const { 
    data: albums = [], 
    isLoading: isLoadingAlbums,
    isError: isErrorAlbums
  } = useQuery<Album[]>({
    queryKey: ['/api/spotify/albums'],
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  const playTrack = (trackId: string) => {
    setCurrentTrackId(trackId);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section id="music" className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-2">Latest Music</h2>
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-4 chinese-text">最新音樂</h2>
        <p className="text-gray-400 mb-4 max-w-2xl">Stream the latest releases and favorite tracks from VERE's discography on Spotify.</p>
        <p className="text-gray-400 mb-12 max-w-2xl chinese-text">在 Spotify 上播放 VERE 最新發行的作品和熱門歌曲。</p>
        
        {/* Featured Track with Player */}
        <Card className="bg-zinc-800 rounded-xl p-6 mb-12 shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Album Art */}
              <div className="md:w-1/4">
                {featuredTrack ? (
                  <img 
                    src={featuredTrack.album?.images[0]?.url || "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"}
                    alt={`${featuredTrack.name} album cover`}
                    className="w-full h-auto rounded-lg shadow-md aspect-square object-cover"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                    alt="Nebula Dreams album cover"
                    className="w-full h-auto rounded-lg shadow-md aspect-square object-cover"
                  />
                )}
              </div>
              
              {/* Track Info and Player */}
              <div className="md:w-3/4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-montserrat font-bold text-2xl text-white">{featuredTrack?.name || "Nebula Dreams"}</h3>
                    <div className="flex space-x-2">
                      <p className="text-pink-500 mb-1">Latest Single</p>
                      <p className="text-pink-500 mb-1 chinese-text">最新單曲</p>
                    </div>
                    <div className="flex space-x-2">
                      <p className="text-gray-400 text-sm">Released: {new Date(featuredTrack?.release_date || "2023-10-12").toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-gray-400 text-sm chinese-text">發行日期: {new Date(featuredTrack?.release_date || "2023-10-12").toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="text-gray-400 hover:text-white transition-colors duration-300">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors duration-300">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Audio Player */}
                <MusicPlayer 
                  trackId={featuredTrack?.id || ''}
                  onPlay={() => featuredTrack?.id && playTrack(featuredTrack.id)}
                />
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <a 
                    href={`https://open.spotify.com/track/${featuredTrack?.id || ''}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-5 py-2 bg-[#1DB954] hover:bg-[#1AA64B] text-white font-medium rounded-full transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span className="mr-1">Play on Spotify</span>
                    <span className="chinese-text">在 Spotify 上播放</span>
                  </a>
                  <a 
                    href="https://music.apple.com/tw/artist/vere/290581407" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.51-3.19 0-1.38.64-2.3.51-3.15-.32C3.11 15.41 4.43 7.7 9.35 7.45c1.48-.08 2.5.58 3.31.58.81 0 2.33-.72 3.94-.61 1.02.03 3.85.4 5.69 3.09-4.51 2.64-3.79 9.38.76 11.77-.91 1.33-1.97 2.85-4 3zm-2.98-17.13c.91-1.08 2.43-1.89 3.69-1.94.17 1.4-.42 2.8-1.27 3.82-.9 1.08-2.37 1.9-3.83 1.79-.19-1.35.5-2.75 1.41-3.67z"/>
                    </svg>
                    Apple Music
                  </a>
                  <a 
                    href="https://music.youtube.com/channel/UCXIan07GZvhijAOcmz-CBqA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm2.052-8.448l-3.72 2.16c-.192.096-.384 0-.384-.216V8.016c0-.216.192-.312.384-.216l3.96 2.304c.192.096.192.336-.24.552z"/>
                    </svg>
                    YouTube Music
                  </a>
                  <a 
                    href="https://music.amazon.com/artists/B001FLJXUG/vere" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.42 14.79c-.47-.37-1.13-.69-2.04-.69-1.4 0-2.8.81-2.8 2.4 0 1.21.77 2 2.41 2 .97 0 1.94-.42 2.53-1.35.1-.19.25-.57.25-.89v-1.32c0-.09-.09-.19-.19-.19h-2.2c-.1 0-.19.09-.19.19v.7c0 .1.09.19.19.19h1.17v.33c0 .12 0 .21-.4.31-.22.25-.59.37-1.01.37-.77 0-1.15-.5-1.15-1.24 0-.89.47-1.49 1.24-1.49.55 0 .84.27 1.13.5.08.07.21.05.28-.04l.37-.63c.04-.06.02-.15-.05-.2-1.17-.71-3.57-.56-3.57 2.15 0 1.29.81 2.27 2.32 2.27.77 0 1.34-.21 1.77-.51.08-.06.13-.17.13-.27v-1.59zm1.49-1.4c-.32-.22-.59-.28-.93-.28-.35 0-.7.12-.96.55-.04.07-.13.07-.17-.02-.12-.27-.34-.53-.66-.53-.38 0-.7.19-.93.54-.02.04-.07.03-.07-.02v-.4c0-.05-.04-.1-.09-.1h-.81c-.04 0-.09.05-.09.1v3.38c0 .05.04.1.09.1h.87c.04 0 .09-.05.09-.1v-1.95c0-.14.01-.32.06-.41.09-.16.23-.25.41-.25.31 0 .38.22.38.49v2.12c0 .05.04.1.09.1h.87c.04 0 .09-.05.09-.1v-1.95c0-.14.01-.32.06-.41.09-.16.23-.25.41-.25.31 0 .38.22.38.49v2.12c0 .05.04.1.09.1h.87c.04 0 .09-.05.09-.1v-2.35c0-.65-.31-1.02-.75-1.28zm-8.11-1.63c.26-.26.38-.58.38-.94 0-.34-.12-.66-.38-.91-.26-.25-.57-.38-.94-.38H7.62c-.05 0-.1.05-.1.1v4.17c0 .05.05.1.1.1h3.23c.37 0 .7-.13.96-.38.26-.26.39-.58.39-.93.01-.36-.12-.68-.39-.93-.13-.13-.3-.21-.46-.26.15-.04.29-.12.42-.24zm-.88 1.47c0 .12-.04.23-.13.31-.09.09-.19.13-.32.13H8.52v-2.66h1.95c.12 0 .23.04.32.13.09.09.13.19.13.31 0 .13-.04.23-.13.31-.09.09-.19.13-.32.13h-1.31c-.05 0-.1.05-.1.1v.81c0 .05.05.1.1.1h1.31c.12 0 .23.04.32.13.09.09.13.19.13.31zm-5.65-3.7h-.87c-.04 0-.09.05-.09.1v4.17c0 .05.04.1.09.1h.87c.04 0 .09-.05.09-.1V9.53c0-.05-.05-.1-.09-.1zm1.16 5.88c-2.8 0-5.04-2.24-5.04-5.04s2.24-5.04 5.04-5.04 5.04 2.24 5.04 5.04-2.25 5.04-5.04 5.04zm0-11.58C2.93 3.83 0 6.76 0 10.37s2.93 6.54 6.54 6.54 6.54-2.93 6.54-6.54S10.15 3.83 6.54 3.83zm16.46 0h-7.1c-.06 0-.1.04-.1.1v1.58c0 .06.04.1.1.1h2.69v5.54c0 .06.04.1.1.1h1.52c.06 0 .1-.04.1-.1V5.61h2.69c.06 0 .1-.04.1-.1V3.93c0-.06-.04-.1-.1-.1z"/>
                    </svg>
                    Amazon Music
                  </a>
                  <a 
                    href="https://kkbox.fm/fp0EVM" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.412 4.98h2.824v6.182l5.294-2.796v3.431l-6.706 3.747-1.412.706V4.98zm-1.882 9.647v2.824H5.882v-2.824h2.824zm8.47 0v2.824h-2.823v-2.824h2.824z"/>
                    </svg>
                    KKBOX
                  </a>
                  <a 
                    href="https://lnkfi.re/mn8zg78u" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.5 4.9c.5.4 1 .8 1.5 1.2 0 .1-.1.1-.1.1-.5-.3-1-.6-1.5-.9-.1-.1-.1 0-.1.1.3.5.6 1 .9 1.5 0 .1-.1.1-.1.1-.4-.4-.8-1-1.2-1.5-.1 0-.1 0-.1.1.1.5.3 1.1.4 1.7 0 .1-.1.1-.1.1-.3-.5-.7-1-1-1.5-.1 0-.1 0-.1.1 0 .6.1 1.1.1 1.7 0 .1-.1.1-.1.1-.3-.5-.5-1-1-1.5 0 0-.1 0-.1.1.1.6.1 1.1.1 1.7 0 .1-.1.1-.1 0-.2-.5-.5-1-.7-1.5-.1 0-.1 0-.1.1 0 .6 0 1.1 0 1.7 0 .1-.1.1-.1 0-.2-.5-.4-.9-.6-1.4 0-.1-.1-.1-.1 0 0 .5 0 1.1-.1 1.6 0 .1-.1.1-.1 0-.1-.5-.3-.9-.4-1.4 0-.1-.1-.1-.1 0-.1.5-.1 1-.2 1.5 0 .1-.1.1-.1 0-.1-.4-.2-.8-.3-1.3-.1 0-.1 0-.1 0-.1.4-.2.9-.3 1.3-.1.1-.1.1-.1 0 0-.5-.1-1-.1-1.5 0-.1-.1-.1-.1 0-.1.5-.3.9-.4 1.4 0 .1-.1.1-.1 0 0-.5-.1-1-.1-1.6 0-.1-.1-.1-.1 0-.2.5-.3.9-.5 1.4 0 .1-.1.1-.1 0 0-.5.1-1 .1-1.6-.1-.1-.1-.1-.1-.1-.2.5-.4 1-.7 1.5 0 .1-.1.1-.1 0 0-.6.1-1.1.2-1.7 0-.1-.1-.1-.1-.1-.2.5-.5 1-.7 1.4-.1.1-.1 0-.1 0 .1-.6.2-1.1.2-1.7 0-.1-.1-.1-.1-.1-.3.5-.6 1-.8 1.5-.1.1-.1 0-.1 0 .1-.6.3-1.1.4-1.7 0-.1-.1-.1-.1-.1-.3.5-.7 1-1 1.5-.1.1-.1 0-.1 0 .2-.6.5-1.1.7-1.6 0-.1-.1-.1-.1-.1-.5.4-.9.9-1.3 1.4-.1.1-.1 0-.1 0 .3-.6.7-1.1.9-1.6.1-.1 0-.1 0-.1-.5.4-1 .7-1.5 1.1-.1 0-.1 0 0-.1.4-.5.8-1 1.2-1.5 0-.1 0-.1-.1-.1-.5.3-1 .6-1.5.9-.1 0-.1 0 0-.1.5-.5 1-.9 1.4-1.4 0 0 0-.1-.1-.1-.5.2-1 .4-1.6.7 0 .1 0 0 0-.1.5-.4 1.1-.8 1.6-1.2 0-.1 0-.1-.1-.1-.5.2-1 .3-1.6.5-.1 0-.1 0 0-.1.6-.3 1.2-.6 1.8-.9.1-.1 0-.1 0-.1-.6.1-1 .2-1.6.2-.1 0-.1-.1 0-.1.6-.2 1.2-.5 1.9-.7.1 0 .1-.1 0-.1-.5 0-1.1 0-1.6 0-.1 0-.1-.1 0-.1.7-.1 1.3-.3 1.9-.4.1 0 .1-.1 0-.1-.5-.1-1.1-.1-1.6-.1-.1 0-.1-.1 0-.1.7 0 1.3-.1 2-.1.1 0 .1-.1 0-.1-.5-.1-.9-.2-1.5-.3-.1 0-.1-.1 0-.1.6.1 1.3.1 1.9.1.1 0 .1-.1 0-.1-.5-.2-.9-.3-1.4-.4-.1 0-.1-.1 0-.1.6.1 1.2.3 1.9.4.1 0 .1-.1 0-.1-.4-.2-.9-.5-1.3-.7 0 0 0-.1 0-.1.7.3 1.3.6 1.9.9.1 0 .1-.1 0-.1-.4-.3-.8-.6-1.2-.9-.1-.1 0-.1 0-.1.6.4 1.2.8 1.9 1.2.1 0 .1 0 0-.1-.3-.4-.7-.7-1-.9 0-.1 0-.1 0-.1.6.5 1.2 1 1.8 1.5.1 0 .1 0 0-.1-.3-.4-.6-.8-.9-1.2 0-.1 0-.1.1-.1.5.6 1 1.2 1.6 1.8.1 0 .1 0 .1-.1-.2-.4-.5-.9-.7-1.3 0-.1 0-.1.1-.1.5.7.9 1.3 1.4 2 .1 0 .1 0 .1-.1-.2-.5-.4-.9-.5-1.3 0-.1 0-.1.1-.1.5.8.8 1.4 1.2 2.2.1.1.1 0 .1 0-.1-.5-.3-1-.4-1.5 0-.1.1-.1.1 0 .4.9.6 1.5.9 2.3.1.1.1 0 .1 0 0-.5-.1-1-.1-1.5 0-.1.1-.1.1 0 .2.5.5 1.6.7 2.4.1.1.1 0 .1 0 0-.5 0-1 .1-1.5 0-.1.1-.1.1 0 .1 1 .2 1.8.2 2.5 0 .1.1.1.1 0 .1-.5.2-1 .3-1.4 0-.1.1-.1.1 0 0 1 0 1.9 0 2.5 0 .1.1.1.1 0 .2-.5.3-.9.5-1.4 0-.1.1 0 .1 0-.1 1-.2 1.9-.4 2.4 0 .1.1.1.1 0 .2-.4.5-.9.7-1.3 0-.1.1 0 .1 0-.2.9-.5 1.8-.7 2.4-.1.1 0 .1.1 0 .3-.4.6-.8.9-1.2 0-.1.1 0 .1 0-.4.9-.7 1.7-1.1 2.2-.1.1 0 .1.1 0 .3-.3.7-.7 1-1 .1-.1.1 0 .1 0-.7 1.1-1.2 1.9-1.2 2 0 .1 0 .1.1 0 .3-.3.7-.6 1.1-.8.1 0 .1 0 0 .1-.7.8-1.1 1.2-1.2 1.3-.1 0 0 .1 0 .1.4-.2.7-.4 1.1-.6.1 0 .1 0 0 .1-.4.4-.9.7-1.3 1.1 0 .1 0 .1.1.1.4-.2.7-.3 1.1-.4.1 0 .1 0 0 .1-.4.3-.8.6-1.2.9-.1 0 0 .1.1.1.3-.1.7-.2 1.1-.2.1 0 .1 0 0 .1-.4.2-.7.4-1.1.6-.1 0 0 .1.1.1.4 0 .7 0 1.1 0 .1 0 .1.1 0 .1-.4.2-.8.3-1.2.4 0 0 0 .1.1.1.5-.1 1.1-.3 1.4-.3.1 0 .1.1 0 .1-.7.1-1.2.2-1.5.3-.1 0 0 .1.1.1.7-.2 1.3-.4 1.9-.5.1 0 .1.1 0 .1-.4.1-.7.1-1.1.2 0 0 0 .1.1.1.7-.2 1.3-.4 1.9-.5.1 0 .1.1 0 .1-.4 0-.7.1-1.1.1 0 0 0 .1.1.1.7-.2 1.3-.3 1.9-.4.1 0 .1.1 0 .1-.4 0-.7 0-1.1.1-.1 0 0 .1.1.1.6-.1 1.3-.1 1.9-.2.1 0 .1.1 0 .1h-1.1c-.1 0 0 .1.1.1.6 0 1.3 0 1.9.1.1 0 .1.1 0 .1-.4 0-.7 0-1.1-.1-.1 0 0 .1.1.1.6.1 1.3.2 1.9.4.1 0 .1.1 0 .1-.4-.1-.7-.1-1.1-.2-.1 0 0 .1.1.1.6.2 1.2.4 1.9.7.1 0 .1.1 0 .1-.4-.1-.7-.3-1.1-.4-.1 0 0 .1.1.1.6.3 1.2.7 1.8 1 .1.1.1.1 0 .1-.3-.2-.6-.4-1-.6-.1 0 0 .1 0 .1.6.4 1.1.9 1.7 1.4.1.1.1.1 0 .1-.3-.2-.6-.5-.9-.7-.1-.1 0 0 0 .1.5.5 1 1.1 1.5 1.7.1.1 0 .1 0 .1-.3-.3-.5-.6-.8-.9-.1-.1 0 0 0 .1.5.7.9 1.3 1.3 2 .1.1 0 .1 0 .1-.2-.3-.4-.7-.6-1 0-.1 0 0 0 .1.4.8.7 1.5 1 2.3.1.1 0 .1 0 .1-.2-.4-.3-.8-.5-1.1 0-.1 0 0 0 .1.3.9.5 1.7.6 2.5 0 .1 0 .1 0 .1-.1-.4-.2-.8-.3-1.2 0-.1 0 0 0 .1.2 1 .3 1.8.3 2.7 0 .1 0 .1 0 .1-.1-.4-.1-.8-.2-1.2 0-.1 0 0 0 .1.1 1 .1 1.9.1 2.8 0 .1 0 .1 0 .1 0-.4 0-.8 0-1.2 0-.1 0 0 0 .1 0 1 0 1.9-.1 2.8 0 .1 0 .1-.1.1 0-.4 0-.8.1-1.2 0-.1-.1 0-.1.1-.1 1-.2 1.9-.4 2.7 0 .1-.1.1-.1.1.1-.4.2-.8.3-1.2 0-.1-.1 0-.1.1-.2.9-.5 1.7-.8 2.5 0 .1-.1.1-.1.1.1-.4.3-.7.4-1.1 0-.1-.1 0-.1.1-.3.8-.7 1.5-1.1 2.2-.1.1-.1.1-.1 0 .2-.3.4-.7.6-1 0-.1-.1 0-.1.1-.4.7-.9 1.3-1.4 1.9-.1.1-.1.1-.1 0 .3-.3.5-.6.8-.9 0-.1-.1 0-.1.1-.5.6-1 1.1-1.6 1.6-.1.1-.1 0-.1 0 .3-.3.6-.5.9-.8.1-.1 0-.1 0 0-.5.5-1.1 1-1.8 1.3-.1 0-.1 0 0 0 .3-.2.7-.5 1-.7.1 0 0-.1 0 0-.6.4-1.2.8-1.9 1.1-.1 0-.1 0 0 0 .4-.2.7-.4 1.1-.6 0 0 0-.1 0 0-.6.3-1.3.6-2 .8-.1 0-.1 0 0 0 .4-.1.7-.3 1.1-.4.1 0 0-.1 0 0-.7.2-1.4.4-2.1.5-.1 0-.1 0 0 0 .4-.1.8-.2 1.1-.2.1 0 0-.1 0 0-.7.1-1.4.2-2.1.2-.1 0-.1 0 0 0 .4 0 .8 0 1.2-.1 0 0 0-.1 0 0-.7 0-1.5 0-2.2 0-.1 0-.1 0 0 0 .4 0 .8.1 1.2.1 0 0 0-.1 0 0-.7-.1-1.4-.2-2.1-.3-.1 0-.1 0 0 0 .4.1.8.2 1.2.3 0 0 0-.1 0 0-.7-.2-1.4-.4-2.1-.6-.1 0-.1 0 0 0 .4.1.8.3 1.1.4 0 0 0-.1 0 0-.7-.3-1.3-.6-1.9-1-.1 0-.1 0 0 0 .4.2.7.4 1.1.6 0 0 0-.1 0 0-.6-.4-1.1-.8-1.7-1.3-.1-.1-.1 0 0 0 .3.3.6.5.9.8 0 0 0-.1 0 0-.6-.5-1.1-1-1.5-1.6-.1-.1-.1 0 0 0 .3.3.5.7.8 1 0 0 0-.1 0 0-.5-.6-.9-1.2-1.3-1.9 0-.1-.1 0 0 0 .2.4.4.7.6 1.1 0 0 0-.1 0 0-.4-.7-.7-1.4-1-2.2 0-.1-.1 0 0 0 .2.4.3.8.5 1.1 0 0 0-.1 0 0-.3-.8-.5-1.6-.7-2.5 0-.1-.1 0 0 0 .1.4.2.8.3 1.2 0 0 0-.1 0 0-.2-.9-.3-1.8-.3-2.7 0-.1-.1 0 0 0 .1.4.1.8.1 1.2 0 0 0-.1 0 0-.1-1-.1-1.9 0-2.8 0-.1-.1 0 0 0 0 .4 0 .8 0 1.2 0 0 0-.1 0 0 0-1 .2-1.9.3-2.8 0-.1-.1 0 0 0 0 .4-.1.8-.1 1.2 0 0 0-.1 0 0 .1-.9.3-1.8.5-2.7 0-.1-.1 0 0 0-.1.4-.2.8-.2 1.1 0 0 0-.1 0 0 .2-.9.5-1.7.8-2.5 0-.1-.1 0 0 0-.1.4-.3.7-.4 1.1 0 0 0-.1.1 0 .3-.8.7-1.5 1.1-2.2 0-.1 0 0 0 0-.2.3-.4.7-.6 1 0 0 0-.1.1 0 .4-.7.9-1.3 1.4-1.9 0-.1 0 0 0 0-.3.3-.5.6-.8.9 0 0 0-.1.1 0 .5-.6 1-1.1 1.6-1.6 0-.1 0 0 0 0-.3.3-.6.5-.9.8 0 0 0-.1.1 0 .6-.5 1.2-1 1.8-1.3 0-.1 0 0 0 0-.3.2-.7.5-1 .7 0 0 0-.1.1 0z"/>
                    </svg>
                    LinkFire
                  </a>
                  
                  <a 
                    href="https://streetvoice.com/Will8188/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-13.5v7c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.35 0 .69.06 1 .17V7.5l-4 1v5c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.35 0 .69.06 1 .17V5l8-2z"/>
                    </svg>
                    StreetVoice
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Tracks */}
        <h3 className="font-montserrat font-semibold text-2xl text-white mb-2">Popular Tracks</h3>
        <h3 className="font-montserrat font-semibold text-2xl text-white mb-6 chinese-text">熱門曲目</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {popularTracks ? (
            popularTracks.map((track) => (
              <div key={track.id} className="bg-zinc-800/80 rounded-lg p-4 hover:bg-zinc-700 transition-colors duration-300 flex items-center">
                <div className="w-12 h-12 flex-shrink-0 mr-4">
                  <img 
                    src={track.album.images[0]?.url || "https://via.placeholder.com/48"}
                    alt={`${track.album.name} album cover`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-white">{track.name}</h4>
                  <p className="text-gray-400 text-sm">{track.album.name}</p>
                </div>
                <div className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</div>
                <button 
                  className="ml-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300"
                  onClick={() => playTrack(track.id)}
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            // Fallback for loading state
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-zinc-800/80 rounded-lg p-4 hover:bg-zinc-700 transition-colors duration-300 flex items-center">
                <div className="w-12 h-12 flex-shrink-0 mr-4 bg-zinc-700 rounded"></div>
                <div className="flex-grow">
                  <div className="h-5 w-36 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-zinc-700 rounded"></div>
                </div>
                <div className="w-10 h-4 bg-zinc-700 rounded mr-2"></div>
                <div className="ml-4 w-8 h-8 flex items-center justify-center bg-zinc-700 rounded-full"></div>
              </div>
            ))
          )}
        </div>
        
        {/* Albums/EPs */}
        <h3 className="font-montserrat font-semibold text-2xl text-white mb-2">Albums & EPs</h3>
        <h3 className="font-montserrat font-semibold text-2xl text-white mb-6 chinese-text">專輯與單曲</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {albums ? (
            albums.map((album) => (
              <div key={album.id} className="group">
                <div className="mb-3 relative overflow-hidden rounded-lg">
                  <img 
                    src={album.images[0]?.url}
                    alt={`${album.name} album cover`}
                    className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      className="w-12 h-12 bg-purple-700 rounded-full text-white flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      onClick={() => window.open(`https://open.spotify.com/album/${album.id}`, '_blank')}
                    >
                      <Play className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <h4 className="font-medium text-white text-lg">{album.name}</h4>
                <p className="text-gray-400 text-sm">{album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)} • {new Date(album.release_date).getFullYear()}</p>
              </div>
            ))
          ) : (
            // Fallback for loading state
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="group">
                <div className="mb-3 relative overflow-hidden rounded-lg bg-zinc-700 aspect-square"></div>
                <div className="h-5 w-32 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-zinc-700 rounded"></div>
              </div>
            ))
          )}
        </div>
        
        {/* Spotify Embed */}
        <div className="mt-12 text-center">
          <a 
            href="https://open.spotify.com/artist/4EXkqFOhrs5mcfZwFgiEOF?si=zDIQP4o4T0yXjFIs2jrsSw"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#1DB954] hover:bg-[#1AA64B] text-white font-medium rounded-full transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="mr-1">View Full Discography on Spotify</span>
            <span className="chinese-text">在 Spotify 上查看完整唱片目錄</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
