import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { FiPackage, FiAlertTriangle, FiDollarSign, FiShoppingCart, FiTrendingUp, FiClock } from 'react-icons/fi';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading Dashboard</div>;

    return (
        <div className="dashboard">
            <div className="page-container">
                <h1>📊 Dashboard Overview</h1>

                <div className="stats-grid">
                    <div className="stat-card card-hover">
                        <div className="stat-icon blue">
                            <FiPackage />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalProducts || 0}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>

                    <div className="stat-card card-hover">
                        <div className="stat-icon red">
                            <FiAlertTriangle />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.lowStockProducts || 0}</h3>
                            <p>Low Stock Items</p>
                        </div>
                    </div>

                    <div className="stat-card card-hover">
                        <div className="stat-icon green">
                            <FiDollarSign />
                        </div>
                        <div className="stat-info">
                            <h3>${stats?.totalRevenue?.toFixed(2) || 0}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>

                    <div className="stat-card card-hover">
                        <div className="stat-icon purple">
                            <FiShoppingCart />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalSales || 0}</h3>
                            <p>Total Sales</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-section">
                        <h2><FiClock /> Recent Sales</h2>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sale #</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentSales?.length > 0 ? (
                                        stats.recentSales.map(sale => (
                                            <tr key={sale._id}>
                                                <td><strong>{sale.saleNumber}</strong></td>
                                                <td>{sale.customerName || 'Walk-in Customer'}</td>
                                                <td><strong style={{ color: 'var(--secondary)' }}>${sale.totalAmount.toFixed(2)}</strong></td>
                                                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                                                No recent sales
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2><FiTrendingUp /> Top Products</h2>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Sold</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.topProducts?.length > 0 ? (
                                        stats.topProducts.map(item => (
                                            <tr key={item._id}>
                                                <td><strong>{item.product.name}</strong></td>
                                                <td><span className="chip chip-primary">{item.totalQuantity} units</span></td>
                                                <td><strong style={{ color: 'var(--secondary)' }}>${item.totalRevenue.toFixed(2)}</strong></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                                                No sales data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
