import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or alert
      if (mode === "work") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("work");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalTime = mode === "work" ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className="bg-[#4A5D23] shadow-natural-forest rounded-2xl border-none text-[#FDFCF0] w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
        <CardTitle className="text-[9px] uppercase tracking-widest font-sans font-bold opacity-70 flex items-center gap-2">
          {mode === "work" ? <Brain className="w-2.5 h-2.5" /> : <Coffee className="w-2.5 h-2.5" />}
          {mode === "work" ? "Timer: Focus" : "Timer: Break"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 p-4 pt-0">
        <div className="text-5xl font-bold font-mono tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="h-1 w-full bg-white/10" />
        <div className="flex gap-3 w-full">
          <Button
            onClick={resetTimer}
            variant="ghost"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white p-0 flex items-center justify-center border-none"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={toggleTimer}
            className="flex-1 h-9 bg-[#FDFCF0] hover:bg-[#FDFCF0]/90 text-[#4A5D23] font-bold text-xs rounded-full border-none"
          >
            {isActive ? <Pause className="mr-2 h-3.5 w-3.5" /> : <Play className="mr-2 h-3.5 w-3.5" />}
            {isActive ? "PAUSE" : "START"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
