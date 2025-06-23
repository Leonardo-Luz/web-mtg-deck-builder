import { cardsTable } from "@/models/card";
import database from "../../config/database";
import { eq } from "drizzle-orm";

export async function insertCards(cards: typeof cardsTable.$inferInsert[]) {
    return await database
        .insert(cardsTable)
        .values(cards)
}

export async function updateCard(id: string, card: typeof cardsTable.$inferInsert) {
    await database
        .update(cardsTable)
        .set({
            ...card,
            id: id
        })
        .where(eq(cardsTable.id, id))
}
