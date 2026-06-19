import { Card } from "@/components/ui/card";
import { BookForm } from "@/components/library/BookForm";

export default function NewBookPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Add a book</h1>
      <Card className="p-6">
        <BookForm />
      </Card>
    </div>
  );
}
