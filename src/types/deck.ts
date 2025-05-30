import { CardDeck } from "./card";

export type Deck = {
    id: string,
    name: string,
    commander?: string,
    colors: string[],
    cards: CardDeck[],
    userId: string,
}
