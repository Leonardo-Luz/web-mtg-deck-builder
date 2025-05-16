import { NextResponse } from "next/server";
import { loginUser } from "../../repositories/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
    const { username, password } = await req.json();

    try {
        const user = await loginUser(username, password);

        if (!JWT_SECRET)
            return NextResponse.json(
                {
                    success: false,
                    error: "JWT_SECRET not provided"
                },
                { status: 401 }
            );

        const token = jwt.sign({
            id: user.id,
            username: user.username,
        }, JWT_SECRET, {
            expiresIn: '1d'
        });

        return NextResponse.json(
            {
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                },
            },
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (e) {
        console.error("Failed to login: ", e);
        return NextResponse.json(
            {
                success: false,
                error: "Server Error"
            },
            { status: 500 }
        );
    }
}
