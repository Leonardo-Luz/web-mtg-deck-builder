'use client'

import { ReactNode } from "react"

type CarouselProps = {
    children: ReactNode
}

export default ({ children }: CarouselProps) => {
    return (
        <div className="flex flex-row p-3 gap-5 align-middle overflow-y-hidden overflow-x-auto">
            {
                children
            }
        </div>
    )
}
