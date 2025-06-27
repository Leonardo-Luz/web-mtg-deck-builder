import { authOptions } from "@/utils/authOptions";
import { STATUS_CODES } from "http";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { deleteUser } from "../../repositories/user";

export const DELETE = async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const data = await getServerSession(authOptions);

    const { id } = await params

    if (!data)
        return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[401] }),
            { status: 401, headers: { 'Content-Type': 'application/json' } });

    if (data.user.id != id)
        return new NextResponse(JSON.stringify({ success: false, message: STATUS_CODES[403] }),
            { status: 403, headers: { 'Content-Type': 'application/json' } });

    try {
        await deleteUser(id)

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("err: ", err);

        return new NextResponse(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}


