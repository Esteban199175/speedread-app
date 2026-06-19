"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reader", label: "Read" },
  { href: "/library", label: "Library" },
];

export function NavBar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="font-bold tracking-tight">
          SpeedRead
        </Link>
        <div className="flex flex-1 items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted ${
                pathname.startsWith(l.href) ? "bg-muted font-medium" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {userName && (
            <Link
              href="/settings"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {userName}
            </Link>
          )}
          <Button size="sm" variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </nav>
    </header>
  );
}
