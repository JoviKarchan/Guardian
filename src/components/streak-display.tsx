import { Calendar, Trophy, Target } from "lucide-react";
import { Card } from "./ui/card";
import { useState, useEffect } from "react";

interface UserData {
  goal?: number;
  streak?: number; // completed days
  isWalletConnected: boolean;
}

interface StreakDisplayProps {
  userData: UserData;
}

// ✅ Chrome extension support
declare const chrome: any;

export function StreakDisplay({ userData }: StreakDisplayProps) {
  const [streak, setStreak] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const goal = userData.goal ?? 100;
  const progress = goal ? (streak / goal) * 100 : 0;

  // Load streak from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(["streakStartDate", "streakCount"], (result: any) => {
      if (result.streakStartDate) {
        setStartDate(new Date(result.streakStartDate));
      }
      if (result.streakCount) {
        setStreak(parseInt(result.streakCount, 10));
      }
    });
  }, []);

  const handleStart = () => {
    const today = new Date();
    setStartDate(today);
    setStreak(0);
    chrome.storage.local.set({
      streakStartDate: today.toISOString(),
      streakCount: 0,
    });
  };

  const toggleDisplay = () => setShowDetailed(!showDetailed);

  // Live update elapsed time
  useEffect(() => {
    if (!startDate || !showDetailed) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      const totalSeconds = Math.floor(diffMs / 1000);

      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, showDetailed]);

  const renderStreakCount = () => {
    if (!startDate) return null;
    if (!showDetailed) return `${streak}`; // just days
    return `${streak}d ${elapsed.hours}h ${elapsed.minutes}m ${elapsed.seconds}s`;
  };

  return (
    <div className="w-full max-w-[310px] space-y-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <Trophy className="w-8 h-8 text-primary" />
        </div>

        {startDate ? (
          <button
            onClick={toggleDisplay}
            className="text-2xl font-bold text-primary transition-all duration-200 hover:scale-105"
          >
            {renderStreakCount()}
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            Start Your Journey
          </button>
        )}

        <p className="text-muted-foreground text-sm">Days Clean</p>
      </div>

      {startDate && (
        <>
          <Card className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Goal Progress</span>
              </div>
              <span className="text-xs font-medium">{streak}/{goal} days</span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium text-sm">Started Journey</p>
                <p className="text-xs text-muted-foreground">
                  {startDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Keep going! You're doing amazing 💪
        </p>
      </div>
    </div>
  );
}
