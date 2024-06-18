const pool = require('../db/db');
const jwt = require('jsonwebtoken');

const createPost = async (req, res) => {
    const { title, text, tags, imagesUrl } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            `INSERT INTO posts (title, text, tags, viewsCount, user_id, imagesUrl) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, text, tags, 0, req.userId, imagesUrl]
        );
        const post = result.rows[0];
        client.release();

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create post' });
    }
};
const getAll = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        const posts = result.rows;

        res.json(posts)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to find post' });
    }
}

const getOne = async (req, res) => {
    const { id } = req.params;

    try {
         const client = await pool.connect();
        await client.query('BEGIN');

        await client.query(
            'UPDATE posts SET viewsCount = viewsCount + 1 WHERE id = $1',
            [id]
        );

        const result = await client.query('SELECT * FROM posts WHERE id = $1', [id]);

        await client.query('COMMIT');
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = result.rows[0];
        res.json(post)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve and update post' });
    }
}

const getLastTags = async (req, res) => {
    try {
        const client = await pool.connect();
        
        const result = await client.query(
            `SELECT tags FROM posts ORDER BY created_at DESC LIMIT 10`
        );
        
        client.release();
        
        const tagsArray = result.rows.map(row => row.tags).flat();
        
        const uniqueTags = [...new Set(tagsArray)];

        res.json(uniqueTags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get tags' });
    }
}

const update = async (req, res) => {
    const { id } = req.params;
    const { title, text, tags, imagesUrl } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            `UPDATE posts SET title = COALESCE($1, title), text = COALESCE($2, text), tags = COALESCE($3, tags), imagesUrl = COALESCE($4, imagesUrl), updated_at = NOW() WHERE id = $5 RETURNING *`,
            [title, text, tags, imagesUrl, id]
        );

        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update post' });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();
        const result = await client.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);

        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete post' });
    }
};

module.exports = { createPost, getAll, getOne, getLastTags, update, remove };
