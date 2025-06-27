'use client'
import Carousel from "@/components/Carousel";
import { getById, releases } from "@/services/cardsDAO";
import { CardList } from "@/types/card";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default () => {
    const [cards, setCards] = useState<CardList>();
    const [decks, setDecks] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    const getLastReleasedCards = async () => {
        const releasedCards = await releases()

        setCards(releasedCards)
    }

    const getDecksHandler = async () => {
        const res = await axios.get(`/api/v1/decks/commander`)

        const data = await Promise.all(res.data.data.map(async (deck: any) => {
            return {
                ...deck,
                commander: deck.cards ? await getById(deck.cards.card) : undefined
            }
        }))

        setDecks(data)
    }

    const start = async () => {
        await getDecksHandler()
        await getLastReleasedCards()
        setLoading(false)
    }

    useEffect(() => {
        start()
    }, [])

    return (
        <div className="mt-30 mb-10 flex flex-col align-middle justify-center">
            {
                loading ?
                    <p className="self-center text-amber-400 font-bold">Loading</p> :
                    <>
                        {
                            cards ?
                                <div className="flex flex-col">
                                    <h2 className="font-extrabold text-3xl text-amber-500 p-6">Last Releases:</h2>
                                    <Carousel>
                                        {
                                            cards.data.slice(0, 50).map((card) =>
                                                <Image
                                                    className="cursor-pointer"
                                                    key={card.id}
                                                    onClick={() => redirect(`/card/${card.id}`)}
                                                    width={300}
                                                    height={300}
                                                    alt={card.id}
                                                    src={card.image_uris ? card.image_uris.png : "/mtg-card-back.webp"}
                                                />
                                            )
                                        }
                                    </Carousel>
                                </div>
                                : <p className="self-center text-amber-400 font-bold">Server Error</p>
                        }
                        {
                            decks ?
                                <div className="flex flex-col">
                                    <h2 className="font-extrabold text-3xl text-amber-500 p-6">Last Decks:</h2>
                                    <Carousel>
                                        {
                                            decks.slice(0, 50).map((deck: any) =>
                                                <div
                                                    key={deck.decks.id}
                                                    className="flex flex-col gap-1 min-w-[300px]"
                                                >
                                                    <Image
                                                        className="cursor-pointer"
                                                        onClick={() => redirect(`/deck/${deck.decks.id}`)}
                                                        width={300}
                                                        height={300}
                                                        alt={deck.decks.id}
                                                        src={deck.commander ? deck.commander.image_uris ? deck.commander.image_uris.png : "/mtg-card-back.webp" : "/mtg-card-back.webp"}
                                                    />
                                                    <p className="text-amber-400 font-bold truncate">{deck.decks.name}</p>
                                                </div>
                                            )
                                        }
                                    </Carousel>
                                </div>
                                : <p className="self-center text-amber-400 font-bold">Server Error</p>
                        }
                    </>
            }
        </div>
    );
}
