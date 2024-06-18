const pool = require('./db');

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                fullName VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                passwordHash TEXT NOT NULL,
                avatarUrl TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await client.query(`
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
        `);

        // console.log("Tables created successfully");
    } catch (err) {
        console.error("Error creating tables", err);
    } finally {
        client.release();
    }
};

createTables();
