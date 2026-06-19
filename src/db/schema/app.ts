import {
  pgTable,
  pgEnum,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  time,
  jsonb,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const themeEnum = pgEnum("theme", ["system", "light", "dark"]);
export const bookStatusEnum = pgEnum("book_status", [
  "want_to_read",
  "reading",
  "finished",
]);
export const bookSourceEnum = pgEnum("book_source", [
  "manual",
  "open_library",
  "upload",
]);
export const passageTypeEnum = pgEnum("passage_type", [
  "builtin",
  "user_upload",
]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const sourceFormatEnum = pgEnum("source_format", [
  "plain",
  "pdf",
  "epub",
]);
export const sessionModeEnum = pgEnum("session_mode", ["rsvp", "manual"]);

export interface QuizQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
}

export const passages = pgTable(
  "passages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: passageTypeEnum("type").notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    wordCount: integer("word_count").notNull(),
    difficulty: difficultyEnum("difficulty"),
    sourceFormat: sourceFormatEnum("source_format").notNull().default("plain"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("passages_type_user_idx").on(table.type, table.userId)]
);

export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  passageId: uuid("passage_id").references(() => passages.id, {
    onDelete: "cascade",
  }),
  questions: jsonb("questions").notNull().$type<QuizQuestion[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const books = pgTable(
  "books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    author: text("author"),
    coverUrl: text("cover_url"),
    isbn: text("isbn"),
    openLibraryId: text("open_library_id"),
    totalPages: integer("total_pages"),
    status: bookStatusEnum("status").notNull().default("want_to_read"),
    source: bookSourceEnum("source").notNull().default("manual"),
    contentId: uuid("content_id").references(() => passages.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("books_user_status_idx").on(table.userId, table.status)]
);

export const readingSessions = pgTable(
  "reading_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    bookId: uuid("book_id").references(() => books.id, {
      onDelete: "set null",
    }),
    passageId: uuid("passage_id").references(() => passages.id, {
      onDelete: "set null",
    }),
    mode: sessionModeEnum("mode").notNull(),
    wpmTarget: integer("wpm_target"),
    wpmAchieved: integer("wpm_achieved"),
    chunkSize: integer("chunk_size"),
    durationSeconds: integer("duration_seconds").notNull(),
    wordsRead: integer("words_read"),
    pagesRead: numeric("pages_read"),
    percentComplete: numeric("percent_complete"),
    startedAt: timestamp("started_at").notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("reading_sessions_user_started_idx").on(
      table.userId,
      table.startedAt
    ),
  ]
);

export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  readingSessionId: uuid("reading_session_id").references(
    () => readingSessions.id,
    { onDelete: "cascade" }
  ),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  quizId: uuid("quiz_id").references(() => quizzes.id, {
    onDelete: "set null",
  }),
  score: numeric("score").notNull(),
  answers: jsonb("answers").notNull().$type<number[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  dailyWpmGoal: integer("daily_wpm_goal").notNull().default(300),
  defaultChunkSize: integer("default_chunk_size").notNull().default(1),
  defaultWpm: integer("default_wpm").notNull().default(250),
  reminderEnabled: boolean("reminder_enabled").notNull().default(false),
  reminderTime: time("reminder_time"),
  theme: themeEnum("theme").notNull().default("system"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
