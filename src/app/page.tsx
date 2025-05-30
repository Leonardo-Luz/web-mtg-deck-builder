'use client'
import Carousel from "@/components/Carousel";
import { releases } from "@/services/cardsDAO";
import { CardList } from "@/types/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default () => {
    const [cards, setCards] = useState<CardList>();
    const [loading, setLoading] = useState<boolean>(true);

    const getLastReleasedCards = async () => {
        const releasedCards = await releases(50)

        setCards(releasedCards)
    }

    useEffect(() => {
        getLastReleasedCards()
    }, [])

    useEffect(() => {
        setLoading(false)
    }, [cards])

    return (
        <div className="mt-30 mb-10 flex flex-col align-middle justify-center">
            {
                loading ?
                    <p className="self-center text-amber-400 font-bold">Loading</p> :
                    cards ?
                        <div className="flex flex-col">
                            <h2 className="font-extrabold text-3xl text-amber-500 p-6">Last Releases:</h2>
                            <Carousel>
                                {
                                    cards.data.slice(0, 50).map((card) =>
                                        <Image
                                            key={card.id}
                                            onClick={() => redirect(`/card/${card.id}`)}
                                            width={300}
                                            height={300}
                                            alt={card.id}
                                            src={card.image_uris ? card.image_uris.png : "/public/globe.svg"}
                                        />
                                    )
                                }
                            </Carousel>
                        </div>
                        : <p className="self-center text-amber-400 font-bold">Server Error</p>
            }
        </div>
    );
}
