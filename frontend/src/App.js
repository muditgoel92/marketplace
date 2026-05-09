import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Vendors from './pages/Vendors';
import VendorDetail from './pages/VendorDetail';
import CategoryDetail from './pages/CategoryDetail';
import ListYourFirm from './pages/ListYourFirm';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, vendorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories/`),
        axios.get(`${API_BASE_URL}/vendors/`),
      ]);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setVendors(vendorsRes.data.results || vendorsRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading marketplace...</div>;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="logo">
              💼 Financial Products Marketplace
            </Link>
            <ul className="nav-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/services">Professional Services</Link></li>
              <li><Link to="/vendors">Vendors</Link></li>
              <li><Link to="/list-your-firm">List Your Firm</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home categories={categories} vendors={vendors} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorDetail />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/list-your-firm" element={<ListYourFirm />} />
          <Route path="/list-product/:vendorId" element={<ListYourFirm />} />
          <Route path="/list-service/:vendorId" element={<ListYourFirm />} />
        </Routes>

        <footer className="footer">
          <p>&copy; 2026 Financial Products Marketplace. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}
