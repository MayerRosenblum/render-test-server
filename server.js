const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Create table if not exists
pool.query(`
    CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        role VARCHAR(100)
    )
`);

// POST route to insert data
app.post('/add-item', async (req, res) => {
    const { name, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO items (name, role) VALUES ($1, $2) RETURNING *',
            [name, role]
        );
        res.json({ message: 'Item saved!', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
