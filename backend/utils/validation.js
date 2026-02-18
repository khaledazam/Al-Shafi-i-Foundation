const { z } = require('zod');

const registerSchema = z.object({
    fullName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const productSchema = z.object({
    name: z.object({
        en: z.string().min(2),
        ar: z.string().min(2),
    }),
    hexCode: z.string().regex(/^#[0-9A-F]{6}$/i),
    rgbValues: z.object({
        r: z.number().min(0).max(255),
        g: z.number().min(0).max(255),
        b: z.number().min(0).max(255),
    }),
    category: z.enum(['Paint', 'Wallpaper', 'Decor']),
    description: z.object({
        en: z.string().optional(),
        ar: z.string().optional(),
    }).optional(),
});

module.exports = {
    registerSchema,
    loginSchema,
    productSchema,
};
