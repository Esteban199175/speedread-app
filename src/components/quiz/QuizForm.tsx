"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/db/schema";

interface QuizFormProps {
  quizId: string;
  questions: QuizQuestion[];
  readingSessionId: string;
  onComplete: (result: { score: number; correct: number; total: number }) => void;
}

export function QuizForm({ quizId, questions, readingSessionId, onComplete }: QuizFormProps) {
  const [selected, setSelected] = useState<(number | null)[]>(
    () => questions.map(() => null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (selected.some((s) => s === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/quiz-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readingSessionId, quizId, answers: selected }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Failed to submit quiz. Please try again.");
      return;
    }

    const data = await res.json();
    onComplete({ score: data.score, correct: data.correct, total: data.total });
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-semibold">Comprehension Check</h2>
      {questions.map((q, qi) => (
        <div key={qi} className="flex flex-col gap-3">
          <p className="font-medium">
            {qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.choices.map((choice, ci) => (
              <button
                key={ci}
                onClick={() =>
                  setSelected((prev) => {
                    const next = [...prev];
                    next[qi] = ci;
                    return next;
                  })
                }
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  selected[qi] === ci
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit answers"}
      </Button>
    </div>
  );
}
