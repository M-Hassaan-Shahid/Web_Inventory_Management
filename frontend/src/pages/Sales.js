import React, { useState, useEffect } from 'react';
import { getSales } from '../services/api';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { FiPlus, FiEye } from 'react-icons/fi';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        fetchSales();
    }, [page]);

    const fetchSales = async () => {
        try {
            const { data } = await getSales({ page });
            setSales(data.sales);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Sales</h1>
                <Link to="/sales/new" className="btn btn-primary">
                    <FiPlus /> New Sale
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sale #</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Payment Method</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(sale => (
                            <tr key={sale._id}>
                                <td>{sale.saleNumber}</td>
                                <td>{sale.customerName || 'N/A'}</td>
                                <td>{sale.items.length}</td>
                                <td>${sale.totalAmount.toFixed(2)}</td>
                                <td className="text-capitalize">{sale.paymentMethod}</td>
                                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge badge-${sale.status === 'completed' ? 'success' : 'warning'}`}>
                                        {sale.status}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/sales/${sale._id}`} className="btn-icon">
                                        <FiEye />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
    );
};

export default Sales;
