import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser, FiHome, FiPackage, FiShoppingCart, FiTruck, FiBarChart2, FiBox } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/dashboard" className="nav-logo">
                    <FiBox /> Inventory
                </Link>
                <div className="nav-menu">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <FiHome /> Dashboard
                    </Link>
                    <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                        <FiPackage /> Products
                    </Link>
                    <Link to="/sales" className={`nav-link ${isActive('/sales') ? 'active' : ''}`}>
                        <FiShoppingCart /> Sales
                    </Link>
                    <Link to="/suppliers" className={`nav-link ${isActive('/suppliers') ? 'active' : ''}`}>
                        <FiTruck /> Suppliers
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                        <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
                            <FiBarChart2 /> Reports
                        </Link>
                    )}
                </div>
                <div className="nav-user">
                    <span className="user-info">
                        <FiUser /> {user?.name} <span className="user-role">({user?.role})</span>
                    </span>
                    <button onClick={handleLogout} className="btn-logout">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
