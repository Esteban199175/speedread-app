import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { passages } from "@/db/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_VARIANT = {
  easy: "secondary",
  medium: "default",
  hard: "outline",
} as const;

export default async function ReaderPage() {
  const allPassages = await db.query.passages.findMany({
    where: eq(passages.type, "builtin"),
    orderBy: (p, { asc }) => [asc(p.difficulty), asc(p.title)],
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Speed Reading</h1>
      <p className="mb-6 text-muted-foreground">
        Choose a passage to train your reading speed with RSVP.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {allPassages.map((p) => (
          <Link key={p.id} href={`/reader/${p.id}`}>
            <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold leading-snug">{p.title}</h2>
                {p.difficulty && (
                  <Badge
                    variant={DIFFICULTY_VARIANT[p.difficulty]}
                    className="shrink-0 text-xs capitalize"
                  >
                    {p.difficulty}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{p.wordCount} words</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
