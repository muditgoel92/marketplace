# Financial Products Marketplace

A scalable web marketplace for listing financial products from vendors, with search capabilities, vendor and thematic consolidations, and demo arrangement functionality.

## 🚀 Features

- **Product Listings**: Browse and search financial products from multiple vendors
- **Category Organization**: Products organized by predefined themes (Risk, Compliance, Trading, etc.)
- **Vendor Profiles**: Detailed vendor information, ratings, and all their products
- **Search & Filtering**: Advanced search with keyword, category, and pricing model filters
- **Demo Requests**: Contact vendors to arrange product demos
- **Reviews & Ratings**: User reviews for products and vendors
- **Responsive Design**: Fully responsive UI optimized for mobile users
- **Admin Dashboard**: Manage vendors, products, categories, and reviews

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 6.0 with Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production-ready)
- **Features**: User authentication, role-based access, comprehensive API

### Frontend
- **Framework**: React 18 with React Router
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios for API communication
- **UI**: Material-UI compatible components

## 📋 Project Structure

```
marketplace/
├── backend/
│   ├── marketplace_backend/      # Main Django project
│   │   ├── settings.py           # Project settings
│   │   ├── urls.py               # Main URL configuration
│   │   └── wsgi.py               # WSGI configuration
│   ├── products/                 # Products Django app
│   │   ├── models.py             # Database models
│   │   ├── serializers.py        # REST API serializers
│   │   ├── views.py              # API viewsets
│   │   ├── urls.py               # App URL configuration
│   │   ├── admin.py              # Admin configuration
│   │   └── management/commands/  # Management commands
│   ├── manage.py                 # Django management script
│   ├── requirements.txt          # Python dependencies
│   ├── venv/                     # Virtual environment
│   └── db.sqlite3                # SQLite database
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML entry point
│   ├── src/
│   │   ├── App.js                # Main App component
│   │   ├── App.css               # Main styles
│   │   ├── index.js              # React entry point
│   │   └── pages/                # Page components
│   │       ├── Home.js
│   │       ├── Products.js
│   │       ├── VendorDetail.js
│   │       └── CategoryDetail.js
│   ├── package.json              # Node dependencies
│   └── node_modules/             # Node packages
├── plan.md                       # Project plan
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ with pip
- Node.js 14+ with npm
- Git

### Backend Setup

1. **Navigate to project root**:
   ```bash
   cd C:\Users\mudit\OneDrive\Desktop\Marketplace
   ```

2. **Activate virtual environment**:
   ```bash
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Load sample data**:
   ```bash
   python manage.py load_sample_data
   ```

6. **Create superuser** (if not already created):
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django development server**:
   ```bash
   python manage.py runserver
   ```

   The API will be available at: `http://localhost:8000/api/`
   Admin panel: `http://localhost:8000/admin/`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```

   The app will open at: `http://localhost:3000/`

## 📚 API Endpoints

### Products
- `GET /api/products/` - List all products with pagination
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create new product (admin)
- `PUT /api/products/{id}/` - Update product (admin)
- `DELETE /api/products/{id}/` - Delete product (admin)

### Vendors
- `GET /api/vendors/` - List all vendors
- `GET /api/vendors/{id}/` - Get vendor details
- `POST /api/vendors/` - Create new vendor (admin)

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get category details

### Reviews
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create new review

### Demo Requests
- `GET /api/demo-requests/` - List demo requests
- `POST /api/demo-requests/` - Submit demo request

## 🔍 Search & Filtering

### Product Search
```
GET /api/products/?search=AML
GET /api/products/?category=1
GET /api/products/?pricing_model=subscription
GET /api/products/?demo_available=true
```

### Combined Filters
```
GET /api/products/?search=compliance&category=2&pricing_model=custom
```

## 🗄️ Database Models

### Vendor
- name, description, website, email, phone
- logo, founded_year, employees, locations
- rating, created_at, updated_at

### Category
- name, description, icon

### Product
- vendor (FK), name, description, short_description
- category (FK), features, pricing_model, pricing_description
- image, demo_available, documentation_url
- rating, review_count, created_at, updated_at

### ProductMetadata
- product (FK), key, value (for tagging)

### Review
- product (FK), vendor (FK), author, company
- rating, title, content, verified, created_at

### DemoRequest
- product (FK), first_name, last_name, email, phone
- company, message, status, preferred_date, created_at, updated_at

## 🎯 Current Sample Data

The marketplace is pre-populated with products from **Solytics Partners**:
- SAMS (AML/Compliance)
- Nimbus Uno (Risk Management)
- MRM Ecosystem (Multi-Risk Management)
- NIMBUS DataVerity (Data Analytics)
- Trade Surveillance
- AI Governance
- Risk Assessment Vault
- SAMS Adverse Media Screening
- SAMS Database

## 🔐 Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` with your superuser credentials to:
- Manage vendors and products
- Review user submissions
- Manage categories and metadata
- View demo requests

## 🔄 API Response Format

### Success Response
```json
{
  "id": 1,
  "name": "Product Name",
  "vendor": {
    "id": 1,
    "name": "Vendor Name"
  },
  "rating": 4.5,
  "created_at": "2026-05-08T10:00:00Z"
}
```

### List Response with Pagination
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [...]
}
```

## 📱 Responsive Design

The marketplace is optimized for:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1200px and up)

## 🚀 Deployment

### For Production

1. **Build frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Collect static files** (Django):
   ```bash
   python manage.py collectstatic
   ```

3. **Use PostgreSQL** instead of SQLite in `settings.py`

4. **Set DEBUG=False** in `settings.py`

5. **Deploy to cloud** (AWS, Heroku, DigitalOcean, etc.)

## 🤝 Contributing

To add new features:

1. Create a new branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📋 Next Steps (Future Development)

- [ ] User authentication and role management
- [ ] Demo request email notifications
- [ ] Advanced analytics dashboard
- [ ] Payment integration for licensing
- [ ] Mobile app (React Native)
- [ ] WebSocket for real-time updates
- [ ] Full-text search with Elasticsearch
- [ ] Machine learning recommendations

## 🐛 Troubleshooting

### Port already in use
- Django: `python manage.py runserver 8001`
- React: `PORT=3001 npm start`

### CORS errors
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL in `settings.py`

### Database errors
- Reset database: `python manage.py migrate --run-syncdb`

## 📞 Support

For issues or questions, check the Django admin panel or review the API documentation at `/api/`.

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated**: May 8, 2026
**Status**: Development (MVP Phase)
