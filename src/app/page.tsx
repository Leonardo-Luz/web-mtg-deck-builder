'use client'
import { random } from "@/services/cardsDAO";
import { Card } from "@/types/card";
import Image from "next/image";
import { useEffect, useState } from "react";

export default () => {
    const [card, setCard] = useState<Card>();

    useEffect(() => {
        random().then((rndCard) => {
            setCard(rndCard)
        })
    }, [])

    return (
        <div className="mt-30 mb-10 flex flex-col align-middle justify-center">
            {
                card &&
                <Image
                    className="self-center"
                    src={card.image_uris.png || "placeholder"}
                    alt={card.name}
                    width={500}
                    height={500}
                />
            }
        </div>
    );
}
