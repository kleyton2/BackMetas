import { db } from '../db'
import { users } from '../db/schema'

export async function getUsers() {
  const allUsers = await db.select().from(users)
  return allUsers
}
