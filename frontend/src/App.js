import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Sales from './pages/Sales';
import SaleForm from './pages/SaleForm';
import SaleDetail from './pages/SaleDetail';
import Suppliers from './pages/Suppliers';
import SupplierForm from './pages/SupplierForm';
import Reports from './pages/Reports';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Navbar />
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/products"
                            element={
                                <PrivateRoute>
                                    <Navbar />
                                    <Products />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/products/new"
                            element={
                                <PrivateRoute roles={['admin', 'manager']}>
                                    <Navbar />
                                    <ProductForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/products/edit/:id"
                            element={
                                <PrivateRoute roles={['admin', 'manager']}>
                                    <Navbar />
                                    <ProductForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sales"
                            element={
                                <PrivateRoute>
                                    <Navbar />
                                    <Sales />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sales/new"
                            element={
                                <PrivateRoute>
                                    <Navbar />
                                    <SaleForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sales/:id"
                            element={
                                <PrivateRoute>
                                    <Navbar />
                                    <SaleDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/suppliers"
                            element={
                                <PrivateRoute>
                                    <Navbar />
                                    <Suppliers />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/suppliers/new"
                            element={
                                <PrivateRoute roles={['admin', 'manager']}>
                                    <Navbar />
                                    <SupplierForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/suppliers/edit/:id"
                            element={
                                <PrivateRoute roles={['admin', 'manager']}>
                                    <Navbar />
                                    <SupplierForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/reports"
                            element={
                                <PrivateRoute roles={['admin', 'manager']}>
                                    <Navbar />
                                    <Reports />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
