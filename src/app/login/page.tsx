'use client'

import FormButton from "@/components/FormButton";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
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

            const res = await signIn("credentials", {
                username,
                password,
                redirect: false
            });

            if (res?.ok) {
                redirect('/')
            } else {
                alert("Login failed");
            }
        }
    }

    return (
        <form action={loginHandler} className="mt-50 mb-10 flex flex-col align-middle gap-10">
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

            <FormButton defaultTxt="Login" pendingTxt="Verifying" />
        </form>
    );
}
