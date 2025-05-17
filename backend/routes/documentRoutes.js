const { getLeadDocuments, uploadDocument, deleteDocument } = require('../controllers/documentController');
const router = require('express').Router();
const Document = require('../models/documentModel');

// Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.findAll({
      order: [['uploadedAt', 'DESC']]
    });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving documents',
      error: error.message
    });
  }
});

// Get all documents for a lead
router.get('/lead/:leadId', getLeadDocuments);

// Upload a new document for a lead
router.post('/lead/:leadId', uploadDocument);

// Delete a document
router.delete('/:id', deleteDocument);

module.exports = router; 