'use client'

import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default () => {
    const { data } = useSession()

    const [decks, setDecks] = useState<number | null>(null);

    async function getDecksHandler() {
        const res = await axios.get(`/api/v1/decks/user/${data!.user.id}`)

        setDecks(res.data.data.length)
    }

    async function logoutHandler() {
        signOut({ redirect: true, callbackUrl: "/" })
    }

    useEffect(() => {
        if (data != null) getDecksHandler();
    }, [data])

    return (
        <div className="mt-50 mb-10 flex flex-col align-middle gap-20">
            <h1 className="self-center font-extrabold text-3xl text-amber-500">PROFILE</h1>
            <div className="self-center w-[50%] flex flex-col gap-2">
                <label className="flex flex-row justify-between w-full border-amber-500 border-3 p-2">
                    <h1 className="font-extrabold text-2xl text-amber-500">Name: </h1>
                    <h1 className="font-extrabold text-2xl text-amber-500">{data?.user.username || "Loading"}</h1>
                </label>
                <label className="flex flex-row justify-between w-full border-amber-500 border-3 p-2">
                    <h1 className="font-extrabold text-2xl text-amber-500">decks: </h1>
                    <h1 className="font-extrabold text-2xl text-amber-500">{decks != null ? decks : "Loading"}</h1>
                </label>
            </div>

            <div className="flex flex-row w-[50%] justify-between align-middle self-center">
                <button
                    className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                    onClick={logoutHandler}
                >Logout</button>
                <Link
                    href="/profile/change-password"
                    className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                >Change Password</Link>
            </div>
        </div>
    )
}
