const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

// Get all shipments
router.get('/', shipmentController.getAllShipments);

// Create a new shipment
router.post('/', shipmentController.createShipment);

// Create a new shipment item
router.post('/shipment-items', shipmentController.createShipmentItem);

// Get shipment items
router.get('/:id/items', shipmentController.getShipmentItems);

module.exports = router;