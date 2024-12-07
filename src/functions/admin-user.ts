import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

export async function createAdminUser() {
  const adminEmail = 'admin@admin.com'
  const adminPasswordRaw = 'Administrador22@'

  try {
    // Verifica se o administrador já existe
    const adminExists = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))

    if (adminExists.length === 0) {
      const adminPassword = await hash(adminPasswordRaw, 10)

      // Insere o administrador no banco
      await db.insert(users).values({
        name: 'Administrador',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
      })

      console.log(
        'Usuário administrador criado com sucesso em',
        new Date().toISOString()
      )
    } else {
      console.log(
        'Usuário administrador já existe. Nenhuma ação foi realizada.'
      )
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Erro ao criar usuário administrador:', err.message)
    } else {
      console.error('Erro desconhecido ao criar usuário administrador')
    }
  }
}

// Exporta a função sem executá-la diretamente
// createAdminUser().catch(err => console.error(err))
