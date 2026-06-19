import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { passages, quizzes } from "../schema";
import type { QuizQuestion } from "../schema";

if (!process.env.DATABASE_URL) {
  process.loadEnvFile(".env.local");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const builtinPassages: Array<{
  title: string;
  body: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
}> = [
  {
    title: "The Science of Reading Speed",
    difficulty: "easy",
    body: `Most people read at around 200 to 250 words per minute. That is the pace drilled into us during early schooling, when reading aloud was common and subvocalization — silently pronouncing each word in your head — became a hard habit. The good news is that the brain can process written language far faster than the mouth can speak it.

Research shows that trained readers regularly hit 400 to 600 words per minute with full comprehension, and some speed-reading champions exceed 1,000 words per minute. The key is breaking two bottlenecks: eye movement and inner speech.

Your eyes do not glide smoothly across a line of text. They jump in short bursts called saccades, landing on fixation points where the brain actually reads. Slow readers make many small saccades; trained readers make fewer, wider ones. Rapid Serial Visual Presentation, or RSVP, sidesteps eye movement entirely by bringing the words to your eyes at a fixed point.

The second bottleneck, subvocalization, is harder to eliminate but can be reduced. Listening to music without lyrics, tapping a finger, or simply training with higher speeds forces the brain to stop sounding out every word and start pattern-matching meaning directly. Over weeks of practice, that new mode becomes the default.`,
    questions: [
      {
        question: "What is the average reading speed for most people?",
        choices: ["100–150 WPM", "200–250 WPM", "400–500 WPM", "600–700 WPM"],
        correctIndex: 1,
      },
      {
        question: "What are the two main bottlenecks to reading speed?",
        choices: [
          "Vocabulary and grammar",
          "Eye movement and inner speech",
          "Short-term memory and focus",
          "Line length and font size",
        ],
        correctIndex: 1,
      },
      {
        question: "What does RSVP stand for in the context of speed reading?",
        choices: [
          "Rapid Speed Visual Processing",
          "Reading Speed and Vision Practice",
          "Rapid Serial Visual Presentation",
          "Responsive Sequential Visual Parsing",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    title: "How Memory Consolidates While You Sleep",
    difficulty: "easy",
    body: `Every night, while you sleep, your brain runs a quiet maintenance cycle that most people never think about. The hippocampus — a seahorse-shaped structure deep in the brain — replays the day's experiences and ships the important ones off to the cortex for long-term storage. This process is called memory consolidation, and skipping even one night of sleep can measurably impair it.

During slow-wave sleep, the brain produces large, synchronized electrical waves. These waves appear to coordinate a transfer of information from the hippocampus, which has limited capacity, to the cortex, which can store memories almost indefinitely. Studies that taught volunteers new motor skills and then tested them after a night of sleep versus a night without it found consistent, large differences in retention: the sleepers remembered significantly more.

REM sleep, the dream-heavy stage that comes later in the night, seems to specialize in emotional memories and creative connections. People deprived of REM sleep struggle to recognize emotional cues in facial expressions and lose the ability to link distantly related ideas.

The practical takeaway is simple: learning something new works best when followed by a full night's sleep. Cramming the night before a test and sleeping only four hours might load information into your hippocampus, but much of it will fade before consolidation can finish the job.`,
    questions: [
      {
        question: "Which brain structure replays experiences during sleep?",
        choices: ["Amygdala", "Prefrontal cortex", "Hippocampus", "Cerebellum"],
        correctIndex: 2,
      },
      {
        question: "What happens during slow-wave sleep?",
        choices: [
          "The brain dreams vividly",
          "Memories transfer from hippocampus to cortex",
          "The body fully paralyzes",
          "Blood pressure spikes",
        ],
        correctIndex: 1,
      },
      {
        question:
          "Which type of sleep specializes in emotional memories and creative connections?",
        choices: [
          "Slow-wave sleep",
          "Light sleep (N1)",
          "REM sleep",
          "Deep sleep (N3)",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    title: "The Attention Economy",
    difficulty: "medium",
    body: `In 1971, the economist Herbert Simon wrote that a wealth of information creates a poverty of attention. He could not have imagined smartphones, social media feeds, or algorithmically optimized notification systems — yet his observation has never been more accurate.

The human attention system did not evolve for modern digital environments. It evolved to detect sudden changes in the environment: a rustle in the bushes, a flash of movement at the edge of vision. Every notification, every autoplay video, every infinite scroll exploits this ancient reflex. Tech companies have spent billions learning exactly how to trigger it.

The result is what researchers call continuous partial attention: a state in which people are perpetually scanning for something more interesting than what is in front of them. Unlike multitasking, which implies completing two tasks simultaneously, continuous partial attention means finishing neither one well. Cognitive switching costs — the mental overhead of redirecting focus — mean that each interruption costs far more time than the interruption itself.

Some researchers estimate that after an interruption it takes an average of twenty-three minutes to fully regain deep focus. If you receive only three interruptions per hour, you effectively never return to your best thinking. The growing field of digital minimalism argues that the solution is not better time management but structural changes: phone-free rooms, scheduled email checks, and deliberate friction added to distracting apps. The goal is not to optimize attention around distractions but to eliminate the distractions themselves.`,
    questions: [
      {
        question: "Who coined the phrase about information wealth creating attention poverty?",
        choices: ["Steve Jobs", "Herbert Simon", "Cal Newport", "B.F. Skinner"],
        correctIndex: 1,
      },
      {
        question: "What is 'continuous partial attention'?",
        choices: [
          "Completing two tasks at once efficiently",
          "Focusing deeply on a single task",
          "Perpetually scanning for something more interesting",
          "Alternating between work and rest cycles",
        ],
        correctIndex: 2,
      },
      {
        question:
          "Approximately how long does it take to fully regain deep focus after an interruption?",
        choices: ["5 minutes", "10 minutes", "23 minutes", "45 minutes"],
        correctIndex: 2,
      },
      {
        question: "What does digital minimalism recommend?",
        choices: [
          "Better time management apps",
          "Structural changes to eliminate distractions",
          "Scheduling two-hour focus blocks",
          "Disabling all social media permanently",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "Flow States and Peak Performance",
    difficulty: "medium",
    body: `Psychologist Mihaly Csikszentmihalyi spent decades studying what he called optimal experience — the moments when people report feeling most alive, focused, and creative. He named the phenomenon flow, and found that it appears across wildly different activities: chess, rock climbing, surgery, jazz improvisation, and programming.

Flow has a clear neurological signature. Activity in the prefrontal cortex — the seat of self-monitoring, doubt, and social anxiety — decreases sharply. Paradoxically, people perform better when they are less self-conscious. Transient hypofrontality, as scientists call this state, is associated with an altered sense of time and a feeling of effortless control.

The conditions that trigger flow are well-studied. The task must be challenging enough to fully engage skill, but not so hard that it produces anxiety. The feedback must be immediate — a musician hears each wrong note; a rock climber feels each handhold. And the goal must be clear. Vague, open-ended work rarely produces flow.

This has practical implications for learning. Deliberately structuring sessions with clear, incremental challenges — slightly above current skill level, with immediate feedback on progress — is not just motivating. It activates the neurological conditions for accelerated skill acquisition. Drills that bore and drills that overwhelm both fail. The narrow band in between is where expertise is built.`,
    questions: [
      {
        question: "Who coined the term 'flow' for optimal experience?",
        choices: [
          "William James",
          "Abraham Maslow",
          "Mihaly Csikszentmihalyi",
          "Daniel Kahneman",
        ],
        correctIndex: 2,
      },
      {
        question: "What is transient hypofrontality?",
        choices: [
          "Increased activity in the prefrontal cortex",
          "Decreased activity in the prefrontal cortex",
          "Heightened emotional reactivity",
          "A type of deep sleep stage",
        ],
        correctIndex: 1,
      },
      {
        question: "Which condition is NOT required to trigger a flow state?",
        choices: [
          "Clear goal",
          "Immediate feedback",
          "Appropriate challenge level",
          "Complete silence",
        ],
        correctIndex: 3,
      },
    ],
  },
  {
    title: "The Myth of Multitasking",
    difficulty: "medium",
    body: `For two decades, multitasking was marketed as a superpower. Employers listed it as a desirable skill. Self-help books promised techniques for doing more things simultaneously. The science, however, tells a different story.

The brain does not truly multitask. It switches. When you think you are doing two cognitive tasks at once, your brain is rapidly alternating between them, each switch incurring a cost. Stanford researcher Clifford Nass spent years studying people who described themselves as chronic multitaskers. He expected them to be exceptionally good at managing multiple streams of information. Instead, his team found the opposite: heavy multitaskers were worse at filtering irrelevant information, worse at organizing their working memory, and worse at switching between tasks than people who rarely multitasked.

The cruel irony is that the people who multitask most are often least suited to it. The habit of dividing attention trains the brain to crave stimulation and find sustained focus uncomfortable. Neuroimaging studies show that habitual media multitaskers have reduced density in the anterior cingulate cortex, a region associated with cognitive control.

Recovery is possible. Periods of deliberate monotasking — focused, single-task work with all notifications off — gradually rebuild the capacity for sustained attention. The brain retains plasticity throughout adulthood, and attention is a trainable skill, not a fixed trait.`,
    questions: [
      {
        question: "What does the brain actually do when we think we are multitasking?",
        choices: [
          "Processes tasks in parallel streams",
          "Rapidly switches between tasks",
          "Compresses tasks into a single operation",
          "Stores tasks in a queue and ignores all but one",
        ],
        correctIndex: 1,
      },
      {
        question:
          "What did Clifford Nass find about heavy multitaskers at Stanford?",
        choices: [
          "They were better at filtering information",
          "They had superior working memory",
          "They were worse at filtering, memory, and task-switching",
          "They showed stronger prefrontal activity",
        ],
        correctIndex: 2,
      },
      {
        question: "Which brain region shows reduced density in habitual multitaskers?",
        choices: [
          "Hippocampus",
          "Anterior cingulate cortex",
          "Visual cortex",
          "Broca's area",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "Why We Forget — and How to Remember More",
    difficulty: "hard",
    body: `Hermann Ebbinghaus, a nineteenth-century German psychologist, memorized thousands of nonsense syllables and tested his own retention at carefully timed intervals. The result was the forgetting curve: a mathematical description of how memories decay. Within twenty-four hours of learning something new, the average person forgets more than half of it. Within a week, retention drops below twenty-five percent without reinforcement.

The antidote, Ebbinghaus discovered, is spaced repetition: reviewing material at increasing intervals just as it is about to be forgotten. A memory reviewed at the right moment does not just get refreshed — it gets consolidated more deeply. Modern spaced-repetition software uses algorithms to predict the optimal review moment for each individual piece of information.

The second key principle is retrieval practice. Rereading notes feels productive but produces little durable learning. Testing yourself — even when you fail — does. The act of attempting to retrieve information from memory strengthens the neural pathways associated with that information, a phenomenon called the testing effect. Research by Henry Roediger and Jeffrey Karpicke found that students who tested themselves on material consistently outperformed those who spent equal time rereading it, often by a factor of two.

Interleaving adds a third dimension. Practicing one skill type in isolation produces faster initial gains but worse long-term retention. Mixing topics or problem types forces the brain to identify which strategy applies to which situation, a harder task that produces more flexible, transferable knowledge. The short-term difficulty is the point: desirable difficulties, as psychologist Robert Bjork named them, create lasting learning.`,
    questions: [
      {
        question: "Who developed the forgetting curve?",
        choices: [
          "William James",
          "Hermann Ebbinghaus",
          "Ivan Pavlov",
          "Sigmund Freud",
        ],
        correctIndex: 1,
      },
      {
        question: "What does spaced repetition optimize?",
        choices: [
          "The number of items studied per session",
          "The timing of reviews to match the forgetting curve",
          "The reading speed of the learner",
          "The visual layout of study material",
        ],
        correctIndex: 1,
      },
      {
        question: "What is the 'testing effect'?",
        choices: [
          "The anxiety caused by exams that impairs memory",
          "Strengthened memory pathways from attempting retrieval",
          "Improved test scores from longer study sessions",
          "Reduced forgetting due to emotional arousal during tests",
        ],
        correctIndex: 1,
      },
      {
        question:
          "What did Roediger and Karpicke find about self-testing versus rereading?",
        choices: [
          "Rereading produced better long-term retention",
          "Both methods were equally effective",
          "Self-testing produced roughly double the retention",
          "Self-testing only helped for factual material",
        ],
        correctIndex: 2,
      },
      {
        question: "What does Robert Bjork call the principle behind interleaving's benefits?",
        choices: [
          "Deep processing",
          "Contextual interference",
          "Desirable difficulties",
          "Effortful encoding",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    title: "The Neuroscience of Habit Formation",
    difficulty: "hard",
    body: `Every habit follows the same circuit: a cue triggers a routine, which produces a reward. Neuroscientists have mapped this loop to the basal ganglia — a cluster of structures near the base of the brain that governs automatic behavior. When a behavior is new, the prefrontal cortex is heavily involved; it must consciously direct each step. As the behavior is repeated and becomes automatic, control shifts to the basal ganglia, freeing the cortex for other tasks. This chunking process is why an experienced driver can navigate familiar roads while having a conversation, while a new driver cannot.

The basal ganglia do not distinguish between useful habits and harmful ones. They encode whatever routine reliably produces reward. This is why habits, once formed, are extraordinarily resilient: the cue-routine-reward loop is physically encoded in neural architecture. Willpower, which draws on prefrontal resources, is a depletable resource subject to ego depletion. Attempting to overpower a bad habit with willpower alone is fighting the cortex against the basal ganglia — a mismatch in raw processing power.

The more effective strategy, supported by behavior change research, is to alter the cue or restructure the environment so the old routine is never triggered. Implementation intentions — specific if-then plans such as "If it is seven a.m. and I am making coffee, I will open my textbook" — attach a desired behavior to an existing cue, reducing the cognitive load of initiating it. Researchers Peter Gollwitzer and Paschal Sheeran found that implementation intentions roughly doubled the rate of follow-through on intentions compared to goals stated without specific when-where-how plans.`,
    questions: [
      {
        question: "Which brain structure governs automatic, habitual behavior?",
        choices: [
          "Prefrontal cortex",
          "Hippocampus",
          "Basal ganglia",
          "Amygdala",
        ],
        correctIndex: 2,
      },
      {
        question: "What is 'chunking' in the context of habit formation?",
        choices: [
          "Grouping similar habits together",
          "The process of behavior becoming automatic via the basal ganglia",
          "Dividing learning sessions into short blocks",
          "Combining multiple cues into one trigger",
        ],
        correctIndex: 1,
      },
      {
        question: "Why is willpower alone an ineffective strategy against bad habits?",
        choices: [
          "Willpower is controlled by the amygdala, which is weaker than the cortex",
          "Bad habits are stored in the cortex and cannot be overwritten",
          "Willpower draws on depletable prefrontal resources, while habits live in the basal ganglia",
          "The basal ganglia responds only to emotional triggers, not rational ones",
        ],
        correctIndex: 2,
      },
      {
        question: "What are implementation intentions?",
        choices: [
          "Long-term goal statements written in journals",
          "Specific if-then plans linking behavior to existing cues",
          "Mental rehearsal techniques for athletes",
          "Scheduled reminders set on a phone",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "Deep Work in a Distracted World",
    difficulty: "hard",
    body: `Knowledge workers face a paradox: the skills that produce the most economic value — the ability to master complex information quickly and produce at an elite level — require long periods of unbroken concentration. Yet the modern workplace has organized itself around communication norms that make such concentration nearly impossible. Open-plan offices, instant messaging, and the expectation of rapid email responses have collectively created an environment hostile to the very cognitive mode that generates the most value.

Cal Newport, who coined the term "deep work," defines it as professional activity performed in a state of distraction-free concentration that pushes cognitive capabilities to their limit. The contrasting mode — shallow work, logistical tasks that can be performed while distracted — consumes the majority of most knowledge workers' hours. Newport argues that deep work is becoming simultaneously rarer and more valuable, creating a productivity gap between those who can reliably produce it and those who cannot.

Deliberate practice, the mechanism by which elite performers in any field acquire their skills, requires the same focused state. The neurological argument is specific: myelin, the insulating sheath that speeds electrical signals along neurons, is built during intense, focused practice. Distracted practice produces far less myelin and far slower skill acquisition. Anders Ericsson's decades of research on expert performance found that the ability to sustain focused practice — not raw talent — was the primary predictor of reaching elite levels.

Strategies for cultivating deep work capacity include strict scheduling, geographic isolation, digital communication protocols, and the ritualization of deep work sessions to reduce the activation energy required to start them. The goal is not to work longer but to reclaim the hours most often lost to low-value, interruptive activity.`,
    questions: [
      {
        question: "How does Cal Newport define 'deep work'?",
        choices: [
          "Any work done after normal business hours",
          "Distraction-free concentration that pushes cognitive capabilities to their limit",
          "Complex emotional labor requiring empathy",
          "Collaborative projects involving multiple team members",
        ],
        correctIndex: 1,
      },
      {
        question: "What neurological substance is built during focused practice?",
        choices: ["Serotonin", "Dopamine", "Myelin", "Cortisol"],
        correctIndex: 2,
      },
      {
        question:
          "According to Anders Ericsson, what is the primary predictor of elite performance?",
        choices: [
          "Raw innate talent",
          "Hours of any type of practice",
          "Ability to sustain focused practice",
          "Access to expert coaching",
        ],
        correctIndex: 2,
      },
      {
        question: "What does Newport call routine tasks done while distracted?",
        choices: [
          "Busy work",
          "Shallow work",
          "Reactive work",
          "Administrative overhead",
        ],
        correctIndex: 1,
      },
    ],
  },
];

async function seed() {
  console.log("Seeding built-in passages and quizzes...");

  for (const p of builtinPassages) {
    const wordCount = p.body.trim().split(/\s+/).length;

    const [inserted] = await db
      .insert(passages)
      .values({
        type: "builtin",
        title: p.title,
        body: p.body,
        wordCount,
        difficulty: p.difficulty,
        sourceFormat: "plain",
      })
      .returning({ id: passages.id });

    await db.insert(quizzes).values({
      passageId: inserted.id,
      questions: p.questions,
    });

    console.log(`  ✓ "${p.title}" (${wordCount} words, ${p.difficulty})`);
  }

  console.log(`\nDone — seeded ${builtinPassages.length} passages.`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
