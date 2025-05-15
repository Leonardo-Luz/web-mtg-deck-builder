import { NextResponse } from "next/server";
import { getDecksByUser } from "../../../repositories/deck";

export const GET = async (req: Request, context: { params: { userId: string } }) => {
    const { userId } = context.params

    try {
        const decks = await getDecksByUser(userId)

        return new NextResponse(JSON.stringify({ success: true, data: decks }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
