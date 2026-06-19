import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { passages, quizzes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { userSettings } from "@/db/schema";
import { PassageReaderClient } from "@/components/rsvp/PassageReaderClient";
import type { QuizQuestion } from "@/db/schema";

export default async function PassagePage({
  params,
}: {
  params: Promise<{ passageId: string }>;
}) {
  const { passageId } = await params;

  const passage = await db.query.passages.findFirst({
    where: eq(passages.id, passageId),
  });
  if (!passage) return notFound();

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.passageId, passageId),
  });

  const session = await auth.api.getSession({ headers: await headers() });
  const settings = session
    ? await db.query.userSettings.findFirst({
        where: eq(userSettings.userId, session.user.id),
      })
    : null;

  const initialWpm = settings?.defaultWpm ?? 300;
  const initialChunkSize = settings?.defaultChunkSize ?? 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          <a href="/reader" className="hover:underline">
            ← All passages
          </a>
        </p>
        <h1 className="mt-1 text-xl font-bold">{passage.title}</h1>
        <p className="text-sm text-muted-foreground">{passage.wordCount} words</p>
      </div>

      <PassageReaderClient
        passageId={passage.id}
        text={passage.body}
        initialWpm={initialWpm}
        initialChunkSize={initialChunkSize}
        quiz={
          quiz
            ? {
                id: quiz.id,
                questions: quiz.questions as QuizQuestion[],
              }
            : undefined
        }
      />
    </div>
  );
}
