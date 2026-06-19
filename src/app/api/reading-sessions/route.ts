import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { readingSessions } from "@/db/schema";
import { auth } from "@/lib/auth";

const createSessionSchema = z.object({
  passageId: z.string().uuid().optional(),
  bookId: z.string().uuid().optional(),
  mode: z.enum(["rsvp", "manual"]),
  wpmTarget: z.number().int().positive().optional(),
  wpmAchieved: z.number().int().positive().optional(),
  chunkSize: z.number().int().min(1).max(3).optional(),
  durationSeconds: z.number().int().nonnegative(),
  wordsRead: z.number().int().nonnegative().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const [row] = await db
    .insert(readingSessions)
    .values({
      userId: session.user.id,
      passageId: data.passageId,
      bookId: data.bookId,
      mode: data.mode,
      wpmTarget: data.wpmTarget,
      wpmAchieved: data.wpmAchieved,
      chunkSize: data.chunkSize,
      durationSeconds: data.durationSeconds,
      wordsRead: data.wordsRead,
      startedAt: new Date(data.startedAt),
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
