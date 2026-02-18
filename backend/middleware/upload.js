const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔧 Cloudinary Configuration:');
console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌ MISSING');
console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? '✅' : '❌ MISSING');
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅' : '❌ MISSING');

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'paint-simulator/products', // Folder in Cloudinary
            public_id: `product-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            quality: 'auto',
            fetch_format: 'auto',
            tags: ['paint-simulator', 'product'],
            overwrite: false
        };
    }
});

// Configure Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

module.exports = upload;