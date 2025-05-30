import { NextResponse } from "next/server";
import { deleteDeck, getDeckById, updateDeck } from "../../repositories/deck";

export const GET = async (req: Request, context: { params: { id: string } }) => {
    const { id } = context.params

    try {
        const data = await getDeckById(id)

        return new NextResponse(JSON.stringify({ success: true, data: { deck: data[0].decks, cards: data.map((deck) => deck.cards) } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export const PUT = async (req: Request, context: { params: { id: string } }) => {
    const { deck } = await req.json()
    const { id } = context.params

    try {
        updateDeck(id, deck)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export const DELETE = async (_: Request, context: { params: { id: string } }) => {
    const { id } = context.params

    try {
        deleteDeck(id)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

