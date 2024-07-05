const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const apiBase = '/https://baby-feeding-tracker.onrender.com/apis/';

app.get(apiBase + 'babies', async (req, res) => {
  try {
    const { data, error } = await supabase.from('babies').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching babies:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get(apiBase + 'babies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('babies')
      .select('*')
      .eq('id', id);
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error fetching baby:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post(apiBase + 'babies', async (req, res) => {
  const { name, weight } = req.body;
  try {
    const { data, error } = await supabase.from('babies').insert([{ name, weight }]);
    if (error) throw error;
    res.status(200).send('Baby added');
  } catch (error) {
    console.error('Error adding baby:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put(apiBase + 'babies/:id', async (req, res) => {
  const { id } = req.params;
  const { weight } = req.body;
  try {
    const { data, error } = await supabase.from('babies').update({ weight }).eq('id', id);
    if (error) throw error;
    res.status(200).send('Baby weight updated');
  } catch (error) {
    console.error('Error updating baby weight:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete(apiBase + 'babies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('babies').delete().eq('id', id);
    if (error) throw error;
    res.status(200).send('Baby deleted');
  } catch (error) {
    console.error('Error deleting baby:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get(apiBase + 'feeds/:baby_id', async (req, res) => {
  const { baby_id } = req.params;
  try {
    const { data, error } = await supabase.from('feeds').select('*').eq('baby_id', baby_id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post(apiBase + 'feeds', async (req, res) => {
  const { baby_id, amount } = req.body;
  try {
    const { data, error } = await supabase.from('feeds').insert([{ baby_id, amount }]);
    if (error) throw error;
    res.status(200).send('Feed logged');
  } catch (error) {
    console.error('Error logging feed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete(apiBase + 'feeds/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('feeds').delete().eq('id', id);
    if (error) throw error;
    res.status(200).send('Feed deleted');
  } catch (error) {
    console.error('Error deleting feed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
