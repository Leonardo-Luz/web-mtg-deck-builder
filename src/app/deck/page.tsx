'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default () => {
    const { data } = useSession()
    const [decks, setDecks] = useState<any[]>();
    const [filter, setFilter] = useState<"all" | "self">("self");
    const [search, setSearch] = useState<string>("");

    const getDecks = async () => {
        if (data) {
            const endpoint = "/api/v1/decks" + (filter == "self" ? "/user/" + data.user.id : "")
            const res = await axios.get(endpoint)

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

    useEffect(() => {
        getDecks()
    }, [filter])


    return (
        <div className="w-full mt-30 flex flex-col align-middle gap-10">
            <h1 className="self-center font-extrabold text-3xl text-amber-500">Deck List</h1>
            <div className="flex flex-col gap-3 self-center w-[80%] text-amber-400">
                <div className="self-center flex flex-row gap-4 items-center w-full justify-between">
                    <div>
                        <button
                            className={`cursor-pointer border-amber-400 border-2 p-2 ${filter == "self" && "bg-amber-400 text-black font-bold"}`}
                            onClick={() => setFilter("self")}
                        >My Decks</button>
                        <button
                            className={`cursor-pointer border-amber-400 border-2 p-2 ${filter == "all" && "bg-amber-400 text-black font-bold"}`}
                            onClick={() => setFilter("all")}
                        >All Decks</button>
                    </div>
                    <input
                        type="text"
                        onChange={(ev) => setSearch(ev.target.value)}
                        className="p-2 border-2 border-amber-400"
                        placeholder="search..."
                    />
                </div>
                <div className="flex flex-row w-full border-amber-400 border-2">
                    <div className="p-2 w-[10%]">ID</div>
                    <div className="p-2 w-[60%]">Deck Name</div>
                    <div className="p-2 w-[20%]">Colors</div>
                    <div className="p-2 text-end w-[10%]"></div>
                </div>
                {
                    (decks && decks.length > 0) &&
                    <div className="flex flex-col w-full border-2 border-amber-500">
                        {
                            decks.filter(deck => search.length == 0 || deck.name.includes(search)).map((deck, index) => <div key={deck.id} className="flex flex-row w-full hover:bg-amber-400 hover:text-black hover:font-bold">
                                <div onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[10%]">{index}</div>
                                <div onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[60%]">{deck.name}</div>
                                <div onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[20%]">{deck.colors}</div>
                                {/*confirmDelete ? "Confirm" : "Delete"*/}
                                {
                                    deck.userId == data?.user.id &&
                                    <div onClick={() => deleteDeck(deck.id)} className="p-2 text-end w-[10%]">Delete</div>
                                }
                            </div>)
                        }
                    </div>
                }
            </div>
            <div className="self-center">
                <Link href='/builder' className="w-[25%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300">New Deck</Link>
            </div>
        </div>
    )
}
