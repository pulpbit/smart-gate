import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const vehicleRouter = new Hono<Env>()

vehicleRouter.use('*', authMiddleware())

vehicleRouter.post('/entry', async (c) => {
  const payload = c.get('jwtPayload')
  const body = await c.req.json()
  
  const {
    vehicleNumber, driverName, driverMobile,
    vehicleType, companyName, purpose
  } = body

  const result = await c.env.DB.prepare(`
    INSERT INTO vehicle_entry (
      vehicle_number, driver_name, driver_mobile,
      vehicle_type, company_name, purpose,
      gate_number, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    vehicleNumber, driverName, driverMobile,
    vehicleType, companyName, purpose,
    payload.gateNumber, payload.userId
  ).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

vehicleRouter.get('/', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT * FROM vehicle_entry ORDER BY created_at DESC
  `).all()
  return c.json(results.results)
})

vehicleRouter.post('/exit/:id', async (c) => {
  const id = c.req.param('id')
  
  const result = await c.env.DB.prepare(`
    UPDATE vehicle_entry SET exit_time = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(id).run()

  return c.json({ success: result.meta.changes > 0 })
})

export { vehicleRouter }
