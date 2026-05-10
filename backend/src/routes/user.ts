import { Hono } from 'hono'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { hashPassword } from '../utils/auth'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const userRouter = new Hono<Env>()

userRouter.use('*', authMiddleware())
userRouter.use('*', adminMiddleware())

userRouter.get('/', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT id, username, role, gate_number, created_at FROM users ORDER BY created_at DESC
  `).all()
  return c.json(results.results)
})

userRouter.post('/', async (c) => {
  const { username, password, role, gateNumber } = await c.req.json()

  if (!username || !password || !role) {
    return c.json({ error: 'Username, password, and role are required' }, 400)
  }

  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE username = ?'
  ).bind(username).first()

  if (existingUser) {
    return c.json({ error: 'Username already exists' }, 400)
  }

  const passwordHash = await hashPassword(password)
  
  const result = await c.env.DB.prepare(`
    INSERT INTO users (username, password_hash, role, gate_number)
    VALUES (?, ?, ?, ?)
  `).bind(username, passwordHash, role, gateNumber || null).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

userRouter.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { password, role, gateNumber } = await c.req.json()

  let query = 'UPDATE users SET '
  const binds: (string | number | null)[] = []
  const updates: string[] = []

  if (password) {
    const passwordHash = await hashPassword(password)
    updates.push('password_hash = ?')
    binds.push(passwordHash)
  }

  if (role) {
    updates.push('role = ?')
    binds.push(role)
  }

  if (gateNumber !== undefined) {
    updates.push('gate_number = ?')
    binds.push(gateNumber || null)
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields to update' }, 400)
  }

  query += updates.join(', ') + ' WHERE id = ?'
  binds.push(id)

  const result = await c.env.DB.prepare(query).bind(...binds).run()

  return c.json({ success: result.meta.changes > 0 })
})

userRouter.delete('/:id', async (c) => {
  const id = c.req.param('id')
  
  const result = await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()

  return c.json({ success: result.meta.changes > 0 })
})

export { userRouter }
