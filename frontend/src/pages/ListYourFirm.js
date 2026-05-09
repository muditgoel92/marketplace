import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function ListYourFirm() {
  const { vendorId } = useParams(); // For product-only listing
  const location = useLocation();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showProductOnly, setShowProductOnly] = useState(!!vendorId);
  const isServiceListing = location.pathname.includes('/list-service/');
  const isFullListing = !showProductOnly && !isServiceListing;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Vendor form state
  const [vendorData, setVendorData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    founded_year: '',
    employees: '',
    locations: '',
  });

  // Product form state
  const [productData, setProductData] = useState({
    vendor: vendorId || '',
    name: '',
    short_description: '',
    description: '',
    category: '',
    features: '',
    pricing_model: 'subscription',
    pricing_description: '',
    demo_available: true,
    documentation_url: '',
  });

  // Service form state
  const [serviceData, setServiceData] = useState({
    vendor: vendorId || '',
    name: '',
    short_description: '',
    description: '',
    category: '',
    service_type: 'consulting',
    deliverables: '',
    pricing_model: 'project',
    pricing_description: '',
    consultation_available: true,
    case_studies_url: '',
  });

  // File state for uploads
  const [vendorLogo, setVendorLogo] = useState(null);
  const [vendorLogoPreview, setVendorLogoPreview] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  // Metadata/tags state
  const [metadata, setMetadata] = useState([
    { key: 'industry', value: '' },
    { key: 'compliance_type', value: '' },
    { key: 'target_users', value: '' },
  ]);

  // Service metadata/tags state
  const [serviceMetadata, setServiceMetadata] = useState([
    { key: 'expertise', value: '' },
    { key: 'industry', value: '' },
    { key: 'certification', value: '' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/vendors/`),
          axios.get(`${API_BASE_URL}/categories/`),
        ]);
        setVendors(vendorsRes.data.results || vendorsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleVendorLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVendorLogo(file);
      const reader = new FileReader();
      reader.onload = () => setVendorLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onload = () => setProductImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceData({
      ...serviceData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleServiceMetadataChange = (index, field, value) => {
    const newMetadata = [...serviceMetadata];
    newMetadata[index][field] = value;
    setServiceMetadata(newMetadata);
  };

  const handleAddServiceMetadata = () => {
    setServiceMetadata([...serviceMetadata, { key: '', value: '' }]);
  };

  const handleRemoveServiceMetadata = (index) => {
    setServiceMetadata(serviceMetadata.filter((_, i) => i !== index));
  };

  const handleMetadataChange = (index, field, value) => {
    const newMetadata = [...metadata];
    newMetadata[index][field] = value;
    setMetadata(newMetadata);
  };

  const handleAddMetadata = () => {
    setMetadata([...metadata, { key: '', value: '' }]);
  };

  const handleRemoveMetadata = (index) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  };

  const handleToggleMode = (e) => {
    e.preventDefault();
    if (showProductOnly) {
      // Can't toggle if vendor-specific
      return;
    }
    setShowProductOnly(!showProductOnly);
  };

  const submitVendor = async () => {
    try {
      const formData = new FormData();
      formData.append('name', vendorData.name);
      formData.append('description', vendorData.description);
      formData.append('website', vendorData.website);
      formData.append('email', vendorData.email);
      formData.append('phone', vendorData.phone);
      formData.append('founded_year', vendorData.founded_year);
      formData.append('employees', vendorData.employees);
      formData.append('locations', vendorData.locations);
      formData.append('rating', 0);
      if (vendorLogo) {
        formData.append('logo', vendorLogo);
      }

      const vendorRes = await axios.post(`${API_BASE_URL}/vendors/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return vendorRes.data.id;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.name?.[0] ||
        'Failed to create vendor'
      );
    }
  };

  const submitProduct = async (vendorIdToUse) => {
    try {
      const formData = new FormData();
      formData.append('vendor', vendorIdToUse);
      formData.append('name', productData.name);
      formData.append('short_description', productData.short_description);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('features', productData.features);
      formData.append('pricing_model', productData.pricing_model);
      formData.append('pricing_description', productData.pricing_description);
      formData.append('demo_available', productData.demo_available);
      formData.append('documentation_url', productData.documentation_url);
      formData.append('rating', 0);
      formData.append('review_count', 0);
      if (productImage) {
        formData.append('image', productImage);
      }

      const productRes = await axios.post(`${API_BASE_URL}/products/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Submit metadata for the product
      if (metadata && metadata.length > 0) {
        for (const meta of metadata) {
          if (meta.key && meta.value) {
            await axios.post(`${API_BASE_URL}/metadata/`, {
              product: productRes.data.id,
              key: meta.key,
              value: meta.value,
            });
          }
        }
      }

      return productRes.data.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.name?.[0] ||
        'Failed to create product'
      );
    }
  };

  const submitService = async (vendorIdToUse) => {
    try {
      const formData = new FormData();
      formData.append('vendor', vendorIdToUse);
      formData.append('name', serviceData.name);
      formData.append('short_description', serviceData.short_description);
      formData.append('description', serviceData.description);
      formData.append('category', serviceData.category);
      formData.append('service_type', serviceData.service_type);
      formData.append('deliverables', serviceData.deliverables);
      formData.append('pricing_model', serviceData.pricing_model);
      formData.append('pricing_description', serviceData.pricing_description);
      formData.append('consultation_available', serviceData.consultation_available);
      formData.append('case_studies_url', serviceData.case_studies_url);
      formData.append('rating', 0);
      formData.append('review_count', 0);

      const serviceRes = await axios.post(`${API_BASE_URL}/services/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Submit metadata for the service
      if (serviceMetadata && serviceMetadata.length > 0) {
        for (const meta of serviceMetadata) {
          if (meta.key && meta.value) {
            await axios.post(`${API_BASE_URL}/service-metadata/`, {
              service: serviceRes.data.id,
              key: meta.key,
              value: meta.value,
            });
          }
        }
      }

      return serviceRes.data.id;
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.name?.[0] ||
        'Failed to create service'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    try {
      if (isServiceListing) {
        // Service-only submission for existing vendor
        await submitService(serviceData.vendor);
      } else if (showProductOnly) {
        // Product-only submission for existing vendor
        await submitProduct(productData.vendor);
      } else {
        // Firm, product, and service submission
        const newVendorId = await submitVendor();
        await submitProduct(newVendorId);
        await submitService(newVendorId);
      }

      setSubmitted(true);
      setTimeout(() => {
        navigate('/vendors');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loader">Loading form...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem', color: '#1a1a2e' }}>
          {isServiceListing ? '🛠️ List a New Service' :
           showProductOnly ? '📦 List a New Product' : '🏢 List Your Firm, Products & Services'}
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {isServiceListing ? 'Add a new professional service to your existing firm.' :
           showProductOnly ? 'Add a new product to your existing firm.' :
           'Register your firm and list your first product and professional service on our marketplace.'}
        </p>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #ef5350',
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {submitted && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #66bb6a',
          }}>
            <strong>Success!</strong> Your submission has been accepted. Redirecting to vendors page...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Vendor Section */}
          {!showProductOnly && (
            <fieldset style={{ padding: '1.5rem', border: '2px solid #e0e0e0', borderRadius: '6px' }}>
              <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a2e', padding: '0 0.5rem' }}>
                Firm Information
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Firm Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={vendorData.name}
                    onChange={handleVendorChange}
                    required
                    placeholder="e.g., ABC Financial Solutions"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={vendorData.email}
                    onChange={handleVendorChange}
                    required
                    placeholder="contact@firm.com"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Firm Description *
                  </label>
                  <textarea
                    name="description"
                    value={vendorData.description}
                    onChange={handleVendorChange}
                    required
                    placeholder="Describe your firm and what you do..."
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={vendorData.phone}
                    onChange={handleVendorChange}
                    placeholder="+1-555-0123"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={vendorData.website}
                    onChange={handleVendorChange}
                    placeholder="https://yourfirm.com"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="founded_year"
                    value={vendorData.founded_year}
                    onChange={handleVendorChange}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Number of Employees
                  </label>
                  <input
                    type="text"
                    name="employees"
                    value={vendorData.employees}
                    onChange={handleVendorChange}
                    placeholder="e.g., 50-249"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Locations
                  </label>
                  <input
                    type="text"
                    name="locations"
                    value={vendorData.locations}
                    onChange={handleVendorChange}
                    placeholder="e.g., New York, London, Singapore"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Firm Logo / Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVendorLogoChange}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  {vendorLogoPreview && (
                    <div style={{ marginTop: '1rem' }}>
                      <img
                        src={vendorLogoPreview}
                        alt="Selected firm logo"
                        style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          )}

          {/* Existing Vendor Selection */}
          {(showProductOnly || isServiceListing) && (
            <fieldset style={{ padding: '1.5rem', border: '2px solid #e0e0e0', borderRadius: '6px' }}>
              <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a2e', padding: '0 0.5rem' }}>
                Select Your Firm
              </legend>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Firm *
                </label>
                <select
                  name="vendor"
                  value={isServiceListing ? serviceData.vendor : productData.vendor}
                  onChange={isServiceListing ? handleServiceChange : handleProductChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select a firm...</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
          )}

          {/* Service Section */}
          {(isServiceListing || isFullListing) && (
            <fieldset style={{ padding: '1.5rem', border: '2px solid #e0e0e0', borderRadius: '6px' }}>
              <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a2e', padding: '0 0.5rem' }}>
                Service Information
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={serviceData.name}
                    onChange={handleServiceChange}
                    required
                    placeholder="e.g., Risk Management Consulting"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Short Description *
                  </label>
                  <textarea
                    name="short_description"
                    value={serviceData.short_description}
                    onChange={handleServiceChange}
                    required
                    placeholder="Brief summary for service listings (max 500 chars)"
                    maxLength="500"
                    rows="2"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <small style={{ color: '#999' }}>{serviceData.short_description.length}/500</small>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Full Description *
                  </label>
                  <textarea
                    name="description"
                    value={serviceData.description}
                    onChange={handleServiceChange}
                    required
                    placeholder="Detailed description of your service offerings and expertise..."
                    rows="5"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={serviceData.category}
                    onChange={handleServiceChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Service Type *
                  </label>
                  <select
                    name="service_type"
                    value={serviceData.service_type}
                    onChange={handleServiceChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="consulting">Consulting</option>
                    <option value="implementation">Implementation</option>
                    <option value="training">Training</option>
                    <option value="support">Support & Maintenance</option>
                    <option value="audit">Audit & Assessment</option>
                    <option value="custom">Custom Development</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Deliverables *
                  </label>
                  <textarea
                    name="deliverables"
                    value={serviceData.deliverables}
                    onChange={handleServiceChange}
                    required
                    placeholder="What will clients receive? (e.g., Risk Assessment Report, Implementation Roadmap, Training Materials)"
                    rows="3"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Pricing Model *
                  </label>
                  <select
                    name="pricing_model"
                    value={serviceData.pricing_model}
                    onChange={handleServiceChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="project">Project-based</option>
                    <option value="retainer">Monthly Retainer</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="daily">Daily Rate</option>
                    <option value="custom">Custom Pricing</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Pricing Description *
                  </label>
                  <input
                    type="text"
                    name="pricing_description"
                    value={serviceData.pricing_description}
                    onChange={handleServiceChange}
                    required
                    placeholder="e.g., Starting from $50,000"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                    Case Studies URL
                  </label>
                  <input
                    type="url"
                    name="case_studies_url"
                    value={serviceData.case_studies_url}
                    onChange={handleServiceChange}
                    placeholder="https://yourfirm.com/case-studies"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="consultation_available"
                    name="consultation_available"
                    checked={serviceData.consultation_available}
                    onChange={handleServiceChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="consultation_available" style={{ fontWeight: 'bold', color: '#333' }}>
                    Free Consultation Available
                  </label>
                </div>
              </div>

              {/* Service Metadata */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Service Tags & Metadata</h3>
                {serviceMetadata.map((meta, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Key (e.g., expertise)"
                      value={meta.key}
                      onChange={(e) => handleServiceMetadataChange(index, 'key', e.target.value)}
                      style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Risk Management)"
                      value={meta.value}
                      onChange={(e) => handleServiceMetadataChange(index, 'value', e.target.value)}
                      style={{ flex: 2, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveServiceMetadata(index)}
                      className="button"
                      style={{ backgroundColor: '#f44336', color: 'white' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddServiceMetadata} className="button">
                  + Add Metadata
                </button>
              </div>
            </fieldset>
          )}

          {/* Product Section */}
          {!isServiceListing && (
            <fieldset style={{ padding: '1.5rem', border: '2px solid #e0e0e0', borderRadius: '6px' }}>
              <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a2e', padding: '0 0.5rem' }}>
                Product Information
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleProductChange}
                  required
                  placeholder="e.g., Risk Dashboard Pro"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Short Description *
                </label>
                <textarea
                  name="short_description"
                  value={productData.short_description}
                  onChange={handleProductChange}
                  required
                  placeholder="Brief summary for product listings (max 500 chars)"
                  maxLength="500"
                  rows="2"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <small style={{ color: '#999' }}>{productData.short_description.length}/500</small>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  required
                  placeholder="Detailed description of your product features and benefits..."
                  rows="5"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleProductChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select a category...</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Pricing Model *
                </label>
                <select
                  name="pricing_model"
                  value={productData.pricing_model}
                  onChange={handleProductChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="subscription">Subscription</option>
                  <option value="one_time">One-Time License</option>
                  <option value="usage_based">Usage-Based</option>
                  <option value="custom">Custom Pricing</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Pricing Details
                </label>
                <textarea
                  name="pricing_description"
                  value={productData.pricing_description}
                  onChange={handleProductChange}
                  placeholder="e.g., Starting at $99/month for up to 10 users..."
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Features/Capabilities *
                </label>
                <textarea
                  name="features"
                  value={productData.features}
                  onChange={handleProductChange}
                  required
                  placeholder="List key features (comma-separated or one per line)"
                  rows="4"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Documentation URL
                </label>
                <input
                  type="url"
                  name="documentation_url"
                  value={productData.documentation_url}
                  onChange={handleProductChange}
                  placeholder="https://docs.yourproduct.com"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="demo_available"
                  name="demo_available"
                  checked={productData.demo_available}
                  onChange={handleProductChange}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="demo_available" style={{ fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
                  Demo Available
                </label>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Product Photo / Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                {productImagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={productImagePreview}
                      alt="Selected product screenshot"
                      style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </fieldset>
          )}

          {/* Metadata Section */}
          {!isServiceListing && (
          <fieldset style={{ padding: '1.5rem', border: '2px solid #e0e0e0', borderRadius: '6px' }}>
            <legend style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a2e', padding: '0 0.5rem' }}>
              Product Tags (Optional)
            </legend>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {metadata.map((meta, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                      Tag Key
                    </label>
                    <input
                      type="text"
                      value={meta.key}
                      onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                      placeholder="e.g., industry, compliance_type"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                      Tag Value
                    </label>
                    <input
                      type="text"
                      value={meta.value}
                      onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                      placeholder="e.g., Banking, AML"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetadata(index)}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#ff5252',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddMetadata}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                + Add Tag
              </button>
            </div>
          </fieldset>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            {!vendorId && (
              <button
                type="button"
                onClick={handleToggleMode}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#757575',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                {showProductOnly ? 'List Firm + Product + Service' : 'Product Only'}
              </button>
            )}
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              {isServiceListing ? 'Submit Service' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
