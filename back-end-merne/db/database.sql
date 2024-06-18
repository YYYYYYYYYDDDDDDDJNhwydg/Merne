CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  avatarUrl TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  viewsCount INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  imagesUrl TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);