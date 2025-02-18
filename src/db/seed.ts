import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "./schema";
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

async function main() {
    try {
        console.log("Seed started...");

        await db.insert(schema.usersTable).values([
            {
                firstName: "Dasha",
                lastName: "Nikitina",
                email: "daria.a.nikitina@gmail.com"
            },

        ]);

        console.log("Seed finished...");
    } catch (error) {
        console.error(error);
        throw new Error("Seed error...");
    }
}
main();