const express = require('express');
const app = express();

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Most basic route possible
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Hello from test server');
});

// Listen on a different port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});