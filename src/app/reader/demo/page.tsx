import { RsvpPlayer } from "@/components/rsvp/RsvpPlayer";

const SAMPLE_TITLE = "Why Most Readers Plateau";

const SAMPLE_TEXT = `Most people read at roughly the same speed they did in middle school, somewhere between two hundred and two hundred fifty words per minute. The reason has little to do with intelligence and almost everything to do with habit. As your eyes move across a page, they do not glide smoothly. Instead, they jump from word to word in short bursts called saccades, pausing briefly on each one. Many readers also pause on words they have already seen, drifting backward without realizing it. These regressions feel like careful reading, but they mostly just waste time. A second habit, called subvocalization, is the quiet inner voice that sounds out every word as you read it. It feels natural, almost essential, yet it caps your reading speed at roughly the speed of speech. Rapid serial visual presentation breaks both habits at once. Instead of letting your eyes wander across a line, words appear one after another at a single fixed point. There is nowhere to drift back to, so regressions disappear. Because the pace is set for you, the inner voice has less time to catch up, and with practice it grows quieter. The highlighted letter near the center of each word is called the optimal recognition point. Fixating there lets your eyes process the whole word in a single glance rather than several smaller ones. None of this replaces comprehension. A faster reader who understands nothing has not actually read anything. That is why pairing speed practice with short recall questions matters: it keeps the gains honest, and over weeks of regular practice, many readers comfortably double their starting speed without losing the meaning of what they read.`;

export default function ReaderDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{SAMPLE_TITLE}</h1>
        <p className="text-sm text-muted-foreground">
          Sample passage &middot; {SAMPLE_TEXT.trim().split(/\s+/).length} words
        </p>
      </div>
      <RsvpPlayer text={SAMPLE_TEXT} initialWpm={300} initialChunkSize={1} />
    </div>
  );
}
