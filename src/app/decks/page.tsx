'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default () => {
    const { data } = useSession()
    const [decks, setDecks] = useState<any[]>();

    const getDecks = async () => {
        if (data) {
            const res = await axios.get(`/api/v1/decks/user/${data.user.id}`)

            setDecks(res.data.data)
        }
    }

    useEffect(() => {
        getDecks()
    }, [data])


    return (
        <div className="w-full mt-30 flex flex-col align-middle gap-10">
            <h1 className="self-center">Deck List</h1>
            <ul className="self-center">
                {
                    decks ?
                        decks.map((deck) => <li key={deck.id}>{deck.decks.name}</li>)
                        :
                        <li>loading</li>
                }
            </ul>
            <div className="self-center">
                <Link href='/builder' className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300">New Deck</Link>
            </div>
        </div>
    )
}
