import { Card, CardList } from "@/types/card";
import { service } from "./api"

export const search = async (query: string): Promise<CardList | undefined> => {
    try {
        const response = await service.get(`/cards/search?q=${query}&order=released`);

        return response.data
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export const releases = async (): Promise<CardList | undefined> => {
    try {
        const response = await service.get(`/cards/search?order=released&q=.`);

        return response.data
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export const random = async (): Promise<Card> => {
    const response = await service.get(`/cards/random`);

    return response.data
}

export const getById = async (id: string): Promise<Card> => {
    const response = await service.get(`/cards/${id}`);

    return response.data
}
