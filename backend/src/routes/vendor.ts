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
    console.log('=== Vendor Entry Start ===')
    
    const payload = c.get('jwtPayload')
    console.log('JWT Payload:', JSON.stringify(payload))
    
    const body = await c.req.json()
    console.log('Request Body:', JSON.stringify(body))
    
    const {
      name, mobile, companyName,
      aadhaarNumber, aadhaarFront, aadhaarBack
    } = body

    console.log('Parsed fields:')
    console.log('  name:', name)
    console.log('  mobile:', mobile)
    console.log('  companyName:', companyName)
    console.log('  aadhaarNumber:', aadhaarNumber ? '***' + aadhaarNumber.slice(-4) : null)

    if (!name || !mobile) {
      console.log('Validation failed: name or mobile missing')
      return c.json({ error: 'Name and mobile are required' }, 400)
    }

    const gateNumber = payload.gateNumber || payload.gate_name || null
    const userId = payload.userId || payload.user_id || null
    
    console.log('gateNumber:', gateNumber)
    console.log('userId:', userId)

    // Check if table exists and get schema
    try {
      const tableCheck = await c.env.DB.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='vendor_entry'
      `).first()
      console.log('vendor_entry table exists:', !!tableCheck)
      
      if (tableCheck) {
        const pragmaResult = await c.env.DB.prepare(`PRAGMA table_info(vendor_entry)`).all()
        console.log('vendor_entry schema:', JSON.stringify(pragmaResult.results))
      }
    } catch (schemaError) {
      console.error('Schema check error:', schemaError)
    }

    console.log('Executing INSERT...')
    
    const result = await c.env.DB.prepare(`
      INSERT INTO vendor_entry (
        name, mobile, company_name,
        aadhaar_number, aadhaar_front, aadhaar_back,
        gate_number, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name, 
      mobile, 
      companyName || null,
      aadhaarNumber || null, 
      aadhaarFront || null, 
      aadhaarBack || null,
      gateNumber, 
      userId
    ).run()

    console.log('INSERT result:', JSON.stringify(result))

    return c.json({ 
      id: result.meta.last_row_id,
      success: true 
    })
  } catch (error) {
    console.error('Vendor entry error:', error)
    console.error('Error message:', (error as Error).message)
    console.error('Error stack:', (error as Error).stack)
    
    return c.json({ 
      error: 'Failed to create vendor entry: ' + (error as Error).message 
    }, 500)
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
