import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

import { usersTable } from "@/models/user";
import database from "../../config/database";

export async function getUsers() {
    return await database
        .select()
        .from(usersTable)
}

export async function getUserById(id: string) {
    return await database
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
}

export async function insertUser(user: typeof usersTable.$inferInsert) {
    await database
        .insert(usersTable)
        .values(user)
}

export async function updateUser(id: string, user: typeof usersTable.$inferInsert) {
    await database
        .update(usersTable)
        .set({
            ...user,
            id: id
        })
        .where(eq(usersTable.id, id))
}

export async function deleteUser(id: string) {
    await database.delete(usersTable).where(eq(usersTable.id, id))
}


export async function registerUser(user: typeof usersTable.$inferInsert) {
    const existing = await database.select().from(usersTable).where(eq(usersTable.username, user.username));
    if (existing.length > 0) {
        throw new Error("Name already registered");
    }

    const hashed = await bcryptjs.hash(user.password, 10);
    await database.insert(usersTable).values({ ...user, password: hashed });
}

export async function loginUser(username: string, password: string) {
    const result = await database.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    const user = result[0];
    if (!user) throw new Error("Invalid credentials");

    const match = await bcryptjs.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    return user;
}

