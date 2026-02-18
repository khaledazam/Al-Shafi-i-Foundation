import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaPalette, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/20 mb-6 group cursor-pointer">
                        <FaPalette className="text-white text-3xl group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Al-Shafi'i Foundation</h1>
                    <p className="text-gray-400 font-medium">Professional Paint Simulator Dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8">Welcome back</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-12 text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-navy-900/50 checked:bg-blue-600 transition-all cursor-pointer" />
                                <span className="group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-500 font-bold hover:underline">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl py-4 font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Verifying...' : (
                                <>
                                    Sign In <FaArrowRight className="text-xs" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Demo Credentials */}
                {/* <div className="mt-8 text-center p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Demo Credentials</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <p className="text-gray-400">Email: <span className="text-white font-bold">admin@example.com</span></p>
                        <p className="text-gray-400">Pass: <span className="text-white font-bold">admin123</span></p>
                    </div>
                </div> */}

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Don't have an account? <a href="/signup" className="text-white font-bold hover:underline">Contact System Admin</a>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
