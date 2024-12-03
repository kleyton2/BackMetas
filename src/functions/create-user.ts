import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

interface CreateUserRequest {
  name: string
  email: string
  password: string
}

export async function createUser({ name, email, password }: CreateUserRequest) {
  // 1. Verificar se o e-mail já está registrado
  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1) // Limitar a 1 resultado

  if (userExists.length > 0) {
    throw new Error('E-mail já está em uso.')
  }

  // 2. Criptografar a senha
  const hashedPassword = await hash(password, 10)

  // 3. Inserir o novo usuário no banco de dados
  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Papel padrão é 'user'
      createdAt: new Date(),
    })
    .returning() // Retorna os dados do usuário criado

  console.log('Usuário registrado com sucesso!')
  return newUser[0] // Retornar o usuário registrado
}

// Exemplo de uso
const newUserData = {
  name: 'Novo Usuário',
  email: 'novo.usuario@email.com',
  password: 'senha-segura',
}

createUser(newUserData)
  .then(user => {
    console.log('Novo Usuário Criado:', user)
  })
  .catch(err => {
    console.error('Erro ao criar usuário:', err.message)
  })
