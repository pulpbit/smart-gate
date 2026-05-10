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
  try {
    const payload = c.get('jwtPayload')
    const body = await c.req.json()
    
    const {
      name, mobile, companyName,
      aadhaarNumber, aadhaarFront, aadhaarBack
    } = body

    if (!name || !mobile) {
      return c.json({ error: 'Name and mobile are required' }, 400)
    }

    const gateNumber = payload.gateNumber || payload.gate_name || null
    const userId = payload.userId || payload.user_id || null

    const result = await c.env.DB.prepare(`
      INSERT INTO vendor_entry (
        name, mobile, company_name,
        aadhaar_number, aadhaar_front, aadhaar_back,
        gate_number, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name, mobile, companyName || null,
      aadhaarNumber || null, aadhaarFront || null, aadhaarBack || null,
      gateNumber, userId
    ).run()

    return c.json({ 
      id: result.meta.last_row_id,
      success: true 
    })
  } catch (error) {
    console.error('Vendor entry error:', error)
    return c.json({ error: 'Failed to create vendor entry: ' + (error as Error).message }, 500)
  }
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
