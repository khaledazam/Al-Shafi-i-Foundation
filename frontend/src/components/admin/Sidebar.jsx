import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
    FaHome,
    FaBoxes,
    FaPercentage,
    FaChartLine,
    FaMoon,
    FaSun,
    FaSignOutAlt,
    FaPaintBrush,
    FaChevronRight
} from 'react-icons/fa';

const Sidebar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/admin/products', icon: FaBoxes, label: 'Products' },
        { path: '/admin/discounts', icon: FaPercentage, label: 'Discounts' },
        { path: '/admin/analytics', icon: FaChartLine, label: 'Analytics' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-72 bg-white dark:bg-navy-900 border-r border-gray-100 dark:border-navy-800 min-h-screen flex flex-col transition-all duration-500 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] z-50">
            {/* Logo Section */}
            <div className="p-10">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-500">
                        <FaPaintBrush className="text-xl text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-xl tracking-tight text-navy-950 dark:text-white leading-none mb-1">
                            Al-Shafi'i
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Foundation</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-6 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-500 mb-6 px-4">
                    Main Menu
                </div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-navy-800 hover:text-navy-950 dark:hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <Icon className={`text-xl ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} />
                                <span className={`font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            </div>
                            {isActive && <FaChevronRight className="text-[10px] text-white/50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-8 border-t border-gray-50 dark:border-navy-800 space-y-6">
                {/* Theme Toggle Wrapper */}
                <div className="bg-gray-50 dark:bg-navy-950/50 p-1.5 rounded-2xl flex">
                    <button
                        onClick={toggleTheme}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs ${!isDarkMode ? 'bg-white shadow-sm text-navy-950' : 'text-gray-500'}`}
                    >
                        <FaSun className={!isDarkMode ? 'text-amber-500' : ''} /> Light
                    </button>
                    <button
                        onClick={toggleTheme}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs ${isDarkMode ? 'bg-navy-800 shadow-sm text-white' : 'text-gray-500'}`}
                    >
                        <FaMoon className={isDarkMode ? 'text-blue-400' : ''} /> Dark
                    </button>
                </div>

                {/* Account & Logout */}
                <div className="flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                        {user?.fullName?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-navy-950 dark:text-white truncate">
                            {user?.fullName || 'Admin'}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 truncate">
                            {user?.email || 'admin@alshafii.com'}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-3 bg-gray-50 dark:bg-navy-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                        title="Logout"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
