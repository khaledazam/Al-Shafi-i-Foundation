const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true }
    },
    hexCode: {
        type: String,
        required: true,
        match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code']
    },
    rgbValues: {
        r: { type: Number, min: 0, max: 255 },
        g: { type: Number, min: 0, max: 255 },
        b: { type: Number, min: 0, max: 255 }
    },
    category: {
        type: String,
        required: true,
        enum: ['Paint', 'Wallpaper', 'Decor'],
        default: 'Paint'
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    description: {
        en: { type: String, trim: true },
        ar: { type: String, trim: true }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // ✅ الحقل الأساسي - الصور بتتخزن هنا
    image: {
        type: String,
        default: ''
    },
    // حقول اختيارية للصور المتعددة (للمستقبل)
    images: {
        original: String,
        medium: String,
        thumbnail: String,
        cloudinaryId: String
    },
    imageMeta: {
        originalSize: Number,
        compressedSize: Number,
        format: String,
        uploadedAt: Date,
        compressionRatio: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual: أرجع أفضل صورة متاحة
productSchema.virtual('displayImage').get(function() {
    if (this.images?.medium) return this.images.medium;
    if (this.images?.original) return this.images.original;
    if (this.image) return this.image;
    return null;
});

// تأكد من تضمين Virtual في JSON و Object
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Update timestamp on save
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema);