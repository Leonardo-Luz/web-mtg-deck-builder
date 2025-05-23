import { eq } from "drizzle-orm";

import { decksTable } from "@/models/deck";
import database from "../../config/database"

export async function getDecks() {
    return await database
        .select()
        .from(decksTable)
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
        .where(eq(decksTable.id, id))
}

export async function insertDeck(deck: typeof decksTable.$inferInsert) {
    await database
        .insert(decksTable)
        .values(deck)
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


