require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Voice AI Baseline is running!');
});

// Placeholder for Retell AI webhook
app.post('/retell-webhook', (req, res) => {
  console.log('Retell Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
