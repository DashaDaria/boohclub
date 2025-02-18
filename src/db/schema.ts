import { pgTable, serial, text } from 'drizzle-orm/pg-core';
export const usersTable = pgTable('users_table', {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull().unique(),
});

export const criteriaTable = pgTable('criteria_table', {
    id: serial('id').primaryKey(),
    category: text('category').notNull().unique(),
    nuance: text('nuance').unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertCriteria = typeof criteriaTable.$inferInsert;
export type SelectCriteria = typeof criteriaTable.$inferSelect;
