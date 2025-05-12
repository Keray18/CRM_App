const Leads = require('../models/LeadsModel.js');
const { upload } = require('../config/cloudinary.js');
const { cloudinary } = require('../config/cloudinary.js');
const { sequelize } = require('../config/dbConn.js'); 
const Document = require('../models/documentModel');

const leadsController = {
   
    async submitLeadForm(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { leadName, leadPhone, leadEmail, leadPolicyType, leadCreateDate, remarks } = req.body;
            
            const existingLead = await Leads.findOne({
                where: { leadEmail },
                transaction
            });
            
            if (existingLead) {
                await transaction.rollback();
                return res.status(400).json({
                    message: 'Lead with this email already exists'
                });
            }
            
            if (!leadName || !leadPhone || !leadEmail || !leadPolicyType) {
                await transaction.rollback();
                return res.status(400).json({
                    message: 'All lead fields are required'
                });
            }
            
            // Create lead
            const newLead = await Leads.create({
                leadName,
                leadPhone,
                leadEmail,
                leadPolicyType,
                leadCreateDate: leadCreateDate || new Date(),
                remarks
            }, { transaction });
            
            // Handle document upload if present
            if (req.file) {
                // Use the correct Cloudinary URL with .pdf extension
                const pdfUrl = req.file.path && req.file.path.endsWith('.pdf') ? req.file.path : (req.file.secure_url || req.file.path);
                await newLead.update({
                    documentUrl: pdfUrl,
                    documentOriginalName: req.file.originalname
                }, { transaction });
                // Also create a record in the Document table
                await Document.create({
                    leadId: newLead.id,
                    name: req.file.originalname,
                    type: 'Proposal Document',
                    url: pdfUrl,
                    cloudinaryId: req.file.filename // Cloudinary public_id
                }, { transaction });
            }
            
            await transaction.commit();
            
            res.status(201).json({
                message: 'Lead created successfully',
                lead: newLead
            });
        } catch (error) {
            await transaction.rollback();
            
            res.status(500).json({
                message: 'Error processing form submission',
                error: error.message
            });
        }
    },

    // Get all leads without document information
    async getAllLeads(req, res) {
        try {
            const leads = await Leads.findAll({
                attributes: { 
                    exclude: ['documentUrl', 'documentOriginalName'] 
                },
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                message: 'Leads retrieved successfully',
                leads
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving leads',
                error: error.message
            });
        }
    },

    // Delete a lead and their document
    async deleteLead(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            
            // Find the lead
            const lead = await Leads.findByPk(id, { transaction });
            
            if (!lead) {
                await transaction.rollback();
                return res.status(404).json({
                    message: 'Lead not found'
                });
            }

            // If there's a document, delete it from Cloudinary
            if (lead.documentUrl) {
                try {
                    // Extract the public ID from the Cloudinary URL
                    const urlParts = lead.documentUrl.split('/');
                    const folderAndFile = urlParts.slice(-2).join('/');
                    const publicId = folderAndFile.split('.')[0];
                    
                    // Delete the file from Cloudinary
                    await cloudinary.uploader.destroy(publicId, {
                        resource_type: 'raw' // Use 'raw' for documents
                    });
                    
                    // Delete all files in the folder first
                    const folderPath = `leads/${urlParts.slice(-2, -1)[0]}`;
                    
                    // List all resources in the folder with pagination
                    let nextCursor = null;
                    do {
                        const result = await cloudinary.api.resources({
                            type: 'upload',
                            prefix: folderPath,
                            max_results: 100,
                            next_cursor: nextCursor
                        });

                        // Delete each file in the folder
                        if (result.resources && result.resources.length > 0) {
                            for (const resource of result.resources) {
                                try {
                                    await cloudinary.uploader.destroy(resource.public_id, {
                                        resource_type: 'raw'
                                    });
                                    console.log('✅ Deleted file:', resource.public_id);
                                } catch (fileError) {
                                    console.error('❌ Error deleting file:', resource.public_id, fileError);
                                }
                            }
                        }

                        nextCursor = result.next_cursor;
                    } while (nextCursor);

                    // Wait a moment to ensure all deletions are processed
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Now delete the empty folder
                    try {
                        await cloudinary.api.delete_folder(folderPath);
                        console.log('✅ Deleted folder:', folderPath);
                    } catch (folderError) {
                        console.error('❌ Error deleting folder:', folderPath, folderError);
                    }
                    
                } catch (cloudinaryError) {
                    console.error('❌ Error in Cloudinary operations:', cloudinaryError);
                    // Continue with lead deletion even if document deletion fails
                }
            }

            // Delete the lead
            await lead.destroy({ transaction });
            
            await transaction.commit();
            
            res.status(200).json({
                message: 'Lead and associated document deleted successfully'
            });
        } catch (error) {
            await transaction.rollback();
            
            res.status(500).json({
                message: 'Error deleting lead',
                error: error.message
            });
        }
    },

    // Update remarks for a lead
    async updateRemarks(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            const { remarks } = req.body;
            
            // Find the lead
            const lead = await Leads.findByPk(id, { transaction });
            
            if (!lead) {
                await transaction.rollback();
                return res.status(404).json({
                    message: 'Lead not found'
                });
            }

            // Update remarks
            await lead.update({ remarks }, { transaction });
            
            await transaction.commit();
            
            res.status(200).json({
                message: 'Remarks updated successfully',
                lead
            });
        } catch (error) {
            await transaction.rollback();
            
            res.status(500).json({
                message: 'Error updating remarks',
                error: error.message
            });
        }
    }
};

module.exports = leadsController;
