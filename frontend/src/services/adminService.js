import api from '../utils/api';

// ============ PRODUCT ENDPOINTS ============

export const productService = {
    // Get all products (public)
    getAllProducts: (params) => {
        return api.get('/products', { params });
    },

    // Get product by ID
    getProductById: (id) => {
        return api.get(`/products/${id}`);
    },

    // Create product (admin only)
    createProduct: (formData) => {
        return api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // Update product (admin only)
    updateProduct: (id, formData) => {
        return api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // Delete product (admin only)
    deleteProduct: (id) => {
        return api.delete(`/products/${id}`);
    },

    // Get admin products with stats (admin only)
    getAdminProducts: (params) => {
        return api.get('/admin/products', { params });
    }
};

// ============ AUTH ENDPOINTS ============

export const authService = {
    // Login
    login: (email, password) => {
        return api.post('/auth/login', { email, password });
    },

    // Register
    register: (fullName, email, password) => {
        return api.post('/auth/register', { fullName, email, password });
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        return Promise.resolve();
    },

    // Get current user
    getCurrentUser: () => {
        return api.get('/auth/me');
    }
};

const adminService = {
    product: productService,
    auth: authService
};

export default adminService;