const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Render!');
});

app.get('/get-endpoint', (req, res) => {
    res.json({ message: 'GET request successful!' });
});

app.post('/post-endpoint', (req, res) => {
    res.json({ message: 'POST request successful!', data: req.body });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
