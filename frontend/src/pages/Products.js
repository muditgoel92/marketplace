import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [pricingFilter, setPricingFilter] = useState(searchParams.get('pricing') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/products/?page=${page}`;

        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (categoryFilter) {
          url += `&category=${categoryFilter}`;
        }
        if (pricingFilter) {
          url += `&pricing_model=${pricingFilter}`;
        }

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(url),
          axios.get(`${API_BASE_URL}/categories/`),
        ]);

        setProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);

        if (productsRes.data.count) {
          setTotalPages(Math.ceil(productsRes.data.count / 10));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, categoryFilter, pricingFilter, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ q: searchQuery, category: categoryFilter, pricing: pricingFilter });
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handlePricingChange = (e) => {
    setPricingFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="container">
      <h1 className="section-title">Financial Products</h1>

      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search products, features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="pricing-filter">Pricing Model</label>
          <select
            id="pricing-filter"
            value={pricingFilter}
            onChange={handlePricingChange}
          >
            <option value="">All Models</option>
            <option value="subscription">Subscription</option>
            <option value="one_time">One-Time License</option>
            <option value="usage_based">Usage-Based</option>
            <option value="custom">Custom Pricing</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loader">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="loader">No products found matching your criteria.</div>
      ) : (
        <>
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
                {product.demo_available && (
                  <div style={{ fontSize: '0.85rem', color: '#4caf50', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    ✓ Demo Available
                  </div>
                )}
                <Link to={`/products/${product.id}`} className="button">View Details</Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span style={{ padding: '0.5rem 1rem', alignSelf: 'center' }}>
              Page {page} of {totalPages || page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
