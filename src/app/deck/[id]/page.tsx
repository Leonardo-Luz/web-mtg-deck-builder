'use client'

import { getById } from "@/services/cardsDAO";
import { Card, CardDeck } from "@/types/card"
import { Deck } from "@/types/deck";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
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
    commander?: boolean,
}

export default ({ params }: CardsProps) => {
    const { id } = use(params)

    const { data } = useSession()
    const [deck, setDeck] = useState<Deck>();
    const [cards, setCards] = useState<CardQty[]>([]);
    const [current, setCurrent] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    const getDeck = async () => {
        const response = await axios.get(`/api/v1/decks/${id}`)

        setDeck(response.data.data.deck)

        setPrice(0)
        const cardsData = await Promise.all(response.data.data.cards.map(async (card: CardDeck) => {
            const data = await getById(card.card)

            setPrice(prev => prev + (data.prices.usd ? parseFloat(data.prices.usd) * card.qty : 0))

            if (card.commander)
                setCurrent(response.data.data.cards.indexOf(card))

            return { card: data, qty: card.qty, commander: card.commander }
        }))

        setCards(cardsData)
    }

    useEffect(() => {
        getDeck()
    }, [])

    return deck ? (
        <div className="flex flex-col w-full self-center gap-6 mt-30 mb-10">
            <div className="flex flex-col gap-6">
                <div className="w-[50%] self-center flex flex-row justify-between gap-6">
                    <h1 className="text-start w-[80%] self-end font-extrabold text-2xl text-amber-500 truncate">{deck && deck.name}</h1>
                    {
                        data?.user.id == deck?.userId &&
                        <Link
                            href={`/builder/${deck?.id}`}
                            className="text-center w-[20%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-2 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                        >EDIT</Link>
                    }
                </div>
                <div className="w-[50%] self-center flex flex-row justify-between gap-6">
                    <h1 className="text-start w-[80%] self-end font-extrabold text-1xl text-amber-500 truncate">Colors: </h1>
                    {(deck.colors as string[]).map(color => {
                        return <Image
                            key={color}
                            src={"/" + color.toLowerCase() + ".png"}
                            alt={color}
                            height={30}
                            width={30}
                        />
                    })}
                </div>
                <div className="w-[50%] self-center flex flex-row justify-between gap-6">
                    <h1 className="text-start w-[80%] self-end font-extrabold text-1xl text-amber-500 truncate">Price: </h1>
                    <h1 className="text-end w-[20%] self-end font-extrabold text-1xl text-amber-500 truncate">{price.toFixed(2)} USD</h1>
                </div>
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
                            src={cards[current].card.image_uris ? cards[current].card.image_uris.png : "/mtg-card-back.webp"}
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
                        cards.filter(card => card.commander).map((card, index) => <div
                            onMouseOver={() => setCurrent(cards.indexOf(card))}
                            key={card.card.id}
                            className="flex flex-row border-2 hover:bg-amber-400 hover:text-black hover:font-bold"
                        >
                            <p onClick={() => { redirect(`/card/${card.card.id}`) }} className="p-2 w-[20%]">{index}</p>
                            <p onClick={() => { redirect(`/card/${card.card.id}`) }} className="p-2 w-[60%]">{card.card.name}</p>
                            <p onClick={() => { redirect(`/card/${card.card.id}`) }} className="text-end p-2 w-[20%]">{card.qty}</p>
                        </div>)
                    }
                    {
                        (deck) &&
                        <div className="border-2 border-amber-500 max-h-100 overflow-auto">
                            {
                                cards.length > 0 &&
                                cards.filter(card => !card.commander).map((card, index) => <div
                                    onMouseOver={() => setCurrent(cards.indexOf(card))}
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
    ) : <></>
}

