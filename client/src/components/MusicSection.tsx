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
  
  const { data: featuredTrack } = useQuery({
    queryKey: ['/api/spotify/featured-track'],
  });
  
  const { data: popularTracks } = useQuery<Track[]>({
    queryKey: ['/api/spotify/popular-tracks'],
  });
  
  const { data: albums } = useQuery<Album[]>({
    queryKey: ['/api/spotify/albums'],
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
        <p className="text-gray-400 mb-12 max-w-2xl">Stream the latest releases and favorite tracks from AURA VOX's discography on Spotify.</p>
        
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
                    <p className="text-pink-500 mb-1">Latest Single</p>
                    <p className="text-gray-400 text-sm">Released: {new Date(featuredTrack?.release_date || "2023-10-12").toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
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
                  trackId={featuredTrack?.id}
                  onPlay={() => playTrack(featuredTrack?.id)}
                />
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <a 
                    href={`https://open.spotify.com/track/${featuredTrack?.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-5 py-2 bg-[#1DB954] hover:bg-[#1AA64B] text-white font-medium rounded-full transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Play on Spotify
                  </a>
                  <a 
                    href="https://music.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.51-3.19 0-1.38.64-2.3.51-3.15-.32C3.11 15.41 4.43 7.7 9.35 7.45c1.48-.08 2.5.58 3.31.58.81 0 2.33-.72 3.94-.61 1.02.03 3.85.4 5.69 3.09-4.51 2.64-3.79 9.38.76 11.77-.91 1.33-1.97 2.85-4 3zm-2.98-17.13c.91-1.08 2.43-1.89 3.69-1.94.17 1.4-.42 2.8-1.27 3.82-.9 1.08-2.37 1.9-3.83 1.79-.19-1.35.5-2.75 1.41-3.67z"/>
                    </svg>
                    Apple Music
                  </a>
                  <button className="inline-flex items-center px-5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-full border border-gray-300/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10L12 15 17 10M12 15L12 3"/>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Tracks */}
        <h3 className="font-montserrat font-semibold text-2xl text-white mb-6">Popular Tracks</h3>
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
        <h3 className="font-montserrat font-semibold text-2xl text-white mb-6">Albums & EPs</h3>
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
            href="https://open.spotify.com"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#1DB954] hover:bg-[#1AA64B] text-white font-medium rounded-full transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            View Full Discography on Spotify
          </a>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
