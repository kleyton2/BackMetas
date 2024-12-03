import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

export async function createAdminUser() {
  const adminEmail = 'admin@admin.com'

  const adminExists = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
  if (adminExists.length === 0) {
    const adminPassword = await hash('senha-segura', 10)

    await db.insert(users).values({
      name: 'Administrador',
      email: adminEmail,
      password: adminPassword,
      role: 'admin', // Definir como administrador
      createdAt: new Date(),
    })

    console.log('Usuário administrador criado com sucesso!')
  } else {
    console.log('Usuário administrador já existe.')
  }
}

// Chamando a função para criar o administrador
createAdminUser().catch(err => console.error(err))
