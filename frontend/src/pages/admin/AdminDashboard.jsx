import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { FaBoxes, FaPalette, FaHistory, FaArrowRight, FaWarehouse, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import adminService from '../../utils/adminService';
import { Link } from 'react-router-dom';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.get('/admin/stats');
            setStats(res.data.data);
        } catch (error) {
            console.error('Failed to fetch stats');
            setError('Could not load dashboard statistics. Please check your connection or try again.');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                        <FaExclamationTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-navy-950 dark:text-white mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-500 mb-8 max-w-md">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all"
                    >
                        <FaSync /> Retry Now
                    </button>
                </div>
            </div>
        );
    }

    const kpis = [
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: FaBoxes, color: 'blue' },
        { label: 'Paint Colors', value: stats?.paintCount || 0, icon: FaPalette, color: 'emerald' },
        { label: 'Wallpaper', value: stats?.wallpaperCount || 0, icon: FaPalette, color: 'purple' },
        { label: 'Decor items', value: stats?.decorCount || 0, icon: FaPalette, color: 'amber' },
        { label: 'In Stock', value: stats?.inStockCount || 0, icon: FaWarehouse, color: 'green' },
        { label: 'Out of Stock', value: stats?.outOfStockCount || 0, icon: FaExclamationTriangle, color: 'red' },
    ];

    const inventoryValue = stats?.totalInventoryValue || 0;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950 transition-colors duration-500">
            <Sidebar />
            <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-navy-950 dark:text-white mb-2 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 font-medium">Welcome back, Admin. Here's your catalog overview.</p>
                    </div>
                    <button
                        onClick={fetchStats}
                        className={`p-4 rounded-2xl bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 text-gray-500 hover:text-primary-500 transition-all shadow-sm ${loading ? 'animate-spin' : ''}`}
                        title="Refresh Data"
                    >
                        <FaSync />
                    </button>
                </header>

                {loading ? (
                    <div className="space-y-12">
                        <LoadingSkeleton type="stats" count={6} />
                        <LoadingSkeleton type="table" count={5} />
                    </div>
                ) : (
                    <>
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {kpis.map((kpi, i) => (
                                <div key={i} className="bg-white dark:bg-navy-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{kpi.label}</p>
                                        <p className="text-3xl font-black text-navy-900 dark:text-white">{kpi.value.toLocaleString()}</p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl bg-${kpi.color}-50 dark:bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-500 group-hover:scale-110 transition-transform`}>
                                        <kpi.icon size={22} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Products & Distribution */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white dark:bg-navy-900 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-navy-800">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black flex items-center gap-3">
                                        <FaHistory className="text-primary-500" /> Recent Inventory
                                    </h3>
                                    <Link to="/admin/products" className="text-sm font-bold text-blue-500 flex items-center gap-2 hover:underline">
                                        Manage All <FaArrowRight />
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-navy-800">
                                                <th className="pb-4 px-2">Swatch</th>
                                                <th className="pb-4 px-4">Name</th>
                                                <th className="pb-4 px-4">Category</th>
                                                <th className="pb-4 px-4">Price</th>
                                                <th className="pb-4 px-4">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
                                            {stats?.recentProducts?.map((p, i) => (
                                                <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                                                    <td className="py-4 px-2">
                                                        {p.image ? (
                                                            <img src={p.image} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt={p.name.en} />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-400">
                                                                <FaBoxes size={16} />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 font-bold text-sm">{p.name.en}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${p.category === 'Paint' ? 'bg-emerald-50 text-emerald-600' :
                                                                p.category === 'Wallpaper' ? 'bg-purple-50 text-purple-600' :
                                                                    'bg-amber-50 text-amber-600'
                                                            }`}>
                                                            {p.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-black text-primary-500">${p.price}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`font-bold text-xs ${p.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {p.stock > 0 ? `${p.stock} units` : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-navy-950 to-navy-900 p-8 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-2">Total Value</p>
                                    <h3 className="text-4xl font-black mb-4 relative z-10">ج.م  {inventoryValue.toLocaleString()}</h3>
                                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">Estimated market value of all live swatches in your digital inventory.</p>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold">Growth</span>
                                            <span className="text-emerald-400">+12.5%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-navy-900 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-navy-800">
                                    <h3 className="text-lg font-black mb-6">Distribution</h3>
                                    <div className="space-y-4">
                                        {Object.entries(stats?.categoryDistribution || {}).map(([cat, count]) => (
                                            <div key={cat} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                                    <span>{cat}</span>
                                                    <span className="text-gray-400">{count} swatches</span>
                                                </div>
                                                <div className="h-3 bg-gray-100 dark:bg-navy-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${cat === 'Paint' ? 'bg-emerald-500' :
                                                                cat === 'Wallpaper' ? 'bg-purple-500' :
                                                                    'bg-amber-500'
                                                            }`}
                                                        style={{ width: `${(count / (stats?.totalProducts || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

