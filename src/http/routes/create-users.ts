import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createUser } from '../../functions/create-user'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users', // Rota para criação de usuários
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async request => {
      const { name, email, password } = request.body
      await createUser({ name, email, password })
      return { message: 'Usuário criado com sucesso' }
    }
  )
}
