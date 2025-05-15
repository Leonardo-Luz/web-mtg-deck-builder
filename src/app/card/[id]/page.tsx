'use client'

import { getById } from "@/services/cardsDAO";
import { Card } from "@/types/card"
import axios from "axios";
import Image from "next/image";
import { use, useEffect, useState } from "react"

type Params = {
    id: string
}

type CardsProps = {
    params: Promise<Params>
}

export default ({ params }: CardsProps) => {
    const { id } = use(params)

    const [card, setCard] = useState<Card>();
    const [imgs, setImgs] = useState<Card[]>([]);
    const [sets, setSets] = useState<string[]>([]);
    const [currentImg, setCurrentImg] = useState<number>(0);

    const getImgs = async (cards: { data: { data: Card[] } }) => {
        setImgs(cards.data.data)
    }

    const fetchIconUris = async (urls: string[]): Promise<string[]> => {
        try {
            const responses = await Promise.all(urls.map(url => axios.get(url)));

            const iconUris = responses.map(res => res.data.icon_svg_uri);

            return iconUris;
        } catch (error) {
            console.error('Error fetching icons:', error);
            return [];
        }
    };

    useEffect(() => {
        getById(id).then(cardsData => {
            setImgs([])

            axios.get(cardsData.prints_search_uri).then((cards: { data: { data: Card[] } }) => {
                setCard(cardsData)
                getImgs(cards)
            })
        })
    }, [])

    useEffect(() => {
        const urls = imgs.map(img => img.set_uri)
        const loadIcons = async () => {
            const fetchedIcons = await fetchIconUris(urls);
            setSets(fetchedIcons);
        };

        loadIcons();
    }, [imgs])

    return (
        <div className="max-w-[70%] self-center mt-30 mb-10">
            {
                card ?
                    <div className="flex flex-row gap-12">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-4 p-2 overflow-x-auto overflow-y-hidden max-w-100">
                                {
                                    (imgs && sets.length > 0) &&
                                    imgs.map((url, index) => {
                                        return <Image
                                            className={`invert cursor-pointer ${index == currentImg && "scale-200"}`}
                                            src={sets[index] || "/public/globe.svg"}
                                            alt={url.id}
                                            width={20}
                                            height={20}
                                            key={index}
                                            onClick={() => setCurrentImg(index)}
                                        />
                                    }
                                    )
                                }
                            </div>
                            {
                                imgs &&
                                <Image
                                    className="self-center"
                                    src={imgs.length > 0 ?
                                        imgs[currentImg].image_uris ?
                                            imgs[currentImg].image_uris.png : "/public/globe.svg"
                                        : "/public/globe.svg"}
                                    alt={card.name}
                                    width={500}
                                    height={500}
                                />
                            }
                        </div>
                        <div className="flex flex-col gap-4 mt-12 max-w-[55%]">
                            <h1 className="font-bold text-2xl">{card.name} {card.mana_cost}</h1>
                            <div className="min-w-70 flex flex-row justify-between align-middle">
                                <p>{card.type_line}</p>
                                <p>{card.rarity}</p>
                            </div>
                            <hr />
                            {
                                card.oracle_text &&
                                card.oracle_text.split('\n').map((line, index) => <p key={index}>{line} <br /></p>)
                            }
                            {
                                card.type_line.match("Creature") &&
                                <p className="self-end">{card.power} / {card.toughness}</p>
                            }
                            {
                                card.type_line.match("Planeswalker") &&
                                <p className="self-end">{card.cmc}</p>
                            }
                            <hr />

                            <p>Found in: {card.games.toString()}</p>
                            <p>Set: {imgs[currentImg].set_name || "undefined"}</p>
                            <p>Price: {imgs[currentImg].prices.usd || "undefined"} USD</p>
                            <div className="max-h-40 flex flex-col gap-2 overflow-y-scroll">
                                <strong>Playable:</strong>
                                <hr />
                                {
                                    card.legalities &&
                                    Object.entries(card.legalities).map(([key, value]) => {
                                        return <div className="min-w-70 flex flex-row justify-between align-middle"
                                            key={key}>
                                            <p>{key}</p>
                                            <p>{value == "legal" ? "✓" : "✖"}</p>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <p className="self-center font-extrabold">LOADING</p>
            }
        </div >
    )
}
