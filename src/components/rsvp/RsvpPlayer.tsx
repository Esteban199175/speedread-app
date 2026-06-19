"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OrpWord } from "@/components/rsvp/OrpWord";
import { RsvpControls } from "@/components/rsvp/RsvpControls";
import { countWords, tokenizePassage } from "@/lib/rsvp/tokenize";

export interface RsvpResult {
  wpm: number;
  chunkSize: number;
  durationSeconds: number;
  wordsRead: number;
}

interface RsvpPlayerProps {
  text: string;
  initialWpm?: number;
  initialChunkSize?: number;
  onComplete?: (result: RsvpResult) => void;
}

export function RsvpPlayer({
  text,
  initialWpm = 300,
  initialChunkSize = 1,
  onComplete,
}: RsvpPlayerProps) {
  const [wpm, setWpm] = useState(initialWpm);
  const [chunkSize, setChunkSize] = useState(initialChunkSize);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [result, setResult] = useState<RsvpResult | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const chunks = useMemo(
    () => tokenizePassage(text, chunkSize, wpm),
    [text, chunkSize, wpm]
  );
  const totalWords = useMemo(() => countWords(text), [text]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsDone(false);
    setResult(null);
    startTimeRef.current = null;
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isDone) return;
    if (!isPlaying && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    setIsPlaying((playing) => !playing);
  }, [isDone, isPlaying]);

  const handleChunkSizeChange = useCallback(
    (size: number) => {
      setChunkSize(size);
      reset();
    },
    [reset]
  );

  // Playback loop: schedule the next chunk after the current chunk's duration.
  useEffect(() => {
    if (!isPlaying || isDone) return;

    if (currentIndex >= chunks.length) {
      setIsPlaying(false);
      setIsDone(true);
      if (startTimeRef.current !== null) {
        const durationSeconds = (Date.now() - startTimeRef.current) / 1000;
        const finalResult: RsvpResult = {
          wpm,
          chunkSize,
          durationSeconds,
          wordsRead: totalWords,
        };
        setResult(finalResult);
        onComplete?.(finalResult);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((index) => index + 1);
    }, chunks[currentIndex].durationMs);

    return () => clearTimeout(timer);
  }, [isPlaying, isDone, currentIndex, chunks, wpm, chunkSize, totalWords, onComplete]);

  // Keyboard shortcuts.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault();
        handlePlayPause();
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        setWpm((value) => Math.min(900, value + 25));
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setWpm((value) => Math.max(100, value - 25));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePlayPause]);

  const displayChunk = chunks[Math.min(currentIndex, chunks.length - 1)];
  const progressPct =
    chunks.length > 0 ? (Math.min(currentIndex, chunks.length) / chunks.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex h-32 items-center justify-center rounded-lg border bg-card">
        <div className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-muted-foreground/50" />
        <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-muted-foreground/50" />
        {isDone ? (
          <p className="text-lg text-muted-foreground">Passage complete</p>
        ) : displayChunk ? (
          <OrpWord chunk={displayChunk} />
        ) : (
          <p className="text-lg text-muted-foreground">No text to display</p>
        )}
      </div>

      <div className="space-y-1">
        <Progress value={progressPct} />
        <p className="text-right text-xs text-muted-foreground">
          {Math.min(currentIndex, chunks.length)} / {chunks.length} chunks
        </p>
      </div>

      <RsvpControls
        wpm={wpm}
        chunkSize={chunkSize}
        isPlaying={isPlaying}
        isDone={isDone}
        onWpmChange={setWpm}
        onChunkSizeChange={handleChunkSizeChange}
        onPlayPause={handlePlayPause}
        onRestart={reset}
      />

      {result && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="mb-2 font-semibold">Session complete</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Speed</dt>
              <dd className="font-medium">{result.wpm} WPM</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Words per flash</dt>
              <dd className="font-medium">{result.chunkSize}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Time</dt>
              <dd className="font-medium">{result.durationSeconds.toFixed(1)}s</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Words read</dt>
              <dd className="font-medium">{result.wordsRead}</dd>
            </div>
          </dl>
          <Button className="mt-4" variant="outline" onClick={reset}>
            Read again
          </Button>
        </div>
      )}
    </div>
  );
}
