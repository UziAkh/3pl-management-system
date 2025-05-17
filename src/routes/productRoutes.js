const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', productController.createProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

// Find product by UPC
router.get('/upc/:upc', productController.getProductByUpc);

module.exports = router;