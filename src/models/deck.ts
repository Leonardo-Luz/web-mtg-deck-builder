import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
import { cardsTable } from "./card";

export const decksTable = pgTable("decks", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull(),
    commander: varchar({ length: 60 }),
    colors: varchar({ length: 100 }).array().notNull(),
    userId: uuid('user_id').references(() => usersTable.id)
});

export const decksRelationships = relations(decksTable, ({ many }) => ({
    cards: many(cardsTable)
}))
