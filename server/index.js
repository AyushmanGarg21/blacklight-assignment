const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const PORT = 3000;


app.get('/currentWeekLeaderboard', (req, res) => {
  const query = `
    SELECT Name, Score, Country, (@rank := @rank + 1) AS "Rank"
    FROM users, (SELECT @rank := 0) r
    WHERE WEEK(Time) = WEEK(NOW())
    ORDER BY Score DESC
    LIMIT 200;
  `;
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});


app.get('/lastWeekLeaderboard/:country', (req, res) => {
  const country = req.params.country;
  const query = `
    SELECT Name, Score, Country, (@rank := @rank + 1) AS "Rank"
    FROM users , (SELECT @rank := 0) r
    WHERE WEEK(Time) = WEEK(NOW()) - 1
    AND Country = ?
    ORDER BY Score DESC
    LIMIT 200;
  `;
  connection.query(query, [country.toUpperCase()], (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/userRank/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT COUNT(*) AS "rank"
    FROM users
    WHERE Score > (SELECT Score FROM users WHERE UID = ?)
  `;
  connection.query(query, [userId], (error, results, fields) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
