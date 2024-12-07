import fastify from 'fastify'
import fastifyJwt from 'fastify-jwt'
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
import { loginRoute } from './routes/login' // Adicionado
import fastifyCors from '@fastify/cors'
import { createAdminUser } from '../functions/admin-user'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Registrar o plugin fastify-jwt
app.register(fastifyJwt, {
  secret: 'your-secret-key', // Coloque um segredo para assinar o JWT
})

// Configuração de CORS
app.register(fastifyCors, {
  origin: '*',
})

// Configuração de validação e serialização
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registrar rotas relacionadas a metas
app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalRoutes)
app.register(getWeekSummaryRoutes)

// Registrar rotas relacionadas a usuários
app.register(createUserRoute) // Rota para criar um usuário
app.register(getUsersRoute) // Rota para listar todos os usuários
app.register(updateUserRoute) // Rota para atualizar um usuário

// Registrar a rota de login
app.register(loginRoute)

// Função para inicializar o servidor
async function startServer() {
  try {
    // Criar o administrador caso não exista
    await createAdminUser()

    // Iniciar o servidor
    await app.listen({ port: 3333 })
    console.log('HTTP server running on port 3333!')
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error)
    process.exit(1)
  }
}

// Chamar a função para iniciar o servidor
startServer()
