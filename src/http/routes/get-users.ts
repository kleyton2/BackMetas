import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUsers } from '../../functions/get-users'
import type { FastifyRequest, FastifyReply } from 'fastify'

// Defina o tipo do payload JWT
interface JwtPayload {
  id: string
  role: 'admin' | 'user'
}

export const getUsersRoute: FastifyPluginAsyncZod = async app => {
  // Rota para obter todos os usuários - Para usuários comuns
  app.get('/users', async (req, reply) => {
    const users = await getUsers()
    return { users }
  })

  // Rota para obter todos os usuários - Acessível apenas para administradores (com JWT)
  app.get(
    '/users/admin',
    {
      preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
        try {
          // Verificar se o token JWT está presente e válido
          const user = await req.jwtVerify<JwtPayload>() // Tipagem do payload JWT

          // Verificar se o usuário é um administrador
          if (user.role !== 'admin') {
            return reply
              .status(403)
              .send({ message: 'Acesso restrito a administradores' })
          }
        } catch (error) {
          return reply
            .status(401)
            .send({ message: 'Token inválido ou expirado' })
        }
      },
    },
    async (req, reply) => {
      try {
        const users = await getUsers()
        return { users }
      } catch (error) {
        console.error('Erro ao carregar os usuários', error)
        return reply
          .status(500)
          .send({ message: 'Erro ao carregar os usuários' })
      }
    }
  )

  // Rota para obter um usuário pelo ID
  app.get<{ Params: { id: string } }>('/users/:id', async (req, reply) => {
    const userId = req.params.id
    console.log('ID recebido:', userId)

    try {
      const users = await getUsers()
      const user = users.find(user => user.id === userId)

      if (user) {
        console.log('Usuário encontrado:', user)
        return reply.status(200).send(user)
      }

      console.error('Usuário não encontrado para o ID:', userId)
      return reply.status(404).send({ message: 'Usuário não encontrado' })
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}
