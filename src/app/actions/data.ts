
'use server'

import { db } from "src/db/db";
import { criteriaTable, InsertCriteria, usersTable } from "src/db/schema";

export async function getUsers() {
    try {
        const users = await db.select().from(usersTable);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}

export async function submitCriteria(data: Omit<InsertCriteria, 'id'>) {
    try {
        const result = await db.insert(criteriaTable)
            .values(data)
            .returning();
        return result[0];
    } catch (error) {
        console.error('Error submitting criteria:', error);
        throw new Error('Failed to submit criteria');
    }
}

export async function getCriteria() {
    try {
        const criteria = await db.select().from(criteriaTable);
        return criteria;
    } catch (error) {
        console.error('Error fetching criteria:', error);
        throw new Error('Failed to fetch criteria');
    }
}