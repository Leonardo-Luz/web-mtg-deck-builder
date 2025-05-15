'use client'
import Carousel from "@/components/Carousel";
import { releases } from "@/services/cardsDAO";
import { CardList } from "@/types/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default () => {
    const [cards, setCards] = useState<CardList>();

    useEffect(() => {
        releases().then((rndCard) => {
            setCards(rndCard)
        })
    }, [])

    return (
        <div className="mt-30 mb-10 flex flex-col align-middle justify-center">
            {
                cards &&
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
            }
        </div>
    );
}
