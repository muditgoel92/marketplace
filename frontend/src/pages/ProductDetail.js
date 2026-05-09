import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    preferred_date: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}/`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      await axios.post(`${API_BASE_URL}/demo-requests/`, {
        product: id,
        ...formState,
      });
      setSubmitStatus('success');
      setFormState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        preferred_date: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setSubmitStatus('error');
    }
  };

  if (loading) {
    return <div className="loader">Loading product details...</div>;
  }

  if (!product) {
    return <div className="loader">Product not found.</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="section-title">{product.name}</h1>
          <p style={{ margin: 0, color: '#666' }}>{product.short_description}</p>
        </div>
        <Link to="/products" className="button">Back to Products</Link>
      </div>

      <div className="card product-card" style={{ padding: '2rem' }}>
        <div className="product-image">📦</div>
        <h2 style={{ marginTop: '1rem' }}>{product.vendor.name}</h2>
        <div className="product-meta">
          <span className="rating stars">{product.rating}/5</span>
          <span className="pricing-model">{product.pricing_model}</span>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h3>About this product</h3>
          <p>{product.description}</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Key Features</h3>
          <p>{product.features}</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Metadata</h3>
          <div className="product-details-list">
            {product.metadata.map(item => (
              <div key={item.id} className="product-details-item">
                <strong>{item.key}</strong>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Customer Reviews ({product.reviews.length})</h3>
          {product.reviews.length === 0 ? (
            <p style={{ color: '#666' }}>No reviews yet. Be the first to request a demo and get in touch.</p>
          ) : (
            product.reviews.slice(0, 3).map(review => (
              <div key={review.id} style={{ marginBottom: '1rem' }}>
                <strong>{review.title}</strong>
                <p style={{ margin: '0.25rem 0' }}>{review.content}</p>
                <p style={{ margin: 0, color: '#999' }}>⭐ {review.rating} · {review.author}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Request a Demo</h2>
        <p>Send a demo request directly to the vendor and book a personalized walkthrough.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First name"
            value={formState.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last name"
            value={formState.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Business email"
            value={formState.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formState.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formState.company}
            onChange={handleChange}
          />
          <input
            type="date"
            name="preferred_date"
            placeholder="Preferred demo date"
            value={formState.preferred_date}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Message / use case"
            value={formState.message}
            onChange={handleChange}
            rows="4"
          />
          <button type="submit" className="button button-primary">Submit Request</button>
        </form>

        {submitStatus === 'success' && (
          <p style={{ color: '#2e7d32', marginTop: '1rem' }}>Your demo request has been sent. The vendor will follow up soon.</p>
        )}
        {submitStatus === 'error' && (
          <p style={{ color: '#c62828', marginTop: '1rem' }}>There was a problem sending your request. Please try again.</p>
        )}
      </div>
    </div>
  );
}
