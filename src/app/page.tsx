import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Read 2x faster. Remember more. Track every book.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        A speed-reading trainer, book tracker, and brain-training toolkit in
        one place.
      </p>
      <div className="mt-8 flex gap-4">
        {session ? (
          <Button size="lg" render={<Link href="/reader" />}>
            Start reading
          </Button>
        ) : (
          <>
            <Button size="lg" render={<Link href="/signup" />}>
              Get started free
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Sign in
            </Button>
          </>
        )}
      </div>
      <div className="mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
        {[
          {
            title: "RSVP Speed Training",
            body: "Words flash one at a time at a fixed focal point — no eye movement, no subvocalization. Train from 200 to 900+ WPM.",
          },
          {
            title: "Comprehension Quizzes",
            body: "Every passage ends with a quiz. Speed without understanding doesn't count — track both.",
          },
          {
            title: "Book Library & Dashboard",
            body: "Log every book you read, track your WPM over time, and watch your reading speed grow.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="rounded-xl border bg-card p-5 text-left">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
