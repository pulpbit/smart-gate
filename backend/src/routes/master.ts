import { Hono } from 'hono'
import { authMiddleware, adminMiddleware } from '../middleware/auth'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const masterRouter = new Hono<Env>()

masterRouter.use('*', authMiddleware())

masterRouter.get('/customers', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT * FROM customers WHERE is_active = 1 ORDER BY name ASC
  `).all()
  return c.json(results.results)
})

masterRouter.post('/customers', adminMiddleware(), async (c) => {
  const body = await c.req.json()
  const { name, contactPerson, phone, email } = body

  const result = await c.env.DB.prepare(`
    INSERT INTO customers (name, contact_person, phone, email)
    VALUES (?, ?, ?, ?)
  `).bind(name, contactPerson || null, phone || null, email || null).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

masterRouter.put('/customers/:id', adminMiddleware(), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, contactPerson, phone, email, isActive } = body

  await c.env.DB.prepare(`
    UPDATE customers SET name = ?, contact_person = ?, phone = ?, email = ?, is_active = ?
    WHERE id = ?
  `).bind(name, contactPerson || null, phone || null, email || null, isActive !== undefined ? isActive : 1, id).run()

  return c.json({ success: true })
})

masterRouter.delete('/customers/:id', adminMiddleware(), async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(`UPDATE customers SET is_active = 0 WHERE id = ?`).bind(id).run()
  return c.json({ success: true })
})

masterRouter.get('/vendors', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT * FROM vendors WHERE is_active = 1 ORDER BY name ASC
  `).all()
  return c.json(results.results)
})

masterRouter.post('/vendors', adminMiddleware(), async (c) => {
  const body = await c.req.json()
  const { name, contactPerson, phone, email } = body

  const result = await c.env.DB.prepare(`
    INSERT INTO vendors (name, contact_person, phone, email)
    VALUES (?, ?, ?, ?)
  `).bind(name, contactPerson || null, phone || null, email || null).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

masterRouter.put('/vendors/:id', adminMiddleware(), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, contactPerson, phone, email, isActive } = body

  await c.env.DB.prepare(`
    UPDATE vendors SET name = ?, contact_person = ?, phone = ?, email = ?, is_active = ?
    WHERE id = ?
  `).bind(name, contactPerson || null, phone || null, email || null, isActive !== undefined ? isActive : 1, id).run()

  return c.json({ success: true })
})

masterRouter.delete('/vendors/:id', adminMiddleware(), async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(`UPDATE vendors SET is_active = 0 WHERE id = ?`).bind(id).run()
  return c.json({ success: true })
})

export { masterRouter }
