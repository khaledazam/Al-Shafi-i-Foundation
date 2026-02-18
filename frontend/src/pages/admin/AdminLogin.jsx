import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { FaUserShield, FaLock, FaPaintBrush } from 'react-icons/fa';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/admin/login', formData);

            if (response.data.success) {
                // Store token and admin data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('admin', JSON.stringify(response.data.data));

                toast.success('Welcome back!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-navy-700 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-4">
                        <FaPaintBrush className="text-4xl text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Al-Shafi'i Foundation</h1>
                    <p className="text-white/80">Admin Dashboard</p>
                </div>

                {/* Login Form */}
                <div className="card glass-effect">
                    <div className="flex items-center gap-2 mb-6">
                        <FaUserShield className="text-2xl text-primary-500" />
                        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Admin Login</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="admin@alshafii.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            Demo Credentials:
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            Email: admin@alshafii.com<br />
                            Password: admin123456
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
