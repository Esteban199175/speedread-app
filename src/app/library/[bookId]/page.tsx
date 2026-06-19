import { notFound } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "@/db";
import { books, readingSessions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookForm } from "@/components/library/BookForm";

const STATUS_LABELS = {
  want_to_read: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return notFound();

  const book = await db.query.books.findFirst({
    where: and(eq(books.id, bookId), eq(books.userId, session.user.id)),
  });
  if (!book) return notFound();

  const sessions = await db.query.readingSessions.findMany({
    where: and(
      eq(readingSessions.bookId, bookId),
      eq(readingSessions.userId, session.user.id)
    ),
    orderBy: [desc(readingSessions.startedAt)],
    limit: 20,
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60;
  const totalWords = sessions.reduce((sum, s) => sum + (s.wordsRead ?? 0), 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <Link href="/library" className="text-sm text-muted-foreground hover:underline">
            ← Library
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{book.title}</h1>
          {book.author && (
            <p className="text-muted-foreground">{book.author}</p>
          )}
        </div>
        <Badge className="shrink-0">{STATUS_LABELS[book.status]}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Sessions", sessions.length],
          ["Words read", totalWords.toLocaleString()],
          ["Minutes read", Math.round(totalMinutes)],
          ["Pages", book.totalPages ?? "—"],
        ].map(([label, value]) => (
          <Card key={label} className="p-3 text-center">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-semibold">Edit book</h2>
        <Card className="p-6">
          <BookForm
            bookId={book.id}
            initial={{
              title: book.title,
              author: book.author ?? undefined,
              totalPages: book.totalPages ?? undefined,
              status: book.status,
            }}
          />
        </Card>
      </div>

      {sessions.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-semibold">Reading sessions</h2>
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Card key={s.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {new Date(s.startedAt).toLocaleDateString()}
                </span>
                <span className="text-sm">
                  {Math.round(s.durationSeconds / 60)} min
                  {s.wpmAchieved ? ` · ${s.wpmAchieved} WPM` : ""}
                  {s.wordsRead ? ` · ${s.wordsRead.toLocaleString()} words` : ""}
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
