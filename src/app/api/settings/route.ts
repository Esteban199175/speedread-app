import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { auth } from "@/lib/auth";

const settingsSchema = z.object({
  dailyWpmGoal: z.number().int().min(50).max(2000).optional(),
  defaultChunkSize: z.number().int().min(1).max(3).optional(),
  defaultWpm: z.number().int().min(50).max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, session.user.id),
  });

  if (existing) {
    const [row] = await db
      .update(userSettings)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(userSettings.userId, session.user.id))
      .returning();
    return NextResponse.json(row);
  }

  const [row] = await db
    .insert(userSettings)
    .values({ userId: session.user.id, ...parsed.data })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
