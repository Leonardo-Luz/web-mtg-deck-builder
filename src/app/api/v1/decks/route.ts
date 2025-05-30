import { NextRequest, NextResponse } from "next/server";
import { getDecks, insertDeck } from "../repositories/deck";
import { Deck } from "@/types/deck";
import { insertCards } from "../repositories/card";

export const GET = async (_: Request) => {
    try {
        const decks = await getDecks()

        return new NextResponse(JSON.stringify({ success: true, data: decks }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

interface DeckNextRequest extends NextRequest {
    json: () => Promise<{ deck: Deck }>
}
export const POST = async (req: DeckNextRequest) => {
    const { deck } = await req.json()

    try {
        const insertedDeck = await insertDeck(deck)

        const parsedCards = deck.cards.map(card => {
            return {
                ...card,
                deckId: card.deckId = insertedDeck[0].id
            }
        })

        await insertCards(parsedCards)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
