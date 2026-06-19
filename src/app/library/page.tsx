import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { books } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/library/BookCard";

export default async function LibraryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const allBooks = session
    ? await db.query.books.findMany({
        where: eq(books.userId, session.user.id),
        orderBy: (b, { desc }) => [desc(b.updatedAt)],
      })
    : [];

  const byStatus = {
    reading: allBooks.filter((b) => b.status === "reading"),
    want_to_read: allBooks.filter((b) => b.status === "want_to_read"),
    finished: allBooks.filter((b) => b.status === "finished"),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Library</h1>
        <Button render={<Link href="/library/new" />}>+ Add book</Button>
      </div>

      {allBooks.length === 0 ? (
        <p className="text-muted-foreground">
          No books yet.{" "}
          <Link href="/library/new" className="underline underline-offset-2">
            Add your first book
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {(
            [
              ["Currently reading", byStatus.reading],
              ["Want to read", byStatus.want_to_read],
              ["Finished", byStatus.finished],
            ] as const
          )
            .filter(([, list]) => list.length > 0)
            .map(([label, list]) => (
              <section key={label}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      status={book.status}
                      totalPages={book.totalPages}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
