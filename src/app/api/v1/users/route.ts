import { NextResponse } from "next/server";
import { getUsers } from "../repositories/user";

export const GET = async (req: Request) => {
    try {
        const users = await getUsers()

        return new NextResponse(JSON.stringify({ success: true, data: users }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

