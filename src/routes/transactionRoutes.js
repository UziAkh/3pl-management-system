const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get transactions for a specific product
router.get('/product/:productId', transactionController.getTransactionsByProduct);

// Create an inbound transaction
router.post('/inbound', transactionController.createInboundTransaction);

// Create an outbound transaction
router.post('/outbound', transactionController.createOutboundTransaction);

module.exports = router;