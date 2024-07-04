const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  connectionString: `${process.env.SUPABASE_URL}`,
  ssl: { rejectUnauthorized: false }
});

client.connect();

app.get('/api/babies', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM babies');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching babies:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/babies', async (req, res) => {
  const { name, weight } = req.body;
  try {
    await client.query('INSERT INTO babies (name, weight) VALUES ($1, $2)', [name, weight]);
    res.status(200).send('Baby added');
  } catch (error) {
    console.error('Error adding baby:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/babies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM babies WHERE id = $1', [id]);
    res.status(200).send('Baby deleted');
  } catch (error) {
    console.error('Error deleting baby:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/feeds/:baby_id', async (req, res) => {
  const { baby_id } = req.params;
  try {
    const result = await client.query('SELECT * FROM feeds WHERE baby_id = $1', [baby_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/feeds', async (req, res) => {
  const { baby_id, amount } = req.body;
  try {
    await client.query('INSERT INTO feeds (baby_id, amount) VALUES ($1, $2)', [baby_id, amount]);
    res.status(200).send('Feed logged');
  } catch (error) {
    console.error('Error logging feed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/feeds/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM feeds WHERE id = $1', [id]);
    res.status(200).send('Feed deleted');
  } catch (error) {
    console.error('Error deleting feed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});