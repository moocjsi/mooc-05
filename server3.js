const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index3.html'));
});

// Handle form submission and return uppercase name
app.post('/uppercase', (req, res) => {
  const name = req.body.name;
  const uppercaseName = name.toUpperCase();
  res.send(`Your name in uppercase is3: ${uppercaseName}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
