import { NextResponse } from "next/server";
import { registerUser } from "../../repositories/user";

export async function POST(req: Request) {
    const { name, username, password } = await req.json();

    try {
        await registerUser({
            name: name,
            username: username,
            password: password
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.log("e: ", e);
        return NextResponse.json({ success: false, error: (e as Error).message }, { status: 400 });
    }
}
