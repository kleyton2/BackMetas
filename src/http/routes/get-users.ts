import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUsers } from '../../functions/get-users'

export const getUsersRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/admin/users', // Rota para o admin listar todos os usuários
    async () => {
      const users = await getUsers() // Função que retorna todos os usuários
      return { users }
    }
  )
}
