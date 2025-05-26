const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const upcRoutes = require('./routes/upcRoutes');
const fixRoutes = require('./routes/fixRoutes');
const boxRoutes = require('./routes/boxRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send('3PL Management System API is running');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/fix', fixRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/upc', upcRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`You can access your app at http://localhost:${PORT}`);
  console.log(`API health check at http://localhost:${PORT}/api/health`);
});