import { uuid, pgTable, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { decksTable } from "./deck";

export const cardsTable = pgTable("cards", {
    id: uuid().primaryKey().defaultRandom(),
    card: varchar({ length: 100 }).notNull(),
    qty: integer().notNull().default(1),
    commander: boolean().default(false),
    deckId: uuid('deck_id').references(() => decksTable.id, { onDelete: 'cascade' })
});
