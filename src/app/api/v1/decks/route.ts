import { NextResponse } from "next/server";
import { getDecks, insertDeck } from "../repositories/deck";

export const GET = async (req: Request) => {
    try {
        const decks = await getDecks()

        return new NextResponse(JSON.stringify({ success: true, data: decks }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export const POST = async (req: Request) => {
    const { deck } = await req.json()

    try {
        await insertDeck(deck)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
