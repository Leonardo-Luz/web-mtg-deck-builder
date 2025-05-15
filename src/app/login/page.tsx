'use client'

import { loginUserHandler } from "@/context/auth";
import axios from "axios";
import { useRef } from "react";

export default () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    async function loginHandler() {
        if (
            usernameRef.current && passwordRef.current &&
            usernameRef.current.value.length > 0 &&
            passwordRef.current.value.length > 0
        ) {
            const username = usernameRef.current.value
            const password = passwordRef.current.value

            loginUserHandler(
                username,
                password
            );
        }
    }


    return (
        <div className="mt-50 mb-10 flex flex-col align-middle gap-10">
            <div className=" flex flex-col gap-8 self-center align-middle">
                <label className="flex flex-row align-middle justify-between gap-5">
                    Username:
                    <input
                        className="border-b-2 text-right"
                        type="text"
                        ref={usernameRef}
                    />
                </label>
                <label className="flex flex-row align-middle justify-between gap-5">
                    Password:
                    <input
                        className="border-b-2 text-right"
                        type="password"
                        ref={passwordRef}
                    />
                </label>
            </div>

            <button
                className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                onClick={loginHandler}
            >Login</button>
        </div>
    );
}
