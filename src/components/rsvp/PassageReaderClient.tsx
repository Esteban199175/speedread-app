"use client";

import { useState } from "react";
import { RsvpPlayer, type RsvpResult } from "./RsvpPlayer";
import { QuizForm } from "@/components/quiz/QuizForm";
import { QuizResult } from "@/components/quiz/QuizResult";
import type { QuizQuestion } from "@/db/schema";

type Phase = "reading" | "quiz" | "results";

interface PassageReaderClientProps {
  passageId: string;
  text: string;
  initialWpm: number;
  initialChunkSize: number;
  quiz?: {
    id: string;
    questions: QuizQuestion[];
  };
}

export function PassageReaderClient({
  passageId,
  text,
  initialWpm,
  initialChunkSize,
  quiz,
}: PassageReaderClientProps) {
  const [phase, setPhase] = useState<Phase>("reading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correct: number;
    total: number;
  } | null>(null);
  const [startedAt] = useState(() => new Date().toISOString());

  async function handleRsvpComplete(result: RsvpResult) {
    const res = await fetch("/api/reading-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passageId,
        mode: "rsvp",
        wpmTarget: result.wpm,
        wpmAchieved: result.wpm,
        chunkSize: result.chunkSize,
        durationSeconds: Math.round(result.durationSeconds),
        wordsRead: result.wordsRead,
        startedAt,
        completedAt: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setSessionId(data.id);
    }

    if (quiz && quiz.questions.length > 0) {
      setPhase("quiz");
    }
  }

  function handleQuizComplete(result: { score: number; correct: number; total: number }) {
    setQuizResult(result);
    setPhase("results");
  }

  function handleReadAgain() {
    setPhase("reading");
    setSessionId(null);
    setQuizResult(null);
  }

  if (phase === "quiz" && quiz && sessionId) {
    return (
      <QuizForm
        quizId={quiz.id}
        questions={quiz.questions}
        readingSessionId={sessionId}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (phase === "results" && quizResult) {
    return (
      <QuizResult
        score={quizResult.score}
        correct={quizResult.correct}
        total={quizResult.total}
        passageId={passageId}
        onReadAgain={handleReadAgain}
      />
    );
  }

  return (
    <RsvpPlayer
      text={text}
      initialWpm={initialWpm}
      initialChunkSize={initialChunkSize}
      onComplete={handleRsvpComplete}
    />
  );
}
