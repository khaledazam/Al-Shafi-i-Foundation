const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

// تكوين Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class ImageProcessor {
    /**
     * معالجة وتحميل الصورة إلى Cloudinary
     */
    async processAndUpload(fileBuffer, filename) {
        try {
            // حفظ حجم الصورة الأصلية
            const originalSize = fileBuffer.length;

            // معالجة الصورة الأصلية - 1200px width, 80% quality
            const originalBuffer = await sharp(fileBuffer)
                .resize(1200, 800, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                })
                .webp({ quality: 80 })
                .toBuffer();

            // معالجة الصورة المتوسطة - 600px width, 75% quality
            const mediumBuffer = await sharp(fileBuffer)
                .resize(600, 400, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                })
                .webp({ quality: 75 })
                .toBuffer();

            // معالجة الصورة المصغرة - 150px, 70% quality
            const thumbnailBuffer = await sharp(fileBuffer)
                .resize(150, 150, { 
                    fit: 'cover' 
                })
                .webp({ quality: 70 })
                .toBuffer();

            // تحميل الصور الثلاث إلى Cloudinary بشكل متوازي
            const [original, medium, thumbnail] = await Promise.all([
                this.uploadToCloudinary(originalBuffer, `${filename}-original`),
                this.uploadToCloudinary(mediumBuffer, `${filename}-medium`),
                this.uploadToCloudinary(thumbnailBuffer, `${filename}-thumbnail`)
            ]);

            // حساب نسبة الضغط
            const compressedSize = original.bytes;
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

            return {
                urls: {
                    original: original.secure_url,
                    medium: medium.secure_url,
                    thumbnail: thumbnail.secure_url,
                    cloudinaryId: original.public_id
                },
                metadata: {
                    originalSize,
                    compressedSize,
                    format: 'webp',
                    uploadedAt: new Date(),
                    compressionRatio: parseFloat(compressionRatio)
                }
            };
        } catch (error) {
            console.error('Image processing error:', error);
            throw new Error(`Image processing failed: ${error.message}`);
        }
    }

    /**
     * تحميل الصورة إلى Cloudinary
     */
    async uploadToCloudinary(buffer, filename) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    public_id: filename,
                    resource_type: 'auto',
                    format: 'webp',
                    quality: 'auto',
                    fetch_format: 'auto'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            // تحويل Buffer إلى Stream وتحميله
            streamifier.createReadStream(buffer).pipe(stream);
        });
    }

    /**
     * حذف الصورة من Cloudinary
     */
    async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('Image deleted from Cloudinary:', result);
            return result;
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }

    /**
     * تحميل صورة بدون معالجة (للاستخدام المباشر)
     */
    async uploadDirect(fileBuffer, filename) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    public_id: filename,
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            streamifier.createReadStream(fileBuffer).pipe(stream);
        });
    }
}

module.exports = new ImageProcessor();