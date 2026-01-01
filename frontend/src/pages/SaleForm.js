import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createSale } from '../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const SaleForm = () => {
    const [products, setProducts] = useState([]);
    const [saleItems, setSaleItems] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        paymentMethod: 'cash'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts({ limit: 100 });
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addItem = () => {
        setSaleItems([...saleItems, { product: '', quantity: 1 }]);
    };

    const removeItem = (index) => {
        setSaleItems(saleItems.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...saleItems];
        newItems[index][field] = value;
        setSaleItems(newItems);
    };

    const calculateTotal = () => {
        return saleItems.reduce((total, item) => {
            const product = products.find(p => p._id === item.product);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saleItems.length === 0) {
            setError('Please add at least one item');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createSale({
                ...formData,
                items: saleItems
            });
            navigate('/sales');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating sale');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1>New Sale</h1>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="form-card">
                <h3>Customer Information</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Email</label>
                        <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Payment Method *</label>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="form-control"
                        required
                    >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="online">Online</option>
                    </select>
                </div>

                <h3>Sale Items</h3>
                {saleItems.map((item, index) => (
                    <div key={index} className="sale-item">
                        <select
                            value={item.product}
                            onChange={(e) => updateItem(index, 'product', e.target.value)}
                            required
                            className="form-control"
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - ${product.price} (Stock: {product.quantity})
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                            min="1"
                            required
                            className="form-control"
                            placeholder="Qty"
                        />
                        <button type="button" onClick={() => removeItem(index)} className="btn-icon text-danger">
                            <FiTrash2 />
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addItem} className="btn btn-secondary">
                    <FiPlus /> Add Item
                </button>

                <div className="sale-total">
                    <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Processing...' : 'Complete Sale'}
                    </button>
                    <button type="button" onClick={() => navigate('/sales')} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SaleForm;
