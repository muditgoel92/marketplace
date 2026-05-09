import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        const params = categoryFilter ? `&category=${categoryFilter}` : '';
        const [serviceRes, reviewsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/services/${id}/`),
          axios.get(`${API_BASE_URL}/service-reviews/?service=${id}`),
          axios.get(`${API_BASE_URL}/categories/`),
        ]);

        setService(serviceRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching service data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, categoryFilter]);

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  if (loading) {
    return <div className="loader">Loading service details...</div>;
  }

  if (!service) {
    return <div className="loader">Service not found.</div>;
  }

  return (
    <div className="container">
      {/* Service Header */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '4rem' }}>🛠️</div>
          <div style={{ flex: 1 }}>
            <div className="service-type" style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              {service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1)} Service
            </div>
            <h1 style={{ fontSize: '2rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
              {service.name}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div>
                <strong>Rating:</strong> ⭐ {service.rating}/5
              </div>
              <div>
                <strong>Pricing:</strong> {service.pricing_model.replace('_', ' ')}
              </div>
              {service.pricing_description && (
                <div>
                  <strong>Details:</strong> {service.pricing_description}
                </div>
              )}
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{service.description}</p>

            {/* Deliverables */}
            <div style={{ marginBottom: '1rem' }}>
              <strong>What You Get:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {service.deliverables.split(',').map((deliverable, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>{deliverable.trim()}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {service.consultation_available && (
                <div style={{
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  ✓ Free Consultation Available
                </div>
              )}
              {service.case_studies_url && (
                <a href={service.case_studies_url} target="_blank" rel="noopener noreferrer" className="button">
                  View Case Studies
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Services Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <h2 className="section-title" style={{ margin: 0 }}>More Services from {service.vendor.name}</h2>
        <Link to="/services" className="button">Back to Services</Link>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label htmlFor="service-category-filter" style={{ color: '#333', fontWeight: 'bold' }}>
          Filter by category:
        </label>
        <select
          id="service-category-filter"
          value={categoryFilter}
          onChange={handleCategoryChange}
          style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #ddd', minWidth: '240px' }}
        >
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Service Inquiry Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Request Service Information</h3>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Interested in this service? Fill out the form below and we'll get back to you with more details and pricing.
        </p>

        <ServiceInquiryForm serviceId={id} serviceName={service.name} />
      </div>

      {/* Reviews Section */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>
        Client Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 ? (
        <div className="loader">No reviews yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{review.title}</strong>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    by {review.author} {review.company && `from ${review.company}`}
                  </p>
                </div>
                <span style={{ fontSize: '1rem', color: '#ffc107' }}>⭐ {review.rating}/5</span>
              </div>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{review.content}</p>
              {review.verified && (
                <p style={{ fontSize: '0.8rem', color: '#4caf50', marginTop: '0.5rem' }}>
                  ✓ Verified Service Review
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceInquiryForm({ serviceId, serviceName }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    project_description: '',
    budget_range: '',
    timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/service-inquiries/`, {
        service: serviceId,
        ...formData,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setError('Failed to submit inquiry. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div style={{
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '1rem',
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <strong>Thank you!</strong> Your inquiry for "{serviceName}" has been submitted.
        We'll get back to you within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {error && (
        <div style={{
          gridColumn: '1 / -1',
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #ef5350',
        }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          First Name *
        </label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Last Name *
        </label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Company *
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Project Description *
        </label>
        <textarea
          name="project_description"
          value={formData.project_description}
          onChange={handleChange}
          required
          placeholder="Please describe your project requirements and goals..."
          rows="4"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Budget Range
        </label>
        <select
          name="budget_range"
          value={formData.budget_range}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">Select budget range...</option>
          <option value="Under $25K">Under $25,000</option>
          <option value="$25K-$50K">$25,000 - $50,000</option>
          <option value="$50K-$100K">$50,000 - $100,000</option>
          <option value="$100K-$250K">$100,000 - $250,000</option>
          <option value="$250K+">$250,000+</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Timeline
        </label>
        <select
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">Select timeline...</option>
          <option value="ASAP">ASAP</option>
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6-12 months">6-12 months</option>
          <option value="Flexible">Flexible</option>
        </select>
      </div>

      <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
        <button type="submit" className="button button-primary" style={{ padding: '0.75rem 2rem' }}>
          Submit Inquiry
        </button>
      </div>
    </form>
  );
}