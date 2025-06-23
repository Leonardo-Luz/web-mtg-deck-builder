'use client'

import FormButton from "@/components/FormButton";
import { search } from "@/services/cardsDAO";
import { Card } from "@/types/card";
import { Deck } from "@/types/deck";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type CardQty = {
    card: Card,
    qty: number,
    commander?: boolean
}

export default () => {
    const { data } = useSession()

    const [deckCards, SetDeckCards] = useState<CardQty[]>([]);
    const searchRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const timeoutId = useRef<NodeJS.Timeout>(null)
    const [cards, setCards] = useState<Card[]>()
    const [currentCard, setCurrentCard] = useState<number>(0)
    const [currentImg, setCurrentImg] = useState<string>("/mtg-card-back.webp")
    const [loading, setLoading] = useState(false)
    const [colors, setColors] = useState<string[]>([])

    const addDeckHandler = async () => {
        await axios.post('/api/v1/decks', {
            deck: {
                name: nameRef.current?.value,
                cards: deckCards.map(card => {
                    return {
                        card: card.card.id,
                        qty: card.qty,
                        commander: card.commander,
                    }
                }),
                userId: data?.user.id,
                colors: colors
            } as Deck
        })
        redirect('/deck')
    }

    const changeQty = (qty: number, id: string) => {
        SetDeckCards(prev => {
            const cards = prev.map((card) => card.card.id == id ? { ...card, qty: card.qty + qty } : card)
            return cards
        })
    }

    const setCommander = (id: string) => {
        SetDeckCards(prev => {
            const cards = prev.map((card) => card.card.id == id ? { ...card, commander: !card.commander } : { ...card, commander: false })
            return cards
        })
    }

    const removeCardHandler = (id: string) => {
        SetDeckCards(prev => {
            const cards = prev.filter(card => card.card.id != id)
            return cards
        })
    }

    const addCardHandler = (id?: number) => {
        if (cards) {
            const card = cards[id ? id : currentCard]
            if (deckCards.find(deckCard => deckCard.card == card)) {
                changeQty(1, card.id)
            }
            else {
                setColors(prev => {
                    const newColors = card.colors ? card.colors.filter(color => !prev.includes(color)) : []

                    return [...prev, ...newColors]
                })
                SetDeckCards(prev => [...prev, { card: card, qty: 1 }])
            }
            searchRef.current?.blur()
        }
    }

    const searchHandler = () => {
        setLoading(true)
        if (timeoutId.current)
            clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            if (searchRef.current)
                if (searchRef.current.value.length > 0)
                    search(searchRef.current.value).then(cards => {
                        setLoading(false)
                        if (cards)
                            setCards(cards.data.slice(0, 5))
                        setCurrentCard(0)
                    })
                else {
                    setLoading(false)
                    setCurrentCard(0)
                    setCards(undefined)
                }
            timeoutId.current = null
        }, 500)
    }

    const searchChange = (ev: KeyboardEvent<HTMLInputElement>) => {
        switch (ev.key) {
            case "Escape":
                searchRef.current?.blur()
                break;
            case "ArrowDown":
                if (cards)
                    setCurrentCard(prev => prev + 1 >= cards.length ? 0 : prev + 1)
                break;
            case "ArrowUp":
                if (cards)
                    setCurrentCard(prev => prev - 1 < 0 ? cards.length - 1 : prev - 1)
                break;
            case "Enter":
                addCardHandler()
                break;
        }
    }


    useEffect(() => {
        const inputEl = searchRef.current;
        if (!inputEl) return;

        const onFocusOut = () => {
            inputEl.value = '';
            setLoading(false);
            setCards(undefined);
            setCurrentCard(0);
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
                timeoutId.current = null;
            }
        };

        const onKeyDown = (ev: any) => {
            if (ev.key === '/') {
                ev.preventDefault();
                inputEl.focus();
            }
        };

        inputEl.addEventListener('focusout', onFocusOut);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            inputEl.removeEventListener('focusout', onFocusOut);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    useEffect(() => {
        if (cards)
            setCurrentImg(cards[currentCard].image_uris ? cards[currentCard].image_uris.png : "/mtg-card-back.webp")
    }, [currentCard])

    return (
        <form action={addDeckHandler} className="w-full mt-30 mb-12 flex flex-col gap-6 align-middle">
            <label className="self-center w-[80%] text-amber-400 flex flex-row justify-between border-b-2 border-amber-500">Deck Name: <input ref={nameRef} className="w-[60%] text-right" type="text" /></label>
            <div className="flex flex-col gap-2 self-center w-[80%] text-amber-400">
                <div className="flex flex-row justify-between border-amber-400 border-2 w-full">
                    <h1 className="p-2">Add Card</h1>
                    <div>
                        <div className="flex align-middle">
                            <input
                                ref={searchRef}
                                onChange={searchHandler}
                                onKeyDown={searchChange}
                                className="p-2 border-r-2 border-l-2 border-amber-400 w-100 text-amber-500 text-center font-extrabold inset-shadow-sm inset-shadow-[#000000] focus:text-white"
                                type="search"
                                placeholder="search for a card here..."
                            />
                            {
                                loading &&
                                <div className="flex flex-col gap-2 w-100 text-center fixed mt-12">
                                    <p className="bg-amber-600 rounded-md shadow-md shadow-black">Loading</p>
                                </div>
                            }
                            {
                                (cards) &&
                                <div className="flex flex-col gap-2 w-100 text-center fixed mt-12">
                                    {
                                        cards.map((card, index) => <button
                                            type="button"
                                            key={card.id}
                                            onClick={() => addCardHandler(index)}
                                            onMouseEnter={() => setCurrentImg(card.image_uris ? card.image_uris.png : "/mtg-card-back.webp")}
                                            className={`rounded-md shadow-md shadow-black
                                                ${currentCard == index ?
                                                    "bg-amber-400 text-[#171717]" :
                                                    "bg-amber-600 hover:bg-amber-400 hover:text-[#171717]"
                                                }
                                            `}
                                        >{card.name}</button>)
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div className="w-[20%] flex flex-row gap-2"></div>
                    <div><button type="button" className="p-2 font-extrabold" onClick={() => addCardHandler()}>+</button></div>
                </div>
                <div className="flex flex-row w-full gap-2">
                    <Image
                        className="self-start"
                        width={300}
                        height={300}
                        alt="Card Image"
                        src={currentImg}
                    />

                    {
                        deckCards.length > 0 &&
                        <div className="self-start border-2 border-amber-500 flex flex-col items-start w-[90%] align-top">
                            {
                                deckCards.map((card, index) =>
                                    <div
                                        onMouseEnter={() => setCurrentImg(card.card.image_uris ? card.card.image_uris.png : "/mtg-card-back.webp")}
                                        key={index} className="p-3 flex flex-row w-full justify-between"
                                    >
                                        <h1>{index}</h1>
                                        <h1 className="w-[30%]">{card.card.name}</h1>
                                        <div className="w-[30%]">{card.commander ? <button type="button">COMMANDER</button> : <button onClick={() => setCommander(card.card.id)}>Set as Commander</button>}</div>
                                        <div className="w-[10%] flex flex-row gap-8"><button type="button" onClick={() => changeQty(-1, card.card.id)}>-</button><p>{card.qty}</p><button type="button" onClick={() => changeQty(1, card.card.id)}>+</button></div>
                                        <div><button type="button" onClick={() => removeCardHandler(card.card.id)}>x</button></div>
                                    </div>)
                            }
                        </div>
                    }
                </div>
            </div>

            <FormButton defaultTxt="Create Deck" pendingTxt="Creating" />
        </form>
    );
}
