import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { FaChartBar, FaChartPie, FaChartLine, FaMagic, FaEye, FaUsers } from 'react-icons/fa';
import api from '../../utils/api';

const Analytics = () => {
    const [popularColors, setPopularColors] = useState([]);
    const [simulationCounts, setSimulationCounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [colorsRes, simulationsRes] = await Promise.all([
                api.get('/analytics/popular-colors'),
                api.get('/analytics/simulation-count')
            ]);

            setPopularColors(colorsRes.data.data);
            setSimulationCounts(simulationsRes.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950">
            <Sidebar />

            <div className="flex-1 p-6 md:p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-navy-950 dark:text-white mb-2 tracking-tight">
                            Advanced <span className="text-primary-500">Analytics</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Synthesizing user interactions and color trends
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-navy-800 shadow-sm text-sm font-bold text-gray-500">
                            Real-time data enabled
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-[60vh]">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="space-y-10 animate-fade-in">
                        {/* Summary Metrics */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="card group hover:-translate-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500 opacity-[0.05] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Top Shade</p>
                                        {popularColors.length > 0 && (
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl shadow-lg ring-4 ring-white dark:ring-navy-900"
                                                    style={{ backgroundColor: popularColors[0]._id }}
                                                ></div>
                                                <div>
                                                    <p className="text-2xl font-black text-navy-950 dark:text-white">
                                                        {popularColors[0].count}
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Selections</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
                                        <FaMagic />
                                    </div>
                                </div>
                            </div>

                            <div className="card group hover:-translate-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-500 opacity-[0.05] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Most Simulated</p>
                                        {simulationCounts.length > 0 && (
                                            <div>
                                                <p className="text-xl font-black text-navy-950 dark:text-white truncate max-w-[150px]">
                                                    {simulationCounts[0].productName}
                                                </p>
                                                <p className="text-sm font-bold text-secondary-500">
                                                    {simulationCounts[0].count} Sessions
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center text-secondary-500">
                                        <FaEye />
                                    </div>
                                </div>
                            </div>

                            <div className="card group hover:-translate-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.05] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Total Engagement</p>
                                        <p className="text-2xl font-black text-navy-950 dark:text-white">
                                            {popularColors.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Color Selections tracked</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                        <FaUsers />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="card">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-xl font-black text-navy-950 dark:text-white flex items-center gap-3">
                                        <FaChartBar className="text-primary-500" />
                                        Popularity Matrix
                                    </h2>
                                </div>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={popularColors} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="_id"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                                dy={10}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                            />
                                            <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                                                {popularColors.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry._id} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="card">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-xl font-black text-navy-950 dark:text-white flex items-center gap-3">
                                        <FaChartLine className="text-secondary-500" />
                                        Simulation Velocity
                                    </h2>
                                </div>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={simulationCounts} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="productName"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                                dy={10}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#14b8a6"
                                                fillOpacity={1}
                                                fill="url(#colorCount)"
                                                strokeWidth={4}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
