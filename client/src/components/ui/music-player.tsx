import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  trackId?: string;
  onPlay?: () => void;
}

const MusicPlayer = ({ trackId, onPlay }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(318); // Default 5:18 in seconds
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  // Generate a visual representation of the waveform
  const waveformBars = Array.from({ length: 50 }, () => Math.random() * 100);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (onPlay && !isPlaying) {
      onPlay();
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = (currentTime / duration) * 100;
  
  // Format time to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simulate playback progress when playing
  useEffect(() => {
    let interval: number;
    
    if (isPlaying && currentTime < duration) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          return next <= duration ? next : duration;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, duration]);
  
  // Reset player when track changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [trackId]);

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <button 
          className="w-12 h-12 bg-purple-800 hover:bg-purple-900 text-white rounded-full flex items-center justify-center transition-colors duration-300"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <div className="text-gray-200">{formatTime(currentTime)} / {formatTime(duration)}</div>
        <div className="text-gray-400 ml-auto flex items-center gap-2">
          <button onClick={toggleMute} className="hover:text-white transition-colors duration-300">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : volume < 50 ? (
              <Volume1 className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <div className="w-24">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* Waveform Visualization */}
      <div className="h-16 bg-zinc-700 rounded-lg p-2 mb-4 overflow-hidden">
        <div className="h-full flex items-center">
          {waveformBars.map((height, index) => {
            const barPosition = (index / waveformBars.length) * 100;
            const isActive = barPosition <= progressPercentage;
            
            return (
              <div
                key={index}
                className={`w-1 mx-px ${
                  isActive 
                    ? barPosition > progressPercentage - 5 
                      ? "bg-pink-500" 
                      : "bg-purple-500 opacity-70" 
                    : "bg-gray-400 opacity-20"
                }`}
                style={{ height: `${Math.max(20, height)}%` }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
