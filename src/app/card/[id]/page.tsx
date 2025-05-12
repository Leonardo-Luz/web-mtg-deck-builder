'use client'

import { getById } from "@/services/cardsDAO";
import { Card, CardList } from "@/types/card"
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
        <div className="mt-30 mb-10">
            {
                card ?
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-col gap-2 p-3 overflow-auto max-h-100">
                            {
                                (imgs && sets.length > 0) &&
                                imgs.map((url, index) => {
                                    return <Image
                                        className="invert z-0"
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
                                src={imgs.length > 0 ? imgs[currentImg].image_uris.png : "placeholder"}
                                alt={card.name}
                                width={500}
                                height={500}
                            />
                        }
                    </div>
                    :
                    <p className="self-center font-extrabold">LOADING</p>
            }
        </div>
    )
}
