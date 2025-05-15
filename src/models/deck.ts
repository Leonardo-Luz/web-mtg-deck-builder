import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const decksTable = pgTable("decks", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull(),
    commander: varchar({ length: 60 }),
    colors: varchar({ length: 100 }).notNull(),
    cards: varchar({ length: 60 }).array().notNull(),
    userId: uuid('user_id').references(() => usersTable.id)
});
