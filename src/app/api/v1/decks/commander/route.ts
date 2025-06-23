import { NextResponse } from "next/server";
import { getDecksCommander } from "../../repositories/deck";

export const GET = async (_: Request) => {
    try {
        const decks = await getDecksCommander()

        return new NextResponse(JSON.stringify({ success: true, data: decks }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

