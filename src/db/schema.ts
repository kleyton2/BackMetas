import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const goalsCompletions = pgTable('goals_completions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  goalId: text('goal_id')
    .references(() => goals.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()), // Gerar ID único
  name: text('name').notNull(), // Nome do usuário
  email: text('email').notNull().unique(), // E-mail único
  password: text('password').notNull(), // Senha (criptografada)
  role: text('role').notNull().default('user'), // 'user' ou 'admin'
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(), // Data de criação
})
