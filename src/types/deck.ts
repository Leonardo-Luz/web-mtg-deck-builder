import { CardDeck } from "./card";

export type Deck = {
    id: string,
    name: string,
    colors: string[],
    cards: CardDeck[],
    userId: string,
}
