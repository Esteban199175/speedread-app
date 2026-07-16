import Link from "next/link";
import { eq, desc, gte, and } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { books, readingSessions, quizResults } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WpmChart } from "@/components/dashboard/WpmChart";
import { ComprehensionChart } from "@/components/dashboard/ComprehensionChart";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [recentSessions, recentQuizResults, allBooks] = await Promise.all([
    db.query.readingSessions.findMany({
      where: and(
        eq(readingSessions.userId, session.user.id),
        gte(readingSessions.startedAt, thirtyDaysAgo)
      ),
      orderBy: [desc(readingSessions.startedAt)],
    }),
    db.query.quizResults.findMany({
      where: and(
        eq(quizResults.userId, session.user.id),
        gte(quizResults.createdAt, thirtyDaysAgo)
      ),
      orderBy: [desc(quizResults.createdAt)],
    }),
    db.query.books.findMany({
      where: eq(books.userId, session.user.id),
    }),
  ]);

  const isNewUser = recentSessions.length === 0 && allBooks.length === 0;

  const totalWordsRead = recentSessions.reduce(
    (sum, s) => sum + (s.wordsRead ?? 0),
    0
  );
  const booksFinished = allBooks.filter((b) => b.status === "finished").length;
  const avgWpm =
    recentSessions.filter((s) => s.wpmAchieved).length > 0
      ? Math.round(
          recentSessions
            .filter((s) => s.wpmAchieved)
            .reduce((sum, s) => sum + s.wpmAchieved!, 0) /
            recentSessions.filter((s) => s.wpmAchieved).length
        )
      : 0;

  const avgComprehension =
    recentQuizResults.length > 0
      ? Math.round(
          recentQuizResults.reduce((sum, r) => sum + Number(r.score), 0) /
            recentQuizResults.length
        )
      : 0;

  const wpmData = recentSessions
    .filter((s) => s.wpmAchieved)
    .slice()
    .reverse()
    .map((s) => ({
      date: new Date(s.startedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      wpm: s.wpmAchieved!,
    }));

  const comprehensionData = recentQuizResults
    .slice()
    .reverse()
    .map((r) => ({
      date: new Date(r.createdAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: Number(r.score),
    }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">
        Welcome{isNewUser ? "" : " back"}, {session.user.name.split(" ")[0]}
      </h1>

      {isNewUser ? (
        <div className="mb-8 rounded-xl border bg-muted/40 p-6">
          <h2 className="text-lg font-semibold">Get started in 3 steps</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Do a speed reading session",
                desc: "Pick a passage and train your reading speed with RSVP.",
                href: "/reader",
                cta: "Start reading",
              },
              {
                step: "2",
                title: "Add a book you're reading",
                desc: "Track your current reads and log your progress.",
                href: "/library/new",
                cta: "Add a book",
              },
              {
                step: "3",
                title: "Set your goals",
                desc: "Configure your target WPM and daily reading goal.",
                href: "/settings",
                cta: "Open settings",
              },
            ].map(({ step, title, desc, href, cta }) => (
              <div key={step} className="flex flex-col gap-2 rounded-lg border bg-background p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step}
                </span>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
                <Button size="sm" className="mt-auto" nativeButton={false} render={<Link href={href} />}>
                  {cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6 flex gap-3">
          <Button nativeButton={false} render={<Link href="/reader" />}>Start reading session</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/library" />}>
            My library
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Avg WPM", avgWpm || "—", "last 30 days"],
          ["Comprehension", avgComprehension ? `${avgComprehension}%` : "—", "last 30 days"],
          ["Words read", totalWordsRead.toLocaleString() || "0", "last 30 days"],
          ["Books finished", booksFinished, "all time"],
        ].map(([label, value, sub]) => (
          <Card key={label} className="p-4">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Reading speed (WPM)</h2>
          <WpmChart data={wpmData} />
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Comprehension scores</h2>
          <ComprehensionChart data={comprehensionData} />
        </Card>
      </div>
    </div>
  );
}
