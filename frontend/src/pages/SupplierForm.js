import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSupplier, updateSupplier, getSuppliers } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const SupplierForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        contactPerson: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchSupplier();
        }
    }, [id]);

    const fetchSupplier = async () => {
        try {
            const { data } = await getSuppliers({ limit: 1000 });
            const supplier = data.suppliers.find(s => s._id === id);
            if (supplier) {
                setFormData({
                    name: supplier.name,
                    email: supplier.email,
                    phone: supplier.phone,
                    contactPerson: supplier.contactPerson || '',
                    address: supplier.address || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: ''
                    }
                });
            }
        } catch (error) {
            setError('Error loading supplier');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id) {
                await updateSupplier(id, formData);
            } else {
                await createSupplier(formData);
            }
            navigate('/suppliers');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1>{id ? 'Edit Supplier' : 'Add New Supplier'}</h1>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="form-card">
                <h3>Basic Information</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label><FiUser /> Supplier Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Enter supplier name"
                        />
                    </div>
                    <div className="form-group">
                        <label><FiMail /> Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="supplier@example.com"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label><FiPhone /> Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="+1-555-0000"
                        />
                    </div>
                    <div className="form-group">
                        <label><FiUser /> Contact Person</label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Contact person name"
                        />
                    </div>
                </div>

                <h3><FiMapPin /> Address</h3>
                <div className="form-group">
                    <label>Street</label>
                    <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Street address"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="City"
                        />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="State"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Zip Code</label>
                        <input
                            type="text"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Zip code"
                        />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input
                            type="text"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Country"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : id ? 'Update Supplier' : 'Create Supplier'}
                    </button>
                    <button type="button" onClick={() => navigate('/suppliers')} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupplierForm;
