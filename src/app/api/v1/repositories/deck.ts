import { and, eq } from "drizzle-orm";

import { decksTable } from "@/models/deck";
import database from "../../config/database"
import { cardsTable } from "@/models/card";

export async function getDecks() {
    return await database
        .select()
        .from(decksTable)
}

export async function getDecksCommander() {
    return await database
        .select()
        .from(decksTable)
        .leftJoin(cardsTable, and(
            eq(decksTable.id, cardsTable.deckId),
            eq(cardsTable.commander, true)
        ));
}

export async function getDecksByUser(userId: string) {
    return await database
        .select()
        .from(decksTable)
        .where(eq(decksTable.userId, userId));
}

export async function getDeckById(id: string) {
    return await database
        .select()
        .from(decksTable)
        .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
        .where(eq(decksTable.id, id))
}

export async function insertDeck(deck: typeof decksTable.$inferInsert) {
    return await database
        .insert(decksTable)
        .values(deck)
        .returning()
}

export async function updateDeck(id: string, deck: typeof decksTable.$inferInsert) {
    await database
        .update(decksTable)
        .set({
            ...deck,
            id: id
        })
        .where(eq(decksTable.id, id))
}

export async function deleteDeck(id: string) {
    await database.delete(decksTable).where(eq(decksTable.id, id))
}


