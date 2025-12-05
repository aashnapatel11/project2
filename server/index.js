const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Joke App Server is running!');
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
