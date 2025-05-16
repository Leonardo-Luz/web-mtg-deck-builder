import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull(),
    username: varchar({ length: 100 }).unique().notNull(),
    password: varchar({ length: 200 }).notNull(),
});
