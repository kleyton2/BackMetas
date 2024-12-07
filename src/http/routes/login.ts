import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Definindo o esquema de validação com zod
const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // Exemplo de validação para senha
})

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post('/login', async (req, reply) => {
    // Validando o corpo da requisição
    const { email, password } = loginRequestSchema.parse(req.body) // Aqui o Zod valida os dados

    // Verificar se o usuário existe no banco
    const user = await db.select().from(users).where(eq(users.email, email))

    if (!user || user.length === 0) {
      return reply.status(401).send({ message: 'Usuário não encontrado' })
    }

    // Verificar se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password)

    if (!isPasswordCorrect) {
      return reply.status(401).send({ message: 'Senha incorreta' })
    }

    // Gerar o token JWT
    const token = sign(
      {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
      },
      'your-secret-key'
    )

    return reply.send({ token })
  })
}
