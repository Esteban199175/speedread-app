import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { quizResults, quizzes } from "@/db/schema";
import { auth } from "@/lib/auth";

const submitSchema = z.object({
  readingSessionId: z.string().uuid(),
  quizId: z.string().uuid(),
  answers: z.array(z.number().int().nonnegative()),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { readingSessionId, quizId, answers } = parsed.data;

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, quizId),
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const questions = quiz.questions as Array<{
    question: string;
    choices: string[];
    correctIndex: number;
  }>;
  const correct = questions.filter((q, i) => q.correctIndex === answers[i]).length;
  const score = questions.length > 0 ? (correct / questions.length) * 100 : 0;

  const [row] = await db
    .insert(quizResults)
    .values({
      readingSessionId,
      userId: session.user.id,
      quizId,
      score: score.toString(),
      answers,
    })
    .returning();

  return NextResponse.json({ ...row, correct, total: questions.length }, { status: 201 });
}
