const Document = require('../models/documentModel');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Leads = require('../models/LeadsModel');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'crm_documents',
        allowed_formats: ['pdf'],
        resource_type: 'raw'
    }
});

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
}).single('document');

// Get all documents for a lead
const getLeadDocuments = async (req, res) => {
    try {
        const { leadId } = req.params;
        const documents = await Document.findAll({
            where: { leadId },
            order: [['uploadedAt', 'DESC']]
        });
        
        res.status(200).json({
            message: 'Documents retrieved successfully',
            documents
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving documents',
            error: error.message
        });
    }
};

// Upload a new document
const uploadDocument = async (req, res) => {
    // Fetch lead info to construct folder name
    const { leadId } = req.params;
    const lead = await Leads.findByPk(leadId);
    if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
    }
    // Use multer memory storage to get file buffer
    const multerMemory = multer({ storage: multer.memoryStorage() }).single('document');
    multerMemory(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'Error uploading document', error: err.message });
        }
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            // Upload to Cloudinary in the correct folder
            const cloudinaryRes = await cloudinary.uploader.upload_stream({
                folder: `leads/${leadId}_${lead.leadName}`,
                resource_type: 'raw',
                use_filename: true,
                unique_filename: false
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary error:', error);
                    return res.status(500).json({ message: 'Cloudinary upload error', error: error.message });
                }
                // Save to Document table
                const { name, type } = req.body;
                const document = await Document.create({
                    leadId,
                    name: name || req.file.originalname,
                    type: type || 'PDF',
                    url: result.secure_url,
                    cloudinaryId: result.public_id
                });
                res.status(201).json({ message: 'Document uploaded successfully', document });
            });
            cloudinaryRes.end(req.file.buffer);
        } catch (error) {
            console.error('Error saving document:', error);
            res.status(500).json({ message: 'Error saving document', error: error.message });
        }
    });
};

// Delete a document
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findByPk(id);

        if (!document) {
            return res.status(404).json({
                message: 'Document not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(document.cloudinaryId);

        // Delete from database
        await document.destroy();

        res.status(200).json({
            message: 'Document deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting document',
            error: error.message
        });
    }
};

module.exports = {
    getLeadDocuments,
    uploadDocument,
    deleteDocument
}; 