import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Categories({ categories }) {
  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Categories</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Browse marketplace categories across products and professional services.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="loader" style={{ minHeight: 'auto', padding: '2rem 0' }}>No categories found.</div>
      ) : (
        <div className="grid grid-3">
          {categories.map(category => (
            <Link key={category.id} to={`/categories/${category.id}`} className="card" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {category.icon || 'Category'}
              </div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>{category.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{category.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
