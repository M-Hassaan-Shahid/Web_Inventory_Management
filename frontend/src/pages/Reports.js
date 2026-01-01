import React, { useState, useEffect } from 'react';
import { getSalesReport } from '../services/api';
import { FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const params = {};
            if (dateRange.startDate) params.startDate = dateRange.startDate;
            if (dateRange.endDate) params.endDate = dateRange.endDate;

            const { data } = await getSalesReport(params);
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    const handleFilter = () => {
        setLoading(true);
        fetchReport();
    };

    if (loading) return <div className="loading">Loading Reports</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1><FiTrendingUp /> Sales Reports</h1>
            </div>

            <div className="form-card">
                <h3><FiCalendar /> Filter by Date Range</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="form-control"
                        />
                    </div>
                </div>
                <button onClick={handleFilter} className="btn btn-primary">
                    Apply Filter
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <h2><FiDollarSign /> Sales by Day</h2>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total Sales</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData?.salesByDay?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item._id}</td>
                                        <td>{item.totalSales}</td>
                                        <td>${item.totalRevenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2>Sales by Payment Method</h2>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Payment Method</th>
                                    <th>Count</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData?.salesByPayment?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-capitalize">{item._id}</td>
                                        <td>{item.count}</td>
                                        <td>${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
