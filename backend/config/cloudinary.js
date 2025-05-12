const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const dotenv = require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => {
            // Create folder name using lead name and id
            const leadName = req.body.leadName || 'unknown'
            const leadId = req.body.id || 'temp'
            return `leads/${leadName}_${leadId}`
        },
        allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        resource_type: 'raw',
        public_id: (req, file) => file.originalname
    }
})

const upload = multer({ storage: storage })

module.exports = { cloudinary, upload }
