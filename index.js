const express = require('express');
const app = express();

// Render provides the PORT environment variable dynamically
const PORT = process.env.PORT || 3000; 
const ID = process.env.ID || "null";

app.get('/', (req, res) => {
    res.send('Hello from Render!');
});
app.get("/hello", (req, res) => {
    res.send(`Hello, World! ${ID}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});