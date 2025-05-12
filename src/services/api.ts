import axios from "axios";

export const service = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 3000
});
