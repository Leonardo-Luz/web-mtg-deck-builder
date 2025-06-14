import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const url = req.nextUrl.clone();

        const token = req.nextauth.token

        if (!token) {
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        const now = Math.floor(Date.now() / 1000);

        console.log(now)
        console.log(token)

        if (token.exp && token.exp < now) {
            const url = req.nextUrl.clone();
            url.pathname = "/api/auth/signout";
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true,
        },
    }
);

export const config = {
    matcher: ["/profile", "/profile/change-password", "/deck", "/deck/:path*"],
};

