import { useState } from "react";
import { Monitor, CloudRain, Coffee as CoffeeIcon, Moon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BackgroundTheme {
  id: string;
  name: string;
  youtubeId: string;
  icon: React.ReactNode;
}

export const BACKGROUNDS: BackgroundTheme[] = [
  { id: "lofi-girl", name: "Lofi Girl Bedroom", youtubeId: "jfKfPfyJRdk", icon: <Monitor className="w-4 h-4" /> },
  { id: "rainy-cafe", name: "Rainy Cafe", youtubeId: "hHqWkDXasSI", icon: <CoffeeIcon className="w-4 h-4" /> },
  { id: "rainy-city", name: "Night City Rain", youtubeId: "5n6qa9l2xWI", icon: <CloudRain className="w-4 h-4" /> },
  { id: "study-dog", name: "Study with Dog", youtubeId: "n61ULEU7CO0", icon: <Moon className="w-4 h-4" /> },
];

interface BackgroundProps {
  currentTheme: BackgroundTheme;
  setTheme: (theme: BackgroundTheme) => void;
}

export function Background({ currentTheme, setTheme }: BackgroundProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layer 1: Base Fallback Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D241E] via-[#1a1412] to-[#0f0b0a]" />
        
        {/* Layer 2: YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            key={currentTheme.youtubeId}
            className="absolute top-1/2 left-1/2 w-[110vw] h-[61.88vw] min-h-[110vh] min-w-[195.55vh] -translate-x-1/2 -translate-y-1/2 grayscale-[0.2] contrast-[1.1] opacity-60 transition-opacity duration-1000"
            src={`https://www.youtube.com/embed/${currentTheme.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentTheme.youtubeId}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          ></iframe>
        </div>

        {/* Layer 3: Atmospheric Overlays */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[#e6e2d1]/5 mix-blend-overlay" />
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-2 bg-[#FDFCF0]/10 backdrop-blur-md border border-white/10 text-[#FDFCF0] hover:bg-white/20 rounded-full px-6 font-bold text-xs uppercase tracking-widest h-11 shadow-2xl mb-2 cursor-pointer outline-none transition-all",
              isOpen && "bg-[#FDFCF0]/20 border-white/30 scale-105"
            )}
          >
            <Settings className={cn("w-4 h-4 transition-transform duration-500", isOpen && "rotate-90")} /> 
            <span>Ambient: {currentTheme.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-[#1a1412]/95 backdrop-blur-2xl border border-white/10 text-[#FDFCF0] p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[220px]"
            side="top"
            align="start"
            sideOffset={12}
          >
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold opacity-40">Choose Scenery</div>
            {BACKGROUNDS.map((bg) => (
              <DropdownMenuItem
                key={bg.id}
                onSelect={() => setTheme(bg)}
                className={cn(
                  "flex items-center gap-3 cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-xl p-3 font-medium transition-all group",
                  currentTheme.id === bg.id && "bg-white/10 text-white"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/20 transition-colors",
                  currentTheme.id === bg.id && "bg-[#4A5D23] text-white"
                )}>
                  {bg.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">{bg.name}</span>
                  {currentTheme.id === bg.id && <span className="text-[9px] uppercase tracking-tighter opacity-60 font-bold">Currently Active</span>}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
