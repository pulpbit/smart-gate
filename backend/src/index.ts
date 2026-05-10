import { Hono } from 'hono'
import { authRouter } from './routes/auth'
import { materialRouter } from './routes/material'
import { vendorRouter } from './routes/vendor'
import { vehicleRouter } from './routes/vehicle'
import { userRouter } from './routes/user'
import { masterRouter } from './routes/master'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

type Env = {
  Bindings: {
    DB: D1Database
    JWT_SECRET: string
  }
}

const app = new Hono<Env>()

app.use('*', logger())
app.use('*', cors())

app.onError((err, c) => {
  console.error('Global error:', err)
  return c.json({ error: 'Internal Server Error: ' + err.message }, 500)
})

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

app.route('/api/auth', authRouter)
app.route('/api/material', materialRouter)
app.route('/api/vendor', vendorRouter)
app.route('/api/vehicle', vehicleRouter)
app.route('/api/users', userRouter)
app.route('/api/master', masterRouter)

export default app
