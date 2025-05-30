const express = require('express');
const router = express.Router();
const masterDataController = require('../controllers/masterDataController');
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all master data
router.get('/', authenticate, checkRole(['standard', 'privileged', 'admin']), masterDataController.getAllMasterData);

// Get master data by type
router.get('/type/:type', authenticate, checkRole(['standard', 'privileged', 'admin']), masterDataController.getMasterDataByType);

// Create new master data
router.post('/', authenticate, checkRole(['admin']), masterDataController.createMasterData);

// Update master data
router.put('/:id', authenticate, checkRole(['admin']), masterDataController.updateMasterData);

// Delete master data
router.delete('/:id', authenticate, checkRole(['admin']), masterDataController.deleteMasterData);

module.exports = router; 