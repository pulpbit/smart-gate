import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { hashPassword, verifyPassword } from '../utils/auth'

type Env = {
  Bindings: {
    DB: D1Database
    JWT_SECRET: string
  }
}

const authRouter = new Hono<Env>()

authRouter.post('/login', async (c) => {
  const { username, password } = await c.req.json()

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400)
  }

  const user = await c.env.DB.prepare(
    'SELECT id, username, password_hash, role, gate_name FROM users WHERE username = ?'
  ).bind(username).first()

  if (!user) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }

  const isValid = await verifyPassword(password, user.password_hash as string)
  if (!isValid) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }

  const token = await sign(
    { 
      userId: user.id, 
      username: user.username, 
      role: user.role === 'admin' ? 'Admin' : user.role === 'gate' ? 'Gate' : user.role,
      gateNumber: user.gate_name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 
    },
    c.env.JWT_SECRET
  )

  return c.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role === 'admin' ? 'Admin' : user.role === 'gate' ? 'Gate' : user.role,
      gateNumber: user.gate_name
    }
  })
})

export { authRouter }
