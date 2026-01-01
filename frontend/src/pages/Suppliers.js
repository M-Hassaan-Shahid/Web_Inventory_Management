import React, { useState, useEffect, useContext } from 'react';
import { getSuppliers, deleteSupplier } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchSuppliers();
    }, [page]);

    const fetchSuppliers = async () => {
        try {
            const { data } = await getSuppliers({ page });
            setSuppliers(data.suppliers);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await deleteSupplier(id);
                fetchSuppliers();
            } catch (error) {
                alert('Error deleting supplier');
            }
        }
    };

    const canModify = user?.role === 'admin' || user?.role === 'manager';

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Suppliers</h1>
                {canModify && (
                    <Link to="/suppliers/new" className="btn btn-primary">
                        <FiPlus /> Add Supplier
                    </Link>
                )}
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Contact Person</th>
                            <th>Location</th>
                            {canModify && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(supplier => (
                            <tr key={supplier._id}>
                                <td>{supplier.name}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.contactPerson || 'N/A'}</td>
                                <td>{supplier.address?.city || 'N/A'}</td>
                                {canModify && (
                                    <td>
                                        <Link to={`/suppliers/edit/${supplier._id}`} className="btn-icon">
                                            <FiEdit />
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => handleDelete(supplier._id)} className="btn-icon text-danger">
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
    );
};

export default Suppliers;
