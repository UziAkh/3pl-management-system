const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');

// Get all box types
router.get('/', boxController.getAllBoxes);

// Get a box type by ID
router.get('/:id', boxController.getBoxById);

// Create a new box type
router.post('/', boxController.createBox);

// Update a box type
router.put('/:id', boxController.updateBox);

// Delete a box type
router.delete('/:id', boxController.deleteBox);

// Find box type by barcode
router.get('/barcode/:barcode', boxController.getBoxByBarcode);

module.exports = router;