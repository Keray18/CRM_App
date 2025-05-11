const MasterData = require('../models/MasterData');
const { Op } = require('sequelize');

// Get all master data entries
exports.getAllMasterData = async (req, res) => {
  try {
    const masterData = await MasterData.findAll({
      order: [['type', 'ASC'], ['name', 'ASC']]
    });
    res.json(masterData);
  } catch (error) {
    console.error('Error fetching master data:', error);
    res.status(500).json({ message: 'Error fetching master data', error: error.message });
  }
};

// Get master data by type
exports.getMasterDataByType = async (req, res) => {
  try {
    const { type } = req.params;
    console.log('Fetching master data for type:', type);

    if (!type) {
      return res.status(400).json({ message: 'Type parameter is required' });
    }

    const masterData = await MasterData.findAll({
      where: { type },
      order: [['name', 'ASC']]
    });

    console.log(`Found ${masterData.length} entries for type ${type}`);
    res.json(masterData);
  } catch (error) {
    console.error('Error fetching master data by type:', error);
    res.status(500).json({ 
      message: 'Error fetching master data', 
      error: error.message,
      details: error.stack 
    });
  }
};

// Create new master data entry
exports.createMasterData = async (req, res) => {
  try {
    const { type, name, description, isActive } = req.body;
    
    if (!type || !name) {
      return res.status(400).json({ message: 'Type and name are required' });
    }

    // Check if entry already exists
    const existingEntry = await MasterData.findOne({
      where: { type, name }
    });

    if (existingEntry) {
      return res.status(400).json({ message: 'Entry with this type and name already exists' });
    }

    const masterData = await MasterData.create({
      type,
      name,
      description,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json(masterData);
  } catch (error) {
    console.error('Error creating master data:', error);
    res.status(500).json({ message: 'Error creating master data', error: error.message });
  }
};

// Update master data entry
exports.updateMasterData = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, description, isActive } = req.body;
    
    const masterData = await MasterData.findByPk(id);
    if (!masterData) {
      return res.status(404).json({ message: 'Master data not found' });
    }

    if (!type || !name) {
      return res.status(400).json({ message: 'Type and name are required' });
    }

    // Check if another entry with same type and name exists
    const existingEntry = await MasterData.findOne({
      where: {
        type,
        name,
        id: { [Op.ne]: id } // Exclude current entry
      }
    });

    if (existingEntry) {
      return res.status(400).json({ message: 'Another entry with this type and name already exists' });
    }

    await masterData.update({
      type,
      name,
      description,
      isActive: isActive !== undefined ? isActive : masterData.isActive
    });

    res.json(masterData);
  } catch (error) {
    console.error('Error updating master data:', error);
    res.status(500).json({ message: 'Error updating master data', error: error.message });
  }
};

// Delete master data entry
exports.deleteMasterData = async (req, res) => {
  try {
    const { id } = req.params;
    const masterData = await MasterData.findByPk(id);
    
    if (!masterData) {
      return res.status(404).json({ message: 'Master data not found' });
    }

    await masterData.destroy();
    res.json({ message: 'Master data deleted successfully' });
  } catch (error) {
    console.error('Error deleting master data:', error);
    res.status(500).json({ message: 'Error deleting master data', error: error.message });
  }
}; 