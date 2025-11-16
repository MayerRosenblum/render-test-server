const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Connect to PostgreSQL using environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ✅ Create table if not exists
pool.query(`
    CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        role VARCHAR(100)
    )
`).catch(err => console.error('Error creating table:', err));

// ✅ Routes
app.get('/', (req, res) => res.send('Hello from Render with PostgreSQL!'));

// ✅ POST route to insert data
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

// ✅ GET route to fetch all items
app.get('/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
