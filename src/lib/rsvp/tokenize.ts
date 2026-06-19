export interface RsvpChunk {
  text: string;
  words: string[];
  /** Index into `text` of the character to highlight (Optimal Recognition Point). */
  orpIndex: number;
  /** How long this chunk should be displayed, in milliseconds. */
  durationMs: number;
}

const SENTENCE_END_RE = /[.!?]["')\]]?$/;
const CLAUSE_END_RE = /[,;:]["')\]]?$/;

/**
 * Approximate Optimal Recognition Point: the letter the eye should fixate on
 * to read a word fastest. Based on commonly cited Spritz-style positioning.
 */
export function calculateOrpIndex(word: string): number {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 4) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Splits a passage into RSVP display chunks, computing per-chunk timing and
 * ORP highlight position. Chunks ending a sentence get a longer pause so
 * comprehension isn't sacrificed for raw speed.
 */
export function tokenizePassage(
  text: string,
  chunkSize: number,
  wpm: number
): RsvpChunk[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const size = Math.max(1, chunkSize);
  const baseDurationMs = 60000 / Math.max(1, wpm);
  const chunks: RsvpChunk[] = [];

  for (let i = 0; i < words.length; i += size) {
    const chunkWords = words.slice(i, i + size);
    const chunkText = chunkWords.join(' ');

    // Highlight the longest word in the chunk - it's the slowest to process.
    const focalWord = chunkWords.reduce((longest, w) =>
      w.length > longest.length ? w : longest
    );
    const focalStart = chunkText.indexOf(focalWord);
    const orpIndex = focalStart + calculateOrpIndex(focalWord);

    let durationMs = baseDurationMs * chunkWords.length;

    const lastWord = chunkWords[chunkWords.length - 1];
    if (SENTENCE_END_RE.test(lastWord)) {
      durationMs *= 1.8;
    } else if (CLAUSE_END_RE.test(lastWord)) {
      durationMs *= 1.3;
    }

    if (focalWord.length >= 9) {
      durationMs *= 1.15;
    }

    chunks.push({ text: chunkText, words: chunkWords, orpIndex, durationMs });
  }

  return chunks;
}
