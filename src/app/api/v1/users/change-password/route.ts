import { STATUS_CODES } from "http";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { updateUserPassword } from "../../repositories/user";
import { authOptions } from "@/utils/authOptions";
import { AuthError } from "../../lib/errors";

export const PUT = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions)

        const { oldPassword, newPassword } = await req.json();

        if (!session || !session.user) {
            return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[401] }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const { user } = session;

        await updateUserPassword(user.id, oldPassword, newPassword)

        return new NextResponse(JSON.stringify({ success: true, message: "Password successfully changed!" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err)

        if (err instanceof AuthError)
            return new NextResponse(JSON.stringify({ success: false, message: err.message }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        else
            return new NextResponse(JSON.stringify({ success: false, message: "Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

