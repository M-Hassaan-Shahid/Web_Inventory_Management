import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSale } from '../services/api';
import { FiArrowLeft, FiUser, FiCreditCard, FiCalendar } from 'react-icons/fi';

const SaleDetail = () => {
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSale();
    }, [id]);

    const fetchSale = async () => {
        try {
            const { data } = await getSale(id);
            setSale(data);
        } catch (error) {
            console.error('Error fetching sale:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading Sale Details</div>;
    if (!sale) return <div className="page-container"><h2>Sale not found</h2></div>;

    return (
        <div className="page-container">
            <button onClick={() => navigate('/sales')} className="btn btn-secondary">
                <FiArrowLeft /> Back to Sales
            </button>

            <div className="form-card" style={{ marginTop: '2rem' }}>
                <h2>Sale Details - {sale.saleNumber}</h2>

                <div className="form-row" style={{ marginTop: '2rem' }}>
                    <div className="form-group">
                        <label><FiUser /> Customer Name</label>
                        <p style={{ color: 'var(--text)', fontSize: '1.1rem' }}>
                            {sale.customerName || 'Walk-in Customer'}
                        </p>
                    </div>
                    <div className="form-group">
                        <label><FiCreditCard /> Payment Method</label>
                        <p style={{ color: 'var(--text)', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                            {sale.paymentMethod}
                        </p>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label><FiCalendar /> Date</label>
                        <p style={{ color: 'var(--text)', fontSize: '1.1rem' }}>
                            {new Date(sale.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <span className={`badge badge-${sale.status === 'completed' ? 'success' : 'warning'}`}>
                            {sale.status}
                        </span>
                    </div>
                </div>

                <h3 style={{ marginTop: '2rem' }}>Items</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product?.name || 'N/A'}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>${item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="sale-total">
                    <h3>Total Amount: ${sale.totalAmount.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default SaleDetail;
