import { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Repeat, Volume2, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const PLAYLIST = [
  { id: "jfKfPfyJRdk", title: "Lofi Girl - Radio", artist: "Lofi Girl", live: true },
  { id: "5qap5aO4i9A", title: "Midnight City", artist: "Chill Select", duration: "3:45" },
  { id: "DWcUYKoZBDw", title: "Coffee Shop", artist: "Lofi Records", duration: "4:20" },
  { id: "lP26UCnoH9s", title: "Rainy Day", artist: "Aesthetic", duration: "2:55" },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const currentTrack = PLAYLIST[currentTrackIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  return (
    <Card className="bg-[#FDFCF0] shadow-natural rounded-2xl text-[#423a33] w-full max-w-sm overflow-hidden border-none">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-[#8B5E3C]">Now Playing</span>
            <div className="flex gap-1">
              <div className={cn("w-1 h-2 bg-[#4A5D23] rounded-full", isPlaying && "animate-pulse")}></div>
              <div className={cn("w-1 h-3 bg-[#4A5D23] rounded-full", isPlaying && "animate-pulse")}></div>
              <div className={cn("w-1 h-1.5 bg-[#4A5D23] rounded-full")}></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#e6e2d1] rounded-lg flex items-center justify-center overflow-hidden border border-[#d4cfbc]">
              <img 
                src={`https://img.youtube.com/vi/${currentTrack.id}/default.jpg`} 
                alt="cover"
                className="w-full h-full object-cover grayscale-[0.3] contrast-[1.2]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-sm truncate text-[#423a33]">{currentTrack.title}</h3>
              <p className="text-[10px] text-[#8B5E3C] italic truncate">{currentTrack.artist}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={cn("text-[#8B5E3C] hover:bg-[#8B5E3C]/10 h-8 w-8", showPlaylist && "bg-[#8B5E3C]/10")}
            >
              <ListMusic className="w-4 h-4" />
            </Button>
          </div>

          {/* Hidden YouTube Player */}
          <div className="hidden">
            {isPlaying && (
              <iframe
                width="0"
                height="0"
                src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&loop=${isRepeat ? 1 : 0}&playlist=${currentTrack.id}`}
                title="YouTube music player"
                allow="autoplay"
              />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" onClick={prevTrack} className="text-[#8B5E3C] hover:bg-[#8B5E3C]/10 opacity-60 h-8 w-8">
                <SkipBack className="w-4 h-4 fill-current" />
              </Button>
              <Button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-[#4A5D23] text-white hover:bg-[#323f18] shadow-lg shadow-[#4a5d23]/20 flex items-center justify-center border-none"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={nextTrack} className="text-[#8B5E3C] hover:bg-[#8B5E3C]/10 opacity-60 h-8 w-8">
                <SkipForward className="w-4 h-4 fill-current" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 bg-[#e6e2d1]/40 p-1.5 rounded-full px-3">
              <Volume2 className="w-3 h-3 text-[#8B5E3C]/60" />
              <Slider 
                value={volume} 
                onValueChange={(val) => setVolume(Array.isArray(val) ? [...val] : [val])} 
                max={100} 
                step={1}
                className="flex-1 px-1 h-3"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsRepeat(!isRepeat)}
                className={cn("w-5 h-5 text-[#8B5E3C] hover:bg-[#8B5E3C]/10 p-0", isRepeat && "text-[#4A5D23] opacity-100")}
              >
                <Repeat className="w-2.5 h-2.5" />
              </Button>
            </div>
          </div>

          {showPlaylist && (
            <ScrollArea className="h-40 border-t border-[#d4cfbc] pt-4">
              <div className="space-y-2">
                {PLAYLIST.map((track, index) => (
                  <div 
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border border-transparent",
                      currentTrackIndex === index ? "bg-[#e6e2d1] border-[#d4cfbc]" : "hover:bg-[#e6e2d1]/30"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      currentTrackIndex === index ? "bg-[#4A5D23]" : "border border-[#4A5D23] opacity-30"
                    )}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-[#423a33] uppercase tracking-tighter">{track.title}</p>
                      <p className="text-[10px] text-[#8B5E3C] truncate">{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
