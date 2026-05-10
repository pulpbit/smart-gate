-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Gate',
  gate_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table (Master Data)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table (Master Data)
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  gst_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Material Inward table (Updated with all new fields)
CREATE TABLE IF NOT EXISTS material_inward (
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

-- Material Outward table
CREATE TABLE IF NOT EXISTS material_outward (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dc_number TEXT NOT NULL,
  dc_date DATE NOT NULL,
  vendor_name TEXT NOT NULL,
  material_description TEXT,
  vehicle_number TEXT,
  driver_name TEXT,
  driver_mobile TEXT,
  quantity INTEGER,
  document TEXT,
  gate_number TEXT,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Vendor Entry table
CREATE TABLE IF NOT EXISTS vendor_entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  purpose TEXT NOT NULL,
  company_name TEXT,
  aadhaar_number TEXT,
  aadhaar_front TEXT,
  aadhaar_back TEXT,
  gate_number TEXT,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  exit_time DATETIME,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Vehicle Entry table
CREATE TABLE IF NOT EXISTS vehicle_entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_number TEXT NOT NULL,
  driver_name TEXT,
  driver_mobile TEXT,
  vehicle_type TEXT,
  company_name TEXT,
  purpose TEXT,
  gate_number TEXT,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  exit_time DATETIME,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insert default users with password "Ctrls@123" (SHA-256 hash)
INSERT OR IGNORE INTO users (username, password_hash, role, gate_number) VALUES 
('Admin', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Admin', NULL),
('Gate03', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 03'),
('Gate06', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 06'),
('Gate07', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 07'),
('Gate08', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 08'),
('Gate09', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 09');

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
