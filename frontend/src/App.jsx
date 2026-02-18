import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ColorLibrary from './pages/ColorLibrary';

import DiscountManagement from './pages/admin/DiscountManagement';
import Analytics from './pages/admin/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import Simulator from './pages/Simulator';
import { SimulatorProvider } from './context/SimulatorContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
function App() {
    return (
        <AuthProvider>
            <SimulatorProvider>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <ProductManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/discounts"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <DiscountManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/analytics"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <Analytics />
                            </ProtectedRoute>
                        }
                    />

                    {/* Simulator Route (Protected) */}
                    <Route path="/simulator" element={<Simulator />} />
                    <Route path="/colors" element={<ColorLibrary />} />
                </Routes>
            </SimulatorProvider>
        </AuthProvider>
    );
}

export default App;
