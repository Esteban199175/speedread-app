"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsFormProps {
  userId: string;
  initial: {
    dailyWpmGoal: number;
    defaultChunkSize: number;
    defaultWpm: number;
  };
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const [dailyWpmGoal, setDailyWpmGoal] = useState(initial.dailyWpmGoal.toString());
  const [defaultChunkSize, setDefaultChunkSize] = useState(
    initial.defaultChunkSize.toString()
  );
  const [defaultWpm, setDefaultWpm] = useState(initial.defaultWpm.toString());
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dailyWpmGoal: parseInt(dailyWpmGoal, 10),
        defaultChunkSize: parseInt(defaultChunkSize, 10),
        defaultWpm: parseInt(defaultWpm, 10),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Failed to save settings.");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="daily-wpm-goal">Daily WPM goal</Label>
        <Input
          id="daily-wpm-goal"
          type="number"
          min={50}
          max={2000}
          value={dailyWpmGoal}
          onChange={(e) => setDailyWpmGoal(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="default-wpm">Default starting WPM</Label>
        <Input
          id="default-wpm"
          type="number"
          min={50}
          max={2000}
          value={defaultWpm}
          onChange={(e) => setDefaultWpm(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="chunk-size">Default words per flash (1–3)</Label>
        <Input
          id="chunk-size"
          type="number"
          min={1}
          max={3}
          value={defaultChunkSize}
          onChange={(e) => setDefaultChunkSize(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-green-600">Settings saved!</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
