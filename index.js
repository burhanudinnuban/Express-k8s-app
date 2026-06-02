const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const VERSION = '1.0.0';

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Kubernetes! im ready to explore more!!!!',
    version: 0+VERSION,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Express API listening on port ${port}`);
});
