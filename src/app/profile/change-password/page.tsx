'use client'
import axios, { AxiosError } from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export default () => {
    const router = useRouter()
    const oldPass = useRef<HTMLInputElement>(null)
    const newPass = useRef<HTMLInputElement>(null)
    const confirmPass = useRef<HTMLInputElement>(null)

    async function changeHandler() {
        if (
            !oldPass.current ||
            !newPass.current ||
            !confirmPass.current ||
            oldPass.current.value.length <= 3 ||
            newPass.current.value.length <= 3 ||
            confirmPass.current.value.length <= 3
        ) {
            alert("Invalid password")
            return
        }

        if (
            newPass.current.value != confirmPass.current.value
        ) {
            alert("Passwords doesn't match")
            return
        }

        try {
            const res = await axios.put(`/api/v1/users/change-password`, {
                oldPassword: oldPass.current.value,
                newPassword: newPass.current.value,
            }, { withCredentials: true })

            if (res.status == 200)
                router.push('/profile')
        } catch (err) {
            if (err instanceof AxiosError) {
                const message = err.response?.data?.message || "Unknown error occurred";
                alert(`Failed to change password: ${message}`);
            } else alert(err);
        }
    }

    return (
        <form action={changeHandler} className="mt-50 mb-10 flex flex-col align-middle gap-20">
            <h1 className="self-center font-extrabold text-4xl text-amber-500">CHANGE PASSWORD</h1>
            <div className="self-center w-[50%] flex flex-col gap-2">
                <label className="flex flex-row justify-between w-full border-amber-500 border-3 p-2">
                    <h1 className="font-extrabold text-2xl text-amber-500">Old Password: </h1>
                    <input type="text" ref={oldPass} className="font-extrabold text-2xl text-amber-500 text-right" />
                </label>
                <label className="flex flex-row justify-between w-full border-amber-500 border-3 p-2">
                    <h1 className="font-extrabold text-2xl text-amber-500">New Password: </h1>
                    <input type="text" ref={newPass} className="font-extrabold text-2xl text-amber-500 text-right" />
                </label>
                <label className="flex flex-row justify-between w-full border-amber-500 border-3 p-2">
                    <h1 className="font-extrabold text-2xl text-amber-500">Confirm Password: </h1>
                    <input type="text" ref={confirmPass} className="font-extrabold text-2xl text-amber-500 text-right" />
                </label>
            </div>

            <div className="flex flex-row w-[50%] justify-between align-middle self-center">
                <Link
                    href="/profile"
                    className="w-[25%] text-center cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                >Cancel</Link>
                <button
                    type="submit"
                    className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                >Confirm</button>
            </div>
        </form>
    )
}
