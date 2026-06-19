import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, session.user.id),
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <Card className="p-6">
        <SettingsForm
          userId={session.user.id}
          initial={{
            dailyWpmGoal: settings?.dailyWpmGoal ?? 300,
            defaultChunkSize: settings?.defaultChunkSize ?? 1,
            defaultWpm: settings?.defaultWpm ?? 250,
          }}
        />
      </Card>
    </div>
  );
}
