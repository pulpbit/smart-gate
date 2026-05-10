-- Migration to add master data tables and update material_inward

-- Create customers table if not exists
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create vendors table if not exists
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  gst_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Check if we need to update material_inward
-- We'll create a new table with the correct schema, copy data, and swap

-- Create new material_inward table with updated schema
CREATE TABLE IF NOT EXISTS material_inward_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pr_po_number TEXT,
  asset_belongs_to TEXT NOT NULL DEFAULT 'CtrlS',
  type_of_inward TEXT NOT NULL DEFAULT 'Inward Non Returnable',
  customer_name TEXT,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  department_name TEXT,
  shipment_number TEXT,
  vehicle_number TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  invoice_dc_number TEXT NOT NULL,
  invoice_value REAL NOT NULL DEFAULT 0,
  items_qty INTEGER NOT NULL DEFAULT 0,
  material_description TEXT,
  entry_serial_number TEXT NOT NULL,
  remarks TEXT,
  document TEXT,
  gate_number TEXT,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insert sample customers
INSERT OR IGNORE INTO customers (name, email, phone) VALUES 
('ABC Corporation', 'contact@abccorp.com', '9876543210'),
('XYZ Industries', 'info@xyzindustries.com', '9876543211'),
('Tech Solutions Pvt Ltd', 'admin@techsolutions.com', '9876543212');

-- Insert sample vendors
INSERT OR IGNORE INTO vendors (name, email, phone, gst_number) VALUES 
('Prime Suppliers', 'orders@primesuppliers.com', '9876543220', '29AABCT1234D1Z5'),
('Global Logistics', 'contact@globallogistics.com', '9876543221', '29AABCG5678E2Z6'),
('Quality Materials', 'sales@qualitymaterials.com', '9876543222', '29AABCQ9012F3Z7');
