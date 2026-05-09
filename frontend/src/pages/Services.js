import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');

  useEffect(() => {
    fetchServices();
    fetchFilters();
  }, [searchTerm, categoryFilter, vendorFilter, serviceTypeFilter]);

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (vendorFilter) params.append('vendor', vendorFilter);
      if (serviceTypeFilter) params.append('service_type', serviceTypeFilter);

      const response = await axios.get(`${API_BASE_URL}/services/?${params}`);
      setServices(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [categoriesRes, vendorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories/`),
        axios.get(`${API_BASE_URL}/vendors/`),
      ]);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setVendors(vendorsRes.data.results || vendorsRes.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setVendorFilter('');
    setServiceTypeFilter('');
  };

  if (loading) {
    return <div className="loader">Loading professional services...</div>;
  }

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="page-title">Professional Services</h1>
        <p className="page-subtitle">
          Expert consulting and implementation services for risk management, compliance, and data analytics
        </p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Search Services
              </label>
              <input
                type="text"
                placeholder="Search by name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Provider
              </label>
              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">All Providers</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Service Type
              </label>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">All Types</option>
                <option value="consulting">Consulting</option>
                <option value="implementation">Implementation</option>
                <option value="training">Training</option>
                <option value="support">Support & Maintenance</option>
                <option value="audit">Audit & Assessment</option>
                <option value="custom">Custom Development</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="button button-primary">
                Search
              </button>
              <button type="button" onClick={clearFilters} className="button">
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="loader">No services found matching your criteria.</div>
      ) : (
        <div className="grid grid-3">
          {services.map(service => (
            <div key={service.id} className="card service-card">
              <div className="service-image">🛠️</div>
              <div className="service-type" style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '0.5rem'
              }}>
                {service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1)}
              </div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.short_description}</p>
              <div className="service-meta">
                <span className="rating stars">{service.rating}/5</span>
                <span className="pricing-model">{service.pricing_model.replace('_', ' ')}</span>
              </div>
              {service.consultation_available && (
                <div style={{ fontSize: '0.85rem', color: '#4caf50', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  ✓ Free Consultation Available
                </div>
              )}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to={`/services/${service.id}`} className="button">View Details</Link>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  by {service.vendor_name}
                </span>
              </div>
              {service.category_name && (
                <p style={{ marginTop: '0.75rem', color: '#999', fontSize: '0.85rem' }}>
                  Category: {service.category_name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}