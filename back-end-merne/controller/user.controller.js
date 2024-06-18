const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');

const register = async (req, res) => {

    const { email, fullName, avatarUrl, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const client = await pool.connect();
        const result = await client.query(
            `INSERT INTO users (email, fullName, avatarUrl, passwordHash) VALUES ($1, $2, $3, $4) RETURNING *`,
            [email, fullName, avatarUrl, hash]
        );
        const user = result.rows[0];
        client.release();

        const token = jwt.sign(
            { id: user.id },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordhash, ...userData } = user;
        res.json({ ...userData, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        const user = result.rows[0];
        client.release();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValidPass = await bcrypt.compare(password, user.passwordhash);
        if (!isValidPass) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordhash, ...userData } = user;
        res.json({ ...userData, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to log in' });
    }
};

const getMe = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            `SELECT * FROM users WHERE id = $1`,
            [req.userId]
        );
        const user = result.rows[0];
        client.release();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { passwordhash, ...userData } = user;
        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve user data' });
    }
};

module.exports = {
    register,
    login,
    getMe
};
