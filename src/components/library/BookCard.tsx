import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  id: string;
  title: string;
  author?: string | null;
  status: "want_to_read" | "reading" | "finished";
  totalPages?: number | null;
}

const STATUS_LABELS: Record<BookCardProps["status"], string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

const STATUS_VARIANTS: Record<BookCardProps["status"], "default" | "secondary" | "outline"> = {
  want_to_read: "outline",
  reading: "default",
  finished: "secondary",
};

export function BookCard({ id, title, author, status, totalPages }: BookCardProps) {
  return (
    <Link href={`/library/${id}`}>
      <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{title}</h3>
          <Badge variant={STATUS_VARIANTS[status]} className="shrink-0 text-xs">
            {STATUS_LABELS[status]}
          </Badge>
        </div>
        {author && <p className="text-sm text-muted-foreground">{author}</p>}
        {totalPages && (
          <p className="mt-auto text-xs text-muted-foreground">{totalPages} pages</p>
        )}
      </Card>
    </Link>
  );
}
