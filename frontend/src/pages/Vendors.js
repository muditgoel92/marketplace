import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/vendors/`);
        setVendors(res.data.results || res.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="section-title">Vendor Directory</h1>
        <Link to="/" className="button">Back to Home</Link>
      </div>

      {loading ? (
        <div className="loader">Loading vendors...</div>
      ) : vendors.length === 0 ? (
        <div className="loader">No vendors available.</div>
      ) : (
        <div className="grid grid-3">
          {vendors.map(vendor => (
            <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="card" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏢</div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>{vendor.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{vendor.description}</p>
              <p style={{ color: '#999', fontSize: '0.85rem' }}>
                Rating: ⭐ {vendor.rating}/5 · {vendor.locations}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
