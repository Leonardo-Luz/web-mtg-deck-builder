'use client'

import { useFormStatus } from "react-dom"

type formButtonProps = {
    pendingTxt: string
    defaultTxt: string
}

export default ({ pendingTxt, defaultTxt }: formButtonProps) => {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit" className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300">
            {
                pending ?
                    pendingTxt :
                    defaultTxt
            }
        </button>
    )
}

