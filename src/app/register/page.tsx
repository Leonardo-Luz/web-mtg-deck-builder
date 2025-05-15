'use client'

import { registerUserHandler } from "@/context/auth";
import axios from "axios";
import { useRef } from "react";

export default () => {
    const name = useRef<HTMLInputElement>(null)
    const username = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const confirmPassword = useRef<HTMLInputElement>(null)

    async function registerHandler() {
        if (
            name.current && username.current && password.current && confirmPassword.current &&
            name.current.value.length > 0 &&
            username.current.value.length > 0 &&
            password.current.value.length > 0 &&
            confirmPassword.current.value.length > 0 &&
            password.current.value == confirmPassword.current.value
        ) {
            registerUserHandler({
                name: name.current.value,
                username: username.current.value,
                password: password.current.value
            })
        }
    }


    return (
        <div className="mt-50 mb-10 flex flex-col align-middle gap-10">
            <div className=" flex flex-col gap-8 self-center align-middle">
                <label className="flex flex-row align-middle justify-between gap-5">
                    Name:
                    <input
                        className="border-b-2 text-right"
                        type="text"
                        ref={name}
                    />
                </label>
                <label className="flex flex-row align-middle justify-between gap-5">
                    Username:
                    <input
                        className="border-b-2 text-right"
                        type="text"
                        ref={username}
                    />
                </label>
                <label className="flex flex-row align-middle justify-between gap-5">
                    Password:
                    <input
                        className="border-b-2 text-right"
                        type="password"
                        ref={password}
                    />
                </label>
                <label className="flex flex-row align-middle justify-between gap-5">
                    Confirm Password:
                    <input
                        className="border-b-2 text-right"
                        type="password"
                        ref={confirmPassword}
                    />
                </label>
            </div>

            <button
                className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                onClick={registerHandler}
            >Cadastrar</button>
        </div>
    );
}
