import React, { useState, useEffect, useContext } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
    }, [page, search, category]);

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts({ page, search, category });
            setProducts(data.products);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const canModify = user?.role === 'admin' || user?.role === 'manager';

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Products</h1>
                {canModify && (
                    <Link to="/products/new" className="btn btn-primary">
                        <FiPlus /> Add Product
                    </Link>
                )}
            </div>

            <div className="filters">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Supplier</th>
                            <th>Status</th>
                            {canModify && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.sku}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td className={product.isLowStock ? 'text-danger' : ''}>
                                    {product.quantity}
                                </td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.supplier?.name}</td>
                                <td>
                                    {product.isLowStock ? (
                                        <span className="badge badge-danger">Low Stock</span>
                                    ) : (
                                        <span className="badge badge-success">In Stock</span>
                                    )}
                                </td>
                                {canModify && (
                                    <td>
                                        <Link to={`/products/edit/${product._id}`} className="btn-icon">
                                            <FiEdit />
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => handleDelete(product._id)} className="btn-icon text-danger">
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

export default Products;
