-- Create hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on order_index for sorting
CREATE INDEX IF NOT EXISTS idx_hobbies_order ON hobbies(order_index);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_hobbies_active ON hobbies(is_active);

