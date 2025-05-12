'use client'

import Image from "next/image"
import icon from "/public/globe.svg"

export default () => {
    return (
        <div className="w-full flex flex-row align-middle justify-between bg-amber-600 p-6 shadow-black shadow-md">
            <Image
                className="grayscale"
                src={icon}
                alt="Icon"
                width={60}
                height={60}
            />
            <div className="flex align-middle text-center">
                <p className="self-center text-lg text-[#171717]"><em className="font-bold">Leonardo Luz</em> Copyright &copy; 2025</p>
            </div>
        </div>
    )
}
