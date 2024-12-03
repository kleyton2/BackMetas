import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

export async function updateUser(
  userId: string,
  updatedData: { name?: string; email?: string }
) {
  // Atualiza os dados do usuário
  await db.update(users).set(updatedData).where(eq(users.id, userId)) // Filtra pelo ID do usuário
}
