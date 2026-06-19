import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizResultProps {
  score: number;
  correct: number;
  total: number;
  passageId: string;
  onReadAgain: () => void;
}

export function QuizResult({ score, correct, total, onReadAgain }: QuizResultProps) {
  const pct = Math.round(score);
  const grade =
    pct >= 80 ? "Excellent!" : pct >= 60 ? "Good job!" : "Keep practicing!";

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${
          pct >= 80
            ? "bg-green-100 text-green-700"
            : pct >= 60
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        {pct}%
      </div>
      <div>
        <p className="text-2xl font-semibold">{grade}</p>
        <p className="mt-1 text-muted-foreground">
          {correct} of {total} correct
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onReadAgain}>
          Read again
        </Button>
        <Button render={<Link href="/reader" />}>Try another passage</Button>
      </div>
    </div>
  );
}
