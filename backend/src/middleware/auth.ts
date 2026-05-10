import { jwt } from 'hono/jwt'
import { Context, Next } from 'hono'

type Env = {
  Bindings: {
    JWT_SECRET: string
  }
}

function authMiddleware() {
  return async (c: Context<Env>, next: Next) => {
    const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET })
    await jwtMiddleware(c, next)
  }
}

function adminMiddleware() {
  return async (c: Context<Env>, next: Next) => {
    const payload = c.get('jwtPayload')
    if (payload.role !== 'Admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }
    await next()
  }
}

export { authMiddleware, adminMiddleware }
