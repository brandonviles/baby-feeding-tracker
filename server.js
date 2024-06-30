const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

app.use(cors());  // Add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load data from file
const loadData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return { babies: [] };
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Save data to file
const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Get all babies
app.get('/api/babies', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Add or update a baby
app.post('/api/babies', (req, res) => {
  const data = loadData();
  const baby = req.body;
  const existingBabyIndex = data.babies.findIndex(b => b.name === baby.name);

  if (existingBabyIndex !== -1) {
    data.babies[existingBabyIndex] = baby;
  } else {
    data.babies.push(baby);
  }

  saveData(data);
  res.status(200).send('Baby data saved successfully');
});

// Delete a baby
app.delete('/api/babies/:name', (req, res) => {
  const data = loadData();
  const babyName = req.params.name;
  data.babies = data.babies.filter(b => b.name !== babyName);

  saveData(data);
  res.status(200).send('Baby deleted successfully');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
