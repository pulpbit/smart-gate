import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const vendorRouter = new Hono<Env>()

vendorRouter.use('*', authMiddleware())

vendorRouter.post('/entry', async (c) => {
  const payload = c.get('jwtPayload')
  const body = await c.req.json()
  
  const {
    name, mobile, purpose, companyName,
    aadhaarNumber, aadhaarFront, aadhaarBack
  } = body

  const result = await c.env.DB.prepare(`
    INSERT INTO vendor_entry (
      name, mobile, purpose, company_name,
      aadhaar_number, aadhaar_front, aadhaar_back,
      gate_number, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    name, mobile, purpose, companyName,
    aadhaarNumber, aadhaarFront, aadhaarBack,
    payload.gateNumber, payload.userId
  ).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

vendorRouter.get('/', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT * FROM vendor_entry ORDER BY created_at DESC
  `).all()
  return c.json(results.results)
})

vendorRouter.post('/exit/:id', async (c) => {
  const id = c.req.param('id')
  
  const result = await c.env.DB.prepare(`
    UPDATE vendor_entry SET exit_time = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(id).run()

  return c.json({ success: result.meta.changes > 0 })
})

export { vendorRouter }
