import { useState, useEffect } from "react";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface GoalSetupProps {
  onGoalSet: (goal: number) => void;
}

export function GoalSetup({ onGoalSet }: GoalSetupProps) {
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedGoal = localStorage.getItem("userGoal");
    const streak = parseInt(localStorage.getItem("userStreak") || "0");

    if (savedGoal) {
      const goalNum = parseInt(savedGoal);

      // ✅ If streak not finished, skip this page
      if (streak <= goalNum) {
        onGoalSet(goalNum);
      }
    }
  }, [onGoalSet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalNumber = parseInt(goal);

    if (!goal || goalNumber < 1 || goalNumber > 365) {
      setError("Please enter a valid goal between 1 and 365 days");
      return;
    }

    setError("");
    localStorage.setItem("userGoal", goalNumber.toString());
    localStorage.setItem("userStreak", "0"); // start fresh streak
    onGoalSet(goalNumber);
  };

  const handlePresetGoal = (days: number) => {
    setGoal(days.toString());
    setError("");
  };

  // ✅ Skip rendering UI if goal already exists & streak is still running
  const savedGoal = parseInt(localStorage.getItem("userGoal") || "0");
  const streak = parseInt(localStorage.getItem("userStreak") || "0");
  if (savedGoal && streak <= savedGoal) {
    return null;
  }

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full mx-auto">
          <Target className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Welcome to Guardian</h2>
          <p className="text-sm text-muted-foreground">
            Set your recovery goal to get started
          </p>
        </div>
      </div>

      <Card className="p-4 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm">Your Goal (days)</Label>
            <Input
              id="goal"
              type="number"
              placeholder="Enter number of days"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              min="1"
              max="365"
              className="h-8"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full" size="sm">
            Start My Journey
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Quick presets:</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetGoal(30)}
            className="text-xs h-7"
          >
            30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetGoal(90)}
            className="text-xs h-7"
          >
            90 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetGoal(365)}
            className="text-xs h-7"
          >
            1 year
          </Button>
        </div>
      </div>
    </div>
  );
}
