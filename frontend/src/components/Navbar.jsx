import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon, Home, Layers, LayoutDashboard, LogIn, UserPlus, LogOut, Palette } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme } = useSimulator();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Simulator', path: '/simulator', icon: Layers },
        { name: 'Colors', path: '/colors', icon: Palette },
    ];

    // Add Admin link if user is admin
    if (user && user.role === 'admin') {
        navLinks.push({ name: 'Admin', path: '/admin/dashboard', icon: LayoutDashboard });
    }

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-gray-100 dark:border-navy-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            A
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-navy-900 to-navy-600 dark:from-white dark:to-gray-300 font-arabic">
                            Al-Shafi'i
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                        ${isActive(link.path)
                                            ? 'bg-primary-50 text-primary-600 dark:bg-navy-800 dark:text-primary-400'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-navy-800'
                                        }`}
                                >
                                    <link.icon size={16} />
                                    {link.name}
                                </Link>
                            ))}

                            <div className="h-6 w-px bg-gray-200 dark:bg-navy-700 mx-2"></div>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Hi, {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                            ${isActive('/login')
                                                ? 'bg-primary-50 text-primary-600 dark:bg-navy-800 dark:text-primary-400'
                                                : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-navy-800'
                                            }`}
                                    >
                                        <LogIn size={16} />
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                    >
                                        <UserPlus size={16} />
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-800 transition-colors ml-2"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-navy-800 shadow-xl">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2
                                    ${isActive(link.path)
                                        ? 'bg-primary-50 text-primary-600 dark:bg-navy-800 dark:text-primary-400'
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-navy-800'
                                    }`}
                            >
                                <link.icon size={18} />
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 dark:border-navy-800 my-2 pt-2">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Hi, {user.fullName}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2
                                            ${isActive('/login')
                                                ? 'bg-primary-50 text-primary-600 dark:bg-navy-800 dark:text-primary-400'
                                                : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-navy-800'
                                            }`}
                                    >
                                        <LogIn size={18} />
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-navy-800 flex items-center gap-2"
                                    >
                                        <UserPlus size={18} />
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => { toggleTheme(); setIsOpen(false); }}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            <span>Toggle Theme</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
