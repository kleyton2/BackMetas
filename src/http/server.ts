import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { createCompletionRoute } from './routes/create-completion'
import { getPendingGoalRoutes } from './routes/get-pending-goals'
import { getWeekSummaryRoutes } from './routes/get-week-summary'
import { createUserRoute } from './routes/create-users'
import { getUsersRoute } from './routes/get-users'
import { updateUserRoute } from './routes/update-user'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Configuração de CORS
app.register(fastifyCors, {
  origin: '*',
})

// Configuração de validação e serialização
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registro das rotas relacionadas a metas
app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalRoutes)
app.register(getWeekSummaryRoutes)

// Registro das rotas relacionadas a usuários
app.register(createUserRoute) // Rota para criar um usuário
app.register(getUsersRoute) // Rota para listar todos os usuários
app.register(updateUserRoute) // Rota para atualizar um usuário

// Inicialização do servidor
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port 3333!')
  })
