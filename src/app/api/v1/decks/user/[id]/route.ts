import { NextResponse } from "next/server";
import { getDecksByUser } from "../../../repositories/deck";

export const GET = async (req: Request, context: { params: { id: string } }) => {
    const { id } = await context.params

    try {
        const decks = await getDecksByUser(id)

        return new NextResponse(JSON.stringify({ success: true, data: decks }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
