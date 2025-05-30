'use client'

import { getById } from "@/services/cardsDAO";
import { Card, CardDeck } from "@/types/card"
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

type CardQty = {
    card: Card,
    qty: number,
}

export default ({ params }: CardsProps) => {
    const { id } = use(params)

    const [deck, setDeck] = useState<Deck>();
    const [cards, setCards] = useState<CardQty[]>([]);
    const [current, setCurrent] = useState<number>(0);

    const getDeck = async () => {
        const response = await axios.get(`/api/v1/decks/${id}`)

        setDeck(response.data.data.deck)

        const cardsData = await Promise.all(response.data.data.cards.map(async (card: CardDeck) => {
            const data = await getById(card.card)

            return { card: data, qty: card.qty }
        }))

        setCards(cardsData)
    }

    useEffect(() => {
        getDeck()
    }, [])

    return (
        <div className="flex flex-col w-full self-center gap-8 mt-30 mb-10">
            <div className="w-[50%] self-center flex flex-row justify-between">
                <h1 className="text-center self-center font-extrabold text-2xl text-amber-500">Deck: {deck && deck.name}</h1>
                <button
                    className="w-[20%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-2 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                >EDIT</button>
            </div>
            <hr className="self-center w-[50%] border-2 border-amber-500" />
            <div className="self-center flex flex-row gap-8 align-top">
                <div
                    className="self-center"
                >
                    {
                        cards.length > 0 &&
                        <Image
                            key={cards[current].card.id}
                            onClick={() => redirect(`/card/${cards[current].card.id}`)}
                            width={300}
                            height={300}
                            alt={cards[current].card.id}
                            src={cards[current].card.image_uris ? cards[current].card.image_uris.png : "/public/globe.svg"}
                        />
                    }
                </div>
                <div className="flex flex-col gap-2 min-w-120 text-amber-400 self-start">
                    <div className="flex flex-row border-amber-400 border-2">
                        <p className="p-2 w-[20%]">ID</p>
                        <p className="p-2 w-[60%]">Card</p>
                        <p className="text-end p-2 w-[20%]">Qty</p>
                    </div>
                    {
                        (deck) &&
                        <div className="border-2 border-amber-500 max-h-100 overflow-auto">
                            {
                                cards.length > 0 &&
                                cards.map((card, index) => <div
                                    onMouseOver={() => setCurrent(index)}
                                    key={card.card.id}
                                    className="flex flex-row hover:bg-amber-400 hover:text-black hover:font-bold"
                                >
                                    <p onClick={() => { redirect(`/card/${card.card.id}`) }} className="p-2 w-[20%]">{index}</p>
                                    <p onClick={() => { redirect(`/card/${card.card.id}`) }} className="p-2 w-[60%]">{card.card.name}</p>
                                    <p onClick={() => { redirect(`/card/${card.card.id}`) }} className="text-end p-2 w-[20%]">{card.qty}</p>
                                </div>)
                            }
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

