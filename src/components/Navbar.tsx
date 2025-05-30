'use client'

import Image from "next/image"
import Link from "next/link"
import icon from "/public/globe.svg"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { search } from "@/services/cardsDAO"
import { Card } from "@/types/card"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"

export default () => {
    const styles = {
        button: "rounded-md bg-[#171717] text-amber-500 font-extrabold p-3 inset-shadow-sm inset-shadow-[#000000] hover:text-white hover:bg-[#272727]",
        search: "w-100 rounded-3xl bg-[#171717] text-amber-500 text-center font-extrabold inset-shadow-sm inset-shadow-[#000000] focus:text-white focus:bg-[#272727]"
    }
    const searchObj = useRef<HTMLInputElement>(null)
    const timeoutId = useRef<NodeJS.Timeout>(null)
    const [cards, setCards] = useState<Card[]>()
    const [currentCard, setCurrentCard] = useState<number>(0)
    const [loading, setLoading] = useState(false)

    const { data: session, status } = useSession();

    const searchHandler = () => {
        setLoading(true)
        if (timeoutId.current)
            clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            if (searchObj.current)
                if (searchObj.current.value.length > 0)
                    search(searchObj.current.value).then(cards => {
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
                searchObj.current?.blur()
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
                if (cards) {
                    searchObj.current?.blur()
                    redirect(`/card/${cards[currentCard].id}`)
                }
                break;
        }
    }

    // useEffect(() => {
    //     alert(JSON.stringify(session))
    //     switch (status) {
    //         case "loading":
    //             break;
    //         case "authenticated":
    //             break;
    //         case "unauthenticated":
    //             break;
    //         default:
    //             alert(status)
    //     }
    // }, [status])


    useEffect(() => {
        const inputEl = searchObj.current;
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
        <div className="z-10 fixed w-full flex flex-row align-middle justify-between bg-amber-600 p-6 shadow-black shadow-md">
            <div className="w-[12%]">
                <Link href="/">
                    <Image
                        className="grayscale"
                        src={icon}
                        alt="Hamburger Menu"
                        width={60}
                        height={60}
                    />
                </Link>
            </div>
            <div className="flex align-middle">
                <input
                    ref={searchObj}
                    onChange={searchHandler}
                    onKeyDown={searchChange}
                    className={styles.search}
                    type="search"
                    placeholder="search..."
                />
                {
                    loading &&
                    <div className="flex flex-col gap-2 w-100 text-center fixed top-20">
                        <p className="bg-amber-600 rounded-md shadow-md shadow-black">Loading</p>
                    </div>
                }
                {
                    (cards) &&
                    <div className="flex flex-col gap-2 w-100 text-center fixed top-20">
                        {
                            cards.map((card, index) => <Link
                                href={`/card/${card.id}`}
                                className={`rounded-md shadow-md shadow-black
                                    ${currentCard == index ?
                                        "bg-amber-400 text-[#171717]" :
                                        "bg-amber-600 hover:bg-amber-400 hover:text-[#171717]"}`}
                                key={card.id}
                            >{card.name}</Link>)
                        }
                    </div>
                }
            </div>
            {
                status != "authenticated" ?
                    <div className="flex flex-row gap-4 align-middle">
                        <Link
                            className={styles.button}
                            href="/register"
                        >Register</Link>
                        <Link
                            className={styles.button}
                            href="/login"
                        >Login</Link>
                    </div> :

                    <div className="flex flex-row gap-4 align-middle">
                        <Link
                            className={styles.button}
                            href="/deck"
                        >Decks</Link>
                        <Link
                            className={styles.button}
                            href="/profile"
                        >Profile</Link>
                    </div>
            }
        </div>
    )
}
