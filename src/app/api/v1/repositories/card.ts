import { cardsTable } from "@/models/card";
import database from "../../config/database";

export async function insertCards(cards: typeof cardsTable.$inferInsert[]) {
    return await database
        .insert(cardsTable)
        .values(cards)
}

