import { uuid, pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { decksTable } from "./deck";

export const cardsTable = pgTable("cards", {
    id: uuid().primaryKey().defaultRandom(),
    card: varchar({ length: 100 }).notNull(),
    qty: integer().notNull().default(1),
    deckId: uuid('deck_id').references(() => decksTable.id)
});
