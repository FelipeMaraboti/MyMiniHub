import { useState, useEffect } from "react";
import { ToolButton } from "@/components/ui/ToolComponents";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

interface Lap {
  id: string;
  time: number;
  overallTime: number;
}

/**
 * StopwatchTool — Cronometro com voltas.
 */
export function StopwatchTool() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    const lapTime = laps.length > 0 ? time - laps[0].overallTime : time;
    setLaps([{ id: crypto.randomUUID(), time: lapTime, overallTime: time }, ...laps]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full p-4 gap-6 items-center">
      <div className="flex-1 w-full flex flex-col items-center justify-center pt-8">
          <span className="text-7xl font-mono font-light tracking-tight text-foreground">
            {formatTime(time)}
          </span>
      </div>

      <div className="flex items-center gap-4">
          <ToolButton variant="secondary" onClick={toggleTimer} className="w-16 h-16 rounded-full flex items-center justify-center">
             {isActive ? <Pause size={24} className="text-foreground" /> : <Play size={24} className="text-foreground ml-1" />}
          </ToolButton>
          <ToolButton variant="secondary" onClick={addLap} disabled={!isActive && time === 0} className="w-16 h-16 rounded-full flex items-center justify-center">
             <Flag size={20} className="text-foreground" />
          </ToolButton>
          <ToolButton variant="ghost" onClick={resetTimer} className="p-3 text-muted-foreground hover:text-foreground">
             <RotateCcw size={20} />
          </ToolButton>
      </div>

       <div className="w-full flex-1 overflow-y-auto max-h-[180px] border-t border-[rgba(255,255,255,0.06)] mt-4">
         {laps.map((lap, index) => (
             <div key={lap.id} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.03)] px-4">
                <span className="text-[12px] text-muted-foreground">Volta {laps.length - index}</span>
                <span className="text-[13px] font-mono text-foreground">{formatTime(lap.time)}</span>
                <span className="text-[13px] font-mono text-muted-foreground">{formatTime(lap.overallTime)}</span>
             </div>
         ))}
       </div>
    </div>
  );
}
