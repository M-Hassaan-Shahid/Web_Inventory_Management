import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct, getSuppliers } from '../services/api';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        category: 'Electronics',
        quantity: 0,
        minStockLevel: 10,
        price: 0,
        costPrice: 0,
        supplier: ''
    });
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchSuppliers();
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchSuppliers = async () => {
        try {
            const { data } = await getSuppliers({ limit: 100 });
            setSuppliers(data.suppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const { data } = await getProduct(id);
            setFormData({
                name: data.name,
                sku: data.sku,
                description: data.description || '',
                category: data.category,
                quantity: data.quantity,
                minStockLevel: data.minStockLevel,
                price: data.price,
                costPrice: data.costPrice,
                supplier: data.supplier._id
            });
        } catch (error) {
            setError('Error loading product');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id) {
                await updateProduct(id, formData);
            } else {
                await createProduct(formData);
            }
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1>{id ? 'Edit Product' : 'Add New Product'}</h1>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>SKU *</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Food">Food</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Supplier *</label>
                        <select name="supplier" value={formData.supplier} onChange={handleChange} required className="form-control">
                            <option value="">Select Supplier</option>
                            {suppliers.map(supplier => (
                                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Quantity *</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Min Stock Level *</label>
                        <input
                            type="number"
                            name="minStockLevel"
                            value={formData.minStockLevel}
                            onChange={handleChange}
                            required
                            min="0"
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Cost Price *</label>
                        <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Selling Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => navigate('/products')} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
