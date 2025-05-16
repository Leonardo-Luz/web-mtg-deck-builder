'use client'

import { search } from "@/services/cardsDAO";
import { Card } from "@/types/card";
import axios from "axios";
import { useSession } from "next-auth/react";
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
    const [loading, setLoading] = useState(false)

    const addDeckHandler = async () => {
        await axios.post('/api/v1/decks', {
            deck: {
                name: nameRef.current?.value,
                cards: deckCards.map(card => card.card.id), // qty
                commander: deckCards.find(card => card.commander) ? deckCards.find(card => card.commander) : null,
                userId: data?.user.id,
                colors: ["foda"]
            }
        })

        redirect('/decks')
    }

    const changeQty = (qty: number, id: string) => {
        SetDeckCards(prev => {
            const cards = prev.map((card) => card.card.id == id ? { ...card, qty: card.qty + qty } : card)
            return cards
        })
    }

    const setCommander = (id: string) => {
        SetDeckCards(prev => {
            const cards = prev.map((card) => card.card.id == id ? { ...card, commander: true } : { ...card, commander: false })
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
            searchRef.current?.blur()
            SetDeckCards(prev => [...prev, { card: cards[id ? id : currentCard], qty: 1 }])
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

    return (
        <div className="w-full mt-30 flex flex-col gap-6 align-middle">
            <label className="self-center w-[80%] text-amber-400 flex flex-row justify-between border-b-2 border-amber-500">Deck Name: <input ref={nameRef} className="w-[60%] text-right" type="text" /></label>
            <table className="self-center w-[80%] text-amber-400">
                <tr className="border-amber-400 border-2">
                    <th>Add Card</th>
                    <th>
                        <div className="flex align-middle">
                            <input
                                ref={searchRef}
                                onChange={searchHandler}
                                onKeyDown={searchChange}
                                className="w-100 text-amber-500 text-center font-extrabold inset-shadow-sm inset-shadow-[#000000] focus:text-white"
                                type="search"
                                placeholder="search..."
                            />
                            {
                                loading &&
                                <div className="flex flex-col gap-2 w-100 text-center fixed mt-8">
                                    <p className="bg-amber-600 rounded-md shadow-md shadow-black">Loading</p>
                                </div>
                            }
                            {
                                (cards) &&
                                <div className="flex flex-col gap-2 w-100 text-center fixed mt-8">
                                    {
                                        cards.map((card, index) => <button
                                            key={card.id}
                                            onClick={() => addCardHandler(index)}
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
                    </th>
                    <th className="w-[20%] flex flex-row gap-2"></th>
                    <th><button onClick={() => addCardHandler()}>+</button></th>
                </tr>
                {
                    deckCards.length > 0 &&
                    <tbody className="border-2 border-amber-500">
                        {
                            deckCards.map((card, index) => <tr className="p-3">
                                <td>{index}</td>
                                <td>{card.card.name}</td>
                                <td>{card.commander ? <button>COMMANDER</button> : <button onClick={() => setCommander(card.card.id)}>Set as Commander</button>}</td>
                                <td className="w-[20%] flex flex-row gap-8"><button onClick={() => changeQty(-1, card.card.id)}>-</button><p>{card.qty}</p><button onClick={() => changeQty(1, card.card.id)}>+</button></td>
                                <th><button onClick={() => removeCardHandler(card.card.id)}>x</button></th>
                            </tr>)
                        }
                    </tbody>
                }
            </table>

            <button
                className="w-[20%] cursor-pointer self-center rounded-md bg-amber-600 text-black font-extrabold p-2 inset-shadow-sm inset-shadow-[#000000] hover:bg-amber-300"
                onClick={addDeckHandler}
            >Create Deck</button>
        </div>
    );
}
