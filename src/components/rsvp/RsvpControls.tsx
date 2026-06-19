"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface RsvpControlsProps {
  wpm: number;
  chunkSize: number;
  isPlaying: boolean;
  isDone: boolean;
  onWpmChange: (wpm: number) => void;
  onChunkSizeChange: (size: number) => void;
  onPlayPause: () => void;
  onRestart: () => void;
}

const CHUNK_SIZES = [1, 2, 3];

export function RsvpControls({
  wpm,
  chunkSize,
  isPlaying,
  isDone,
  onWpmChange,
  onChunkSizeChange,
  onPlayPause,
  onRestart,
}: RsvpControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button onClick={onPlayPause} disabled={isDone} size="icon">
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>
        <Button onClick={onRestart} size="icon" variant="outline">
          <RotateCcw className="size-4" />
        </Button>
        <div className="flex flex-1 items-center gap-3">
          <span className="w-20 text-sm text-muted-foreground">{wpm} WPM</span>
          <Slider
            value={wpm}
            min={100}
            max={900}
            step={25}
            onValueChange={(value) => onWpmChange(Number(value))}
            className="flex-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Words per flash:</span>
        {CHUNK_SIZES.map((size) => (
          <Button
            key={size}
            size="sm"
            variant={chunkSize === size ? "default" : "outline"}
            onClick={() => onChunkSizeChange(size)}
          >
            {size}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Space: play / pause &middot; Up / Down arrows: adjust speed
      </p>
    </div>
  );
}
