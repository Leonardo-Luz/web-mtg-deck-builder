'use client'

import { getById } from "@/services/cardsDAO";
import { Card } from "@/types/card"
import { Deck } from "@/types/deck";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react"

type Params = {
    id: string
}

type CardsProps = {
    params: Promise<Params>
}

export default ({ params }: CardsProps) => {
    const { id } = use(params)

    const [deck, setDeck] = useState<Deck>();
    const [cards, setCards] = useState<Card[]>([]);
    const [current, setCurrent] = useState<number>(0);

    const getDeck = async () => {
        const response = await axios.get(`/api/v1/decks/${id}`)

        setDeck(response.data.data[0])
    }

    const getCards = async () => {
        if (deck)
            deck.cards.forEach(async card => {
                const data = await getById(card)

                setCards(prev => [...prev, data])
            })
    }

    useEffect(() => {
        if (!deck)
            getDeck()
    }, [])

    useEffect(() => {
        if (cards.length == 0 && deck && deck.cards.length > 0)
            getCards()
    }, [deck])

    return (
        <div className="flex flex-col w-full self-center gap-12 mt-30 mb-10">
            <h1 className="text-center self-center font-extrabold text-3xl text-amber-500">Deck List</h1>
            <div className="self-center flex flex-row gap-8 align-top">
                {
                    cards.length > 0 &&
                    <Image
                        key={cards[current].id}
                        onClick={() => redirect(`/card/${cards[current].id}`)}
                        width={300}
                        height={300}
                        alt={cards[current].id}
                        src={cards[current].image_uris ? cards[current].image_uris.png : "/public/globe.svg"}
                    />
                }
                <table className="min-w-120 text-amber-400 self-start">
                    <tr className="border-amber-400 border-2">
                        <td className="p-2 w-[20%]">ID</td>
                        <td className="w-[60%]">Card</td>
                        <td className="text-end p-2 w-[20%]">Qty</td>
                    </tr>
                    {
                        (deck) &&
                        <tbody className="border-2 border-amber-500">
                            {
                                cards.length > 0 &&
                                cards.map((card, index) => <tr
                                    onMouseOver={() => setCurrent(index)}
                                    key={card.id}
                                    className="hover:bg-amber-400 hover:text-black hover:font-bold"
                                >
                                    <td onClick={() => { redirect(`/card/${card.id}`) }} className="p-2 w-[20%]">{index}</td>
                                    <td onClick={() => { redirect(`/card/${card.id}`) }} className="w-[60%]">{card.name}</td>
                                    <td onClick={() => { redirect(`/card/${card.id}`) }} className="text-end p-2 w-[20%]">qty</td>
                                </tr>)
                            }
                        </tbody>
                    }
                </table>
            </div>
        </div >
    )
}

