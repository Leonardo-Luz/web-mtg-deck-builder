import { usersTable } from "@/models/user";
import axios from "axios";
import { redirect } from "next/navigation";

export let id = null

export async function loginUserHandler(username: string, password: string) {
    const response = await axios.post("/api/v1/users/login", {
        username,
        password
    });

    alert(JSON.stringify(response.data))
    id = response.data.id

    redirect('/')
}

export async function registerUserHandler(user: typeof usersTable.$inferInsert) {
    const response = await axios.post("/api/v1/users/register", {
        name: user.name,
        username: user.username,
        password: user.password,
    })

    alert(JSON.stringify(response.data))
    id = response.data.id

    redirect('/')
}
