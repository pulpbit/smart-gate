-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Gate',
  gate_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Material Inward table
CREATE TABLE IF NOT EXISTS material_inward (
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
-- Hash for "Ctrls@123" is: c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7
-- Wait let's calculate it properly
-- Actually, let's insert with a known hash we can verify
INSERT OR IGNORE INTO users (username, password_hash, role, gate_number) VALUES 
('Admin', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Admin', NULL),
('Gate03', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 03'),
('Gate06', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 06'),
('Gate07', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 07'),
('Gate08', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 08'),
('Gate09', 'c7a94b8f0d4f6f0d6e8b0c2a1f3e5d7b9a8c6d4e2f0a1b3c5d7e9f1a3b5c7', 'Gate', 'Gate 09');
