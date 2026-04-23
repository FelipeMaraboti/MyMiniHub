import { useState, useEffect } from "react";
import { ToolButton } from "@/components/ui/ToolComponents";
import { Play, Pause, RotateCcw } from "lucide-react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const TIMES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

/**
 * PomodoroTool — Timer Pomodoro.
 */
export function PomodoroTool() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(TIMES.pomodoro);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Aqui pode-se adicionar uma notificação desktop no futuro
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMES[mode]);
  };
  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(TIMES[newMode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((TIMES[mode] - timeLeft) / TIMES[mode]) * 100;

  return (
    <div className="flex flex-col h-full p-4 items-center justify-center gap-8">
      {/* Modos */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
        {(["pomodoro", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              mode === m
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "pomodoro" ? "Foco" : m === "shortBreak" ? "Pausa Curta" : "Pausa Longa"}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-[rgba(255,255,255,0.05)] fill-none stroke-[8px]"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-accent fill-none stroke-[8px]"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="text-6xl font-mono font-light tracking-tight text-foreground">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4">
        <ToolButton variant="secondary" onClick={toggleTimer} className="w-16 h-16 rounded-full flex items-center justify-center">
            {isActive ? <Pause size={24} className="text-foreground" /> : <Play size={24} className="text-foreground ml-1" />}
        </ToolButton>
        <ToolButton variant="ghost" onClick={resetTimer} className="p-3 text-muted-foreground hover:text-foreground">
           <RotateCcw size={20} />
        </ToolButton>
      </div>
    </div>
  );
}
