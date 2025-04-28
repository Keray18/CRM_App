const express = require('express');
const router = express.Router();
const masterDataController = require('../controllers/masterDataController');

// Get all master data
router.get('/', masterDataController.getAllMasterData);

// Get master data by type
router.get('/type/:type', masterDataController.getMasterDataByType);

// Create new master data
router.post('/', masterDataController.createMasterData);

// Update master data
router.put('/:id', masterDataController.updateMasterData);

// Delete master data
router.delete('/:id', masterDataController.deleteMasterData);

module.exports = router; 