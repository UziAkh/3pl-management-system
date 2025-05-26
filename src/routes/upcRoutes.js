const express = require('express');
const router = express.Router();
const upcController = require('../controllers/upcController');

// Lookup product by UPC
router.get('/:upc', upcController.lookupUPC);

module.exports = router;