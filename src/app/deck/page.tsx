'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
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

    const deleteDeck = async (deckId: string) => {
        await axios.delete(`/api/v1/decks/${deckId}`)

        setDecks(prev => prev?.filter((deck) => deck.id != deckId))
    }

    useEffect(() => {
        getDecks()
    }, [data])


    return (
        <div className="w-full mt-30 flex flex-col align-middle gap-10">
            <h1 className="self-center font-extrabold text-3xl text-amber-500">Deck List</h1>
            <table className="self-center w-[80%] text-amber-400">
                <tr className="border-amber-400 border-2">
                    <td className="p-2 w-[10%]">ID</td>
                    <td className="w-[60%]">Deck Name</td>
                    <td className="p-2 w-[20%]">Colors</td>
                    <td className="p-2 text-end w-[10%]"></td>
                </tr>
                {
                    (decks && decks.length > 0) &&
                    <tbody className="border-2 border-amber-500">
                        {
                            decks.map((deck, index) => <tr key={deck.id} className="hover:bg-amber-400 hover:text-black hover:font-bold">
                                <td onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[10%]">{index}</td>
                                <td onClick={() => { redirect(`/deck/${deck.id}`) }} className="w-[60%]">{deck.name}</td>
                                <td onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[20%]">{deck.colors}</td>
                                {/*confirmDelete ? "Confirm" : "Delete"*/}
                                <td onClick={() => deleteDeck(deck.id)} className="p-2 text-end w-[10%]">Delete</td>
                            </tr>)
                        }
                    </tbody>
                }
            </table>
            <div className="self-center">
                <Link href='/builder' className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300">New Deck</Link>
            </div>
        </div>
    )
}
