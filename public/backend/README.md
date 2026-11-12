# Nirman360 Backend API

A comprehensive backend system for the Nirman360 construction equipment rental platform.

## 🚀 Features

- **User Management**: Equipment providers, material sellers, and contractors
- **Equipment Listings**: Complete CRUD operations for construction equipment
- **Material Listings**: Construction material marketplace functionality
- **Booking System**: Equipment and material booking management
- **Service Areas**: Bangalore-specific location management
- **SQLite Database**: Lightweight, file-based database
- **RESTful API**: Clean, documented API endpoints
- **Security**: JWT authentication, rate limiting, CORS protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SQLite3

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 🗄️ Database Structure

### Tables

#### `users`
- User information for all platform users
- Types: equipment_provider, material_seller, contractor

#### `equipment`
- Construction equipment listings
- Pricing, availability, specifications

#### `materials`
- Construction material listings
- Pricing, quantity, delivery options

#### `bookings`
- Equipment and material bookings
- Status tracking and payment management

#### `reviews`
- User reviews and ratings
- Quality control system

#### `service_areas`
- Bangalore service areas
- Demand levels and statistics

## 📡 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `GET /api/users` - Get all users (admin only)

### Equipment
- `POST /api/equipment/list` - List new equipment
- `GET /api/equipment` - Get all equipment with filters
- `GET /api/equipment/:id` - Get specific equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Materials
- `POST /api/materials/list` - List new materials
- `GET /api/materials` - Get all materials with filters
- `GET /api/materials/:id` - Get specific material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id` - Update booking status

### Service Areas
- `GET /api/service-areas` - Get all service areas
- `POST /api/service-areas` - Add new service area

### Dashboard
- `GET /api/dashboard/stats` - Get platform statistics

## 🔧 API Usage Examples

### List Equipment
```javascript
fetch('http://localhost:3000/api/equipment/list', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        provider_name: 'John Doe',
        phone: '+91 98765 43210',
        email: 'john@example.com',
        company_name: 'ABC Construction',
        equipment_type: 'jcb',
        brand_model: 'JCB 3DX',
        hourly_rate: 500,
        daily_rate: 3000,
        service_area: 'Whitefield'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Get Equipment with Filters
```javascript
fetch('http://localhost:3000/api/equipment?service_area=Whitefield&equipment_type=jcb')
.then(response => response.json())
.then(data => console.log(data));
```

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Data sanitization
- **SQL Injection Prevention**: Parameterized queries

## 📊 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    company_name TEXT,
    user_type TEXT NOT NULL,
    address TEXT,
    service_area TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
);

-- Equipment Table
CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    equipment_type TEXT NOT NULL,
    brand_model TEXT NOT NULL,
    hourly_rate REAL,
    daily_rate REAL,
    availability_status TEXT DEFAULT 'available',
    service_area TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users (id)
);
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your_super_secret_key
   PORT=3000
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Process Manager (Optional)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "nirman360-api"
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT signing key | nirman360_secret_key |
| EMAIL_HOST | SMTP server | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email username | - |
| EMAIL_PASS | Email password | - |

## 🧪 Testing

```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📞 API Documentation

Visit `http://localhost:3000` for complete API documentation.

## 🔍 Monitoring

- **Logs**: Console output with timestamps
- **Database**: SQLite file (nirman360.db)
- **Performance**: Built-in rate limiting
- **Errors**: Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@nirman360.com
- Phone: +91 80XXXXXXX
- Issues: GitHub Issues

---

**Built with ❤️ for Bangalore's Construction Industry**
