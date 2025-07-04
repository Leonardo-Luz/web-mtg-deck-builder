'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default () => {
    const { data } = useSession()
    const [decks, setDecks] = useState<any[] | null>();
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

    const filterHandler = (value: "self" | "all") => {
        if (filter == value)
            return;

        setDecks(null);

        setFilter(value);
    }

    useEffect(() => {
        getDecks()
    }, [data])

    useEffect(() => {
        getDecks()
    }, [filter])


    return (
        <div className="w-full mt-30 mb-10 flex flex-col align-middle gap-6">
            <h1 className="self-center font-extrabold text-3xl text-amber-500">Deck List</h1>
            <div className="flex flex-col gap-3 self-center w-[80%] text-amber-400">
                <div className="self-center flex flex-row gap-4 items-center w-full justify-between">
                    <div>
                        <button
                            className={`cursor-pointer border-amber-400 border-2 p-2 ${filter == "self" && "bg-amber-400 text-black font-bold"}`}
                            onClick={() => filterHandler("self")}
                        >My Decks</button>
                        <button
                            className={`cursor-pointer border-amber-400 border-2 p-2 ${filter == "all" && "bg-amber-400 text-black font-bold"}`}
                            onClick={() => filterHandler("all")}
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
                    <div className="font-bold p-2 w-[10%]">ID</div>
                    <div className="font-bold p-2 w-[60%]">Deck Name</div>
                    <div className="font-bold p-2 w-[20%]">Colors</div>
                    <div className="font-bold p-2 text-end w-[10%]"></div>
                </div>
                {
                    (decks) ?
                        (decks.length > 0) &&
                        <div className="flex flex-col w-full border-2 border-amber-500">
                            {
                                decks.filter(deck => search.length == 0 || deck.name.includes(search)).map((deck, index) => <div key={deck.id} className="flex flex-row w-full hover:bg-black cursor-pointer hover:font-bold">
                                    <h1 onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[10%]">{index}</h1>
                                    <h1 onClick={() => { redirect(`/deck/${deck.id}`) }} className="p-2 w-[60%] truncate">{deck.name}</h1>
                                    <div
                                        onClick={() => { redirect(`/deck/${deck.id}`) }}
                                        className="p-2 w-[20%] flex flex-wrap gap-2"
                                    >
                                        {(deck.colors as string[]).map(color => {
                                            return <Image
                                                key={color}
                                                src={"/" + color.toLowerCase() + ".png"}
                                                alt={color}
                                                height={30}
                                                width={30}
                                            />
                                        })}</div>
                                    {
                                        deck.userId == data?.user.id &&
                                        <div onClick={() => deleteDeck(deck.id)} className="p-2 text-end w-[10%]">Delete</div>
                                    }
                                </div>)
                            }
                        </div>
                        :
                        <div className="flex flex-col w-full border-2 border-amber-500">
                            <div className="flex flex-row w-full hover:bg-amber-400 hover:text-black hover:font-bold">
                                <h1 className="p-2 w-full">LOADING</h1>
                            </div>
                        </div>
                }
            </div>
            <div className="self-center w-[80%] flex flex-row justify-between">
                <Link
                    href='/builder'
                    className="text-amber-400 cursor-pointer p-2 border-amber-400 border-2 hover:bg-amber-400 hover:text-black hover:font-bold"
                >New Deck</Link>
                <div className="self-center flex flex-row gap-3">
                    <input
                        type="file"
                        className="text-amber-400 cursor-pointer p-2 border-amber-400 border-2 hover:bg-amber-400 hover:text-black hover:font-bold"
                    />
                    <button
                        type="button"
                        className="text-amber-400 cursor-pointer p-2 border-amber-400 border-2 hover:bg-amber-400 hover:text-black hover:font-bold"
                    >Import Deck</button>
                </div>
            </div>
        </div>
    )
}
