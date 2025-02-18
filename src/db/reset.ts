import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function reset() {
    try {
        console.log('Dropping tables...');

        // Drop each table individually
        await db.execute(`DROP TABLE IF EXISTS users CASCADE;`);
        console.log('Dropped users table');

        await db.execute(`DROP TABLE IF EXISTS _drizzle_migrations CASCADE;`);
        console.log('Dropped _drizzle_migrations table');

        console.log('All tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
        throw error;
    }
}

reset().catch((err) => {
    console.error(err);
    process.exit(1);
});