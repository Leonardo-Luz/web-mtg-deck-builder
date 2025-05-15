import { NextResponse } from "next/server";
import { loginUser } from "../../repositories/user";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    try {
        const user = await loginUser(
            username,
            password
        );
        return NextResponse.json({ success: true, id: user.id }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        console.log("Failed to login: ", e)

        return NextResponse.json({ success: false, error: (e as Error).message }, { status: 400 });
    }
}
