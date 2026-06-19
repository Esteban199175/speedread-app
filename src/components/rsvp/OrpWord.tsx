import type { RsvpChunk } from "@/lib/rsvp/tokenize";

export function OrpWord({ chunk }: { chunk: RsvpChunk }) {
  const before = chunk.text.slice(0, chunk.orpIndex);
  const orpChar = chunk.text[chunk.orpIndex] ?? "";
  const after = chunk.text.slice(chunk.orpIndex + 1);

  return (
    <div className="flex w-full items-center justify-center font-mono text-4xl tabular-nums select-none md:text-5xl">
      <span className="flex-1 whitespace-pre text-right">{before}</span>
      <span className="font-bold text-red-500">{orpChar}</span>
      <span className="flex-1 whitespace-pre text-left">{after}</span>
    </div>
  );
}
