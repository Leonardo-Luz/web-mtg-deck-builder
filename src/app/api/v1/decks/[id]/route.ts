import { NextResponse } from "next/server";
import { deleteDeck, getDeckById, updateDeck } from "../../repositories/deck";
import { getServerSession } from "next-auth";
import { STATUS_CODES } from "http";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req: Request, context: { params: { id: string } }) => {
    const { id } = await context.params

    try {
        const data = await getDeckById(id)

        return new NextResponse(JSON.stringify({ success: true, data: { deck: data[0].decks, cards: data.map((deck) => deck.cards) } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export const PUT = async (req: Request, context: { params: { id: string } }) => {
    const data = await getServerSession(authOptions);
    const { deck } = await req.json()
    const { id } = await context.params

    if (!data)
        return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[401] }),
            { status: 401, headers: { 'Content-Type': 'application/json' } });

    const compDeck = await getDeckById(id)

    if (data.user.id != compDeck[0].decks.userId)
        return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[403] }),
            { status: 403, headers: { 'Content-Type': 'application/json' } });

    try {
        await updateDeck(id, deck)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export const DELETE = async (_: Request, context: { params: { id: string } }) => {
    const data = await getServerSession(authOptions);

    const { id } = await context.params

    if (!data)
        return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[401] }),
            { status: 401, headers: { 'Content-Type': 'application/json' } });

    const compDeck = await getDeckById(id)

    console.log(compDeck)
    console.log(data)

    if (data.user.id != compDeck[0].decks.userId)
        return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[403] }),
            { status: 403, headers: { 'Content-Type': 'application/json' } });

    try {
        await deleteDeck(id)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

