import axios from 'axios';

// الـ API URL من environment variables أو default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance
const adminService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
adminService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
adminService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============ PRODUCT ENDPOINTS ============

export const productService = {
    // Get all products (public)
    getAllProducts: (params) => {
        return adminService.get('/products', { params });
    },

    // Get product by ID
    getProductById: (id) => {
        return adminService.get(`/products/${id}`);
    },

    // Create product (admin only)
    createProduct: (formData) => {
        return adminService.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // Update product (admin only)
    updateProduct: (id, formData) => {
        return adminService.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // Delete product (admin only)
    deleteProduct: (id) => {
        return adminService.delete(`/products/${id}`);
    },

    // Get admin products with stats (admin only)
    getAdminProducts: (params) => {
        return adminService.get('/admin/products', { params });
    }
};

// ============ AUTH ENDPOINTS ============

export const authService = {
    // Login
    login: (email, password) => {
        return adminService.post('/auth/login', { email, password });
    },

    // Register
    register: (fullName, email, password) => {
        return adminService.post('/auth/register', { fullName, email, password });
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        return Promise.resolve();
    },

    // Get current user
    getCurrentUser: () => {
        return adminService.get('/auth/me');
    }
};

export default adminService;