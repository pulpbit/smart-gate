import { Hono } from 'hono'
import { authMiddleware, adminMiddleware } from '../middleware/auth'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const materialRouter = new Hono<Env>()

materialRouter.use('*', authMiddleware())

materialRouter.post('/inward', async (c) => {
  const payload = c.get('jwtPayload')
  const body = await c.req.json()
  
  const {
    prPoNumber, assetBelongsTo, typeOfInward, customerName,
    requesterName, requesterEmail, departmentName, shipmentNumber,
    vehicleNumber, vendorName, invoiceDcNumber, invoiceValue,
    itemsQty, materialDescription, entrySerialNumber, remarks,
    document
  } = body

  const result = await c.env.DB.prepare(`
    INSERT INTO material_inward (
      pr_po_number, asset_belongs_to, inward_type, customer_name,
      requester_name, requester_email, department_name, shipment_number,
      vehicle_number, vendor_name, invoice_dc_number, invoice_value,
      items_qty, material_description, entry_serial_number, remarks,
      document_r2_key, gate_user_id, gate_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    prPoNumber || null,
    assetBelongsTo,
    typeOfInward,
    customerName || null,
    requesterName,
    requesterEmail,
    departmentName || null,
    shipmentNumber || null,
    vehicleNumber,
    vendorName,
    invoiceDcNumber,
    invoiceValue || 0,
    itemsQty || 0,
    materialDescription || 'As per attached DC',
    entrySerialNumber,
    remarks || null,
    document || null,
    payload.userId,
    payload.gateNumber
  ).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

materialRouter.post('/outward', async (c) => {
  const payload = c.get('jwtPayload')
  const body = await c.req.json()
  
  const {
    dcNumber, dcDate, vendorName, materialDescription,
    vehicleNumber, driverName, driverMobile, quantity,
    document
  } = body

  const result = await c.env.DB.prepare(`
    INSERT INTO material_outward (
      dc_number, dc_date, vendor_name, material_description,
      vehicle_number, driver_name, driver_mobile, quantity,
      document, gate_number, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    dcNumber, dcDate, vendorName, materialDescription,
    vehicleNumber, driverName, driverMobile, quantity,
    document, payload.gateNumber, payload.userId
  ).run()

  return c.json({ 
    id: result.meta.last_row_id,
    success: true 
  })
})

materialRouter.get('/inward', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT * FROM material_inward ORDER BY created_at DESC
  `).all()
  return c.json(results.results)
})

materialRouter.get('/outward', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT * FROM material_outward ORDER BY created_at DESC
  `).all()
  return c.json(results.results)
})

export { materialRouter }
