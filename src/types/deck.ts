export type Deck = {
    id: string,
    name: string,
    commander?: string,
    colors: string[],
    cards: {
        card: string,
        qty: number
    }[],
    userId: string,
}
