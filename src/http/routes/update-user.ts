import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateUser } from '../../functions/update-user'

// Definindo o tipo dos parâmetros da rota
interface UpdateUserParams {
  id: string // O id do usuário a ser atualizado
}

export const updateUserRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/admin/users/:id', // Rota para editar o usuário
    {
      schema: {
        params: z.object({
          id: z.string(), // Tipo do parâmetro 'id' que vem na URL
        }),
        body: z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
        }),
      },
    },
    async request => {
      // Usando a tipagem de params corretamente
      const { id } = request.params as UpdateUserParams // TypeScript agora sabe que 'params' tem o tipo correto
      const { name, email } = request.body
      await updateUser(id, { name, email })
      return { message: 'Usuário atualizado com sucesso' }
    }
  )
}
