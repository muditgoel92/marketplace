import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function Home({ categories, vendors }) {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchFeaturedListings = useCallback(async () => {
    try {
      const [productsRes, servicesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products/`),
        axios.get(`${API_BASE_URL}/services/`),
      ]);
      setProducts(productsRes.data.results || productsRes.data);
      setServices(servicesRes.data.results || servicesRes.data);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedListings();
  }, [fetchFeaturedListings]);

  const searchMarketplace = useCallback(async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const [productsRes, servicesRes, vendorsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products/?search=${encodedQuery}`),
        axios.get(`${API_BASE_URL}/services/?search=${encodedQuery}`),
        axios.get(`${API_BASE_URL}/vendors/?search=${encodedQuery}`),
        axios.get(`${API_BASE_URL}/categories/?search=${encodedQuery}`),
      ]);

      setSearchResults({
        products: productsRes.data.results || productsRes.data,
        services: servicesRes.data.results || servicesRes.data,
        vendors: vendorsRes.data.results || vendorsRes.data,
        categories: categoriesRes.data.results || categoriesRes.data,
      });
    } catch (error) {
      console.error('Error searching marketplace:', error);
      setSearchResults({ products: [], services: [], vendors: [], categories: [] });
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults(null);
      setSearchLoading(false);
      return undefined;
    }

    setSearchLoading(true);
    const debounceTimer = setTimeout(() => {
      searchMarketplace(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchMarketplace]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMarketplace(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const hasSearchResults = searchResults && (
    searchResults.products.length > 0 ||
    searchResults.services.length > 0 ||
    searchResults.vendors.length > 0 ||
    searchResults.categories.length > 0
  );

  return (
    <div className="container">
      <div className="hero">
        <h1>🏢 Financial Products Marketplace</h1>
        <p>Discover, compare, and connect with leading financial products and solutions</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="button button-primary">
            Explore Products →
          </Link>
          <Link to="/services" className="button button-primary">
            Explore Professional Services →
          </Link>
        </div>
      </div>

      {/* Marketplace Search */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: searchResults ? '1.5rem' : 0 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, services, vendors, and categories..."
          />
          {searchResults && (
            <button type="button" onClick={clearSearch} style={{ backgroundColor: '#757575', color: 'white' }}>
              Clear
            </button>
          )}
        </form>

        {searchLoading && (
          <div className="loader" style={{ minHeight: 'auto', padding: '1rem 0' }}>Searching marketplace...</div>
        )}

        {searchResults && !searchLoading && !hasSearchResults && (
          <p style={{ color: '#666' }}>No matches found. Try a different search term.</p>
        )}

        {searchResults && !searchLoading && hasSearchResults && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {searchResults.products.length > 0 && (
              <SearchResultGroup title="Products">
                {searchResults.products.map(product => (
                  <Link key={product.id} to={`/products/${product.id}`} className="card" style={{ textDecoration: 'none', boxShadow: 'none', border: '1px solid #eee' }}>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-vendor">{product.vendor_name}</p>
                    <p className="product-description">{product.short_description}</p>
                  </Link>
                ))}
              </SearchResultGroup>
            )}

            {searchResults.services.length > 0 && (
              <SearchResultGroup title="Services">
                {searchResults.services.map(service => (
                  <Link key={service.id} to={`/services/${service.id}`} className="card" style={{ textDecoration: 'none', boxShadow: 'none', border: '1px solid #eee' }}>
                    <h3 className="product-name">{service.name}</h3>
                    <p className="product-vendor">{service.vendor_name}</p>
                    <p className="product-description">{service.short_description}</p>
                  </Link>
                ))}
              </SearchResultGroup>
            )}

            {searchResults.vendors.length > 0 && (
              <SearchResultGroup title="Vendors">
                {searchResults.vendors.map(vendor => (
                  <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="card" style={{ textDecoration: 'none', boxShadow: 'none', border: '1px solid #eee' }}>
                    <h3 className="product-name">{vendor.name}</h3>
                    <p className="product-description">{vendor.description}</p>
                  </Link>
                ))}
              </SearchResultGroup>
            )}

            {searchResults.categories.length > 0 && (
              <SearchResultGroup title="Categories">
                {searchResults.categories.map(category => (
                  <Link key={category.id} to={`/categories/${category.id}`} className="card" style={{ textDecoration: 'none', boxShadow: 'none', border: '1px solid #eee' }}>
                    <h3 className="product-name">{category.name}</h3>
                    <p className="product-description">{category.description}</p>
                  </Link>
                ))}
              </SearchResultGroup>
            )}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <h2 className="section-title">Browse by Category</h2>
      <div className="grid grid-3">
        {categories.map(cat => (
          <Link key={cat.id} to={`/categories/${cat.id}`} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {cat.icon || '📁'}
            </div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>{cat.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{cat.description}</p>
          </Link>
        ))}
      </div>

      {/* Featured Products */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>Featured Products</h2>
      {loading ? (
        <div className="loader">Loading products...</div>
      ) : (
        <div className="grid grid-4">
          {products.map(product => (
            <div key={product.id} className="card product-card">
              <div className="product-image">📦</div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-vendor">{product.vendor_name}</p>
              <p className="product-description">{product.short_description}</p>
              <div className="product-meta">
                <span className="rating stars">{product.rating}/5</span>
                <span className="pricing-model">{product.pricing_model}</span>
              </div>
              <Link to={`/products/${product.id}`} className="button">View Details</Link>
            </div>
          ))}
        </div>
      )}

      {/* Featured Services */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>Featured Services</h2>
      {loading ? (
        <div className="loader">Loading services...</div>
      ) : (
        <div className="grid grid-4">
          {services.map(service => (
            <div key={service.id} className="card product-card">
              <div className="product-image">Services</div>
              <h3 className="product-name">{service.name}</h3>
              <p className="product-vendor">{service.vendor_name}</p>
              <p className="product-description">{service.short_description}</p>
              <div className="product-meta">
                <span className="rating stars">{service.rating}/5</span>
                <span className="pricing-model">{service.pricing_model}</span>
              </div>
              <Link to={`/services/${service.id}`} className="button">View Details</Link>
            </div>
          ))}
        </div>
      )}

      {/* Vendors Section */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>Top Vendors</h2>
      <div className="grid grid-3">
        {vendors.slice(0, 6).map(vendor => (
          <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>{vendor.name}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Rating: ⭐ {vendor.rating}/5
            </p>
            <p style={{ color: '#999', fontSize: '0.85rem' }}>
              Click to view all products →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchResultGroup({ title, children }) {
  return (
    <section>
      <h3 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>{title}</h3>
      <div className="grid grid-3">
        {children}
      </div>
    </section>
  );
}
