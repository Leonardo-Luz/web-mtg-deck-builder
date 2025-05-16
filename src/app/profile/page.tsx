'use client'

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default () => {
    const { data } = useSession()

    async function logoutHandler() {
        await signOut()
        redirect('/login')
    }

    return (
        <div className="mt-50 mb-10 flex flex-col align-middle gap-20">
            <div className="self-center">
                <h1 className="font-extrabold text-3xl text-amber-500">{data?.user.username}</h1>
            </div>

            <button
                className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                onClick={logoutHandler}
            >Logout</button>
        </div>
    );
}
