const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create and connect to the SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Define a route to handle form submissions
app.post('/api/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Insert the form data into the database
  const sql = `INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, message], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(`A new row has been inserted with ID ${this.lastID}`);
    return res.status(201).json({ id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
