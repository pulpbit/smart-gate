-- Create vendor_entry table
CREATE TABLE IF NOT EXISTS vendor_entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  purpose TEXT,
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

-- Create vehicle_entry table
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

-- Create material_outward table
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

-- Add gate_number column to users if it doesn't exist (for compatibility)
-- Note: existing users table uses gate_name, we'll use both for compatibility
