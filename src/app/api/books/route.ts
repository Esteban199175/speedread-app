import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { books } from "@/db/schema";
import { auth } from "@/lib/auth";

const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  coverUrl: z.string().url().optional(),
  isbn: z.string().optional(),
  totalPages: z.number().int().positive().optional(),
  status: z.enum(["want_to_read", "reading", "finished"]).default("want_to_read"),
});

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.query.books.findMany({
    where: eq(books.userId, session.user.id),
    orderBy: (b, { desc }) => [desc(b.updatedAt)],
  });

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createBookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .insert(books)
    .values({ ...parsed.data, userId: session.user.id, source: "manual" })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
