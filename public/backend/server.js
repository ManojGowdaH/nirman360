const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'file://'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const db = new sqlite3.Database('./nirman360.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create tables in the correct order to handle foreign key constraints
    
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        company_name TEXT,
        user_type TEXT NOT NULL CHECK (user_type IN ('equipment_provider', 'material_seller', 'contractor')),
        password TEXT,
        address TEXT,
        service_area TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'))
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
            return;
        }
        
        // Service areas table (create after users)
        db.run(`CREATE TABLE IF NOT EXISTS service_areas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            demand_level TEXT DEFAULT 'medium' CHECK (demand_level IN ('low', 'medium', 'high')),
            equipment_count INTEGER DEFAULT 0,
            active_projects INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active'
        )`, (err) => {
            if (err) {
                console.error('Error creating service_areas table:', err.message);
                return;
            }
            
            // Equipment table
            db.run(`CREATE TABLE IF NOT EXISTS equipment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                provider_id INTEGER NOT NULL,
                equipment_type TEXT NOT NULL,
                brand_model TEXT NOT NULL,
                year_of_manufacture INTEGER,
                working_condition TEXT CHECK (working_condition IN ('excellent', 'good', 'fair')),
                description TEXT,
                hourly_rate REAL,
                daily_rate REAL,
                monthly_rate REAL,
                availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'maintenance')),
                service_area TEXT NOT NULL,
                address TEXT,
                images TEXT,
                specifications TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active',
                FOREIGN KEY (provider_id) REFERENCES users (id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating equipment table:', err.message);
                    return;
                }
                
                // Materials table
                db.run(`CREATE TABLE IF NOT EXISTS materials (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    seller_id INTEGER NOT NULL,
                    material_type TEXT NOT NULL,
                    brand_grade TEXT NOT NULL,
                    available_quantity TEXT NOT NULL,
                    unit_price REAL NOT NULL,
                    description TEXT,
                    service_area TEXT NOT NULL,
                    address TEXT,
                    delivery_available BOOLEAN DEFAULT 0,
                    pickup_available BOOLEAN DEFAULT 0,
                    delivery_charges TEXT,
                    images TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'active',
                    FOREIGN KEY (seller_id) REFERENCES users (id)
                )`, (err) => {
                    if (err) {
                        console.error('Error creating materials table:', err.message);
                        return;
                    }
                    
                    // Bookings table
                    db.run(`CREATE TABLE IF NOT EXISTS bookings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        equipment_id INTEGER,
                        material_id INTEGER,
                        booking_type TEXT NOT NULL CHECK (booking_type IN ('equipment', 'material')),
                        start_date DATE NOT NULL,
                        end_date DATE NOT NULL,
                        total_amount REAL NOT NULL,
                        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
                        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
                        special_requirements TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id),
                        FOREIGN KEY (equipment_id) REFERENCES equipment (id),
                        FOREIGN KEY (material_id) REFERENCES materials (id)
                    )`, (err) => {
                        if (err) {
                            console.error('Error creating bookings table:', err.message);
                            return;
                        }
                        
                        // Reviews table
                        db.run(`CREATE TABLE IF NOT EXISTS reviews (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            booking_id INTEGER NOT NULL,
                            reviewer_id INTEGER NOT NULL,
                            provider_id INTEGER NOT NULL,
                            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                            review_text TEXT,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (booking_id) REFERENCES bookings (id),
                            FOREIGN KEY (reviewer_id) REFERENCES users (id),
                            FOREIGN KEY (provider_id) REFERENCES users (id)
                        )`, (err) => {
                            if (err) {
                                console.error('Error creating reviews table:', err.message);
                                return;
                            }
                            
                            // Now insert service areas after all tables are created
                            insertServiceAreas();
                        });
                    });
                });
            });
        });
    });
}

// Insert service areas function
function insertServiceAreas() {
    const serviceAreas = [
        { name: 'Whitefield', description: 'IT corridor growth', demand_level: 'high' },
        { name: 'Sarjapur Road', description: 'Apartment boom', demand_level: 'high' },
        { name: 'Electronic City', description: 'Industrial + residential', demand_level: 'medium' },
        { name: 'Hebbal', description: 'Infrastructure projects', demand_level: 'high' },
        { name: 'Devanahalli', description: 'Airport expansion', demand_level: 'medium' },
        { name: 'HSR Layout', description: 'Commercial development', demand_level: 'medium' }
    ];

    let insertedCount = 0;
    const totalAreas = serviceAreas.length;

    serviceAreas.forEach((area, index) => {
        db.run(`INSERT OR IGNORE INTO service_areas (name, description, demand_level) VALUES (?, ?, ?)`,
            [area.name, area.description, area.demand_level],
            function(err) {
                if (err) {
                    console.error(`Error inserting service area ${area.name}:`, err.message);
                } else {
                    insertedCount++;
                    if (this.changes > 0) {
                        console.log(`✅ Inserted service area: ${area.name}`);
                    }
                }
                
                // Check if all areas have been processed
                if (insertedCount === totalAreas) {
                    console.log('✅ Database tables initialized successfully');
                    console.log('✅ Service areas populated successfully');
                }
            }
        );
    });
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'nirman360_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        req.userType = decoded.userType;
        next();
    });
}

// API Routes

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Nirman360 Backend API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            equipment: '/api/equipment',
            materials: '/api/materials',
            bookings: '/api/bookings',
            'service-areas': '/api/service-areas'
        }
    });
});

// User Registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, phone, email, company_name, user_type, address, service_area } = req.body;

        // Check if user already exists
        db.get('SELECT id FROM users WHERE phone = ? OR email = ?', [phone, email], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'User already exists with this phone or email' });
            }

            // Insert new user
            db.run(`INSERT INTO users (name, phone, email, company_name, user_type, address, service_area) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, phone, email, company_name, user_type, address, service_area],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to register user' });
                    }

                    res.status(201).json({
                        message: 'User registered successfully',
                        user_id: this.lastID
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Equipment Listing Submission
app.post('/api/equipment/list', (req, res) => {
    try {
        const {
            provider_name,
            phone,
            email,
            company_name,
            equipment_type,
            brand_model,
            year_of_manufacture,
            working_condition,
            description,
            hourly_rate,
            daily_rate,
            monthly_rate,
            availability_status,
            service_area,
            address
        } = req.body;

        // First, register or find the provider
        db.get('SELECT id FROM users WHERE phone = ?', [phone], (err, userRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            let providerId;
            
            if (userRow) {
                providerId = userRow.id;
                insertEquipment();
            } else {
                // Create new user
                db.run(`INSERT INTO users (name, phone, email, company_name, user_type, address, service_area) 
                        VALUES (?, ?, ?, ?, 'equipment_provider', ?, ?)`,
                    [provider_name, phone, email, company_name, address, service_area],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create provider' });
                        }
                        providerId = this.lastID;
                        insertEquipment();
                    }
                );
            }

            function insertEquipment() {
                db.run(`INSERT INTO equipment (provider_id, equipment_type, brand_model, year_of_manufacture, 
                        working_condition, description, hourly_rate, daily_rate, monthly_rate, 
                        availability_status, service_area, address) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [providerId, equipment_type, brand_model, year_of_manufacture, working_condition,
                     description, hourly_rate, daily_rate, monthly_rate, availability_status, service_area, address],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to list equipment' });
                        }

                        res.status(201).json({
                            message: 'Equipment listed successfully',
                            equipment_id: this.lastID,
                            provider_id: providerId
                        });
                    }
                );
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Material Listing Submission
app.post('/api/materials/list', (req, res) => {
    try {
        const {
            seller_name,
            phone,
            email,
            company_name,
            material_type,
            brand_grade,
            available_quantity,
            unit_price,
            description,
            service_area,
            address,
            delivery_available,
            pickup_available,
            delivery_charges
        } = req.body;

        // First, register or find the seller
        db.get('SELECT id FROM users WHERE phone = ?', [phone], (err, userRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            let sellerId;
            
            if (userRow) {
                sellerId = userRow.id;
                insertMaterial();
            } else {
                // Create new user
                db.run(`INSERT INTO users (name, phone, email, company_name, user_type, address, service_area) 
                        VALUES (?, ?, ?, ?, 'material_seller', ?, ?)`,
                    [seller_name, phone, email, company_name, address, service_area],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create seller' });
                        }
                        sellerId = this.lastID;
                        insertMaterial();
                    }
                );
            }

            function insertMaterial() {
                db.run(`INSERT INTO materials (seller_id, material_type, brand_grade, available_quantity, 
                        unit_price, description, service_area, address, delivery_available, pickup_available, delivery_charges) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [sellerId, material_type, brand_grade, available_quantity, unit_price,
                     description, service_area, address, delivery_available, pickup_available, delivery_charges],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to list material' });
                        }

                        res.status(201).json({
                            message: 'Material listed successfully',
                            material_id: this.lastID,
                            seller_id: sellerId
                        });
                    }
                );
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all equipment
app.get('/api/equipment', (req, res) => {
    const { service_area, equipment_type, min_price, max_price } = req.query;
    
    let query = `
        SELECT e.*, u.name as provider_name, u.phone as provider_phone, u.company_name 
        FROM equipment e 
        JOIN users u ON e.provider_id = u.id 
        WHERE e.status = 'active'
    `;
    
    const params = [];
    
    if (service_area) {
        query += ' AND e.service_area = ?';
        params.push(service_area);
    }
    
    if (equipment_type) {
        query += ' AND e.equipment_type = ?';
        params.push(equipment_type);
    }
    
    if (min_price) {
        query += ' AND e.daily_rate >= ?';
        params.push(min_price);
    }
    
    if (max_price) {
        query += ' AND e.daily_rate <= ?';
        params.push(max_price);
    }
    
    query += ' ORDER BY e.created_at DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(rows);
    });
});

// Get all materials
app.get('/api/materials', (req, res) => {
    const { service_area, material_type, min_price, max_price } = req.query;
    
    let query = `
        SELECT m.*, u.name as seller_name, u.phone as seller_phone, u.company_name 
        FROM materials m 
        JOIN users u ON m.seller_id = u.id 
        WHERE m.status = 'active'
    `;
    
    const params = [];
    
    if (service_area) {
        query += ' AND m.service_area = ?';
        params.push(service_area);
    }
    
    if (material_type) {
        query += ' AND m.material_type = ?';
        params.push(material_type);
    }
    
    if (min_price) {
        query += ' AND m.unit_price >= ?';
        params.push(min_price);
    }
    
    if (max_price) {
        query += ' AND m.unit_price <= ?';
        params.push(max_price);
    }
    
    query += ' ORDER BY m.created_at DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(rows);
    });
});

// Get service areas
app.get('/api/service-areas', (req, res) => {
    db.all('SELECT * FROM service_areas WHERE status = "active" ORDER BY name', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(rows);
    });
});

// Get dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
    const stats = {};
    
    // Equipment count
    db.get('SELECT COUNT(*) as count FROM equipment WHERE status = "active"', (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.equipment_count = row.count;
        
        // Material count
        db.get('SELECT COUNT(*) as count FROM materials WHERE status = "active"', (err, row) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            stats.material_count = row.count;
            
            // Provider count
            db.get('SELECT COUNT(*) as count FROM users WHERE user_type = "equipment_provider" AND status = "active"', (err, row) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                stats.provider_count = row.count;
                
                // Seller count
                db.get('SELECT COUNT(*) as count FROM users WHERE user_type = "material_seller" AND status = "active"', (err, row) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    stats.seller_count = row.count;
                    
                    res.json(stats);
                });
            });
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Nirman360 Backend Server running on port ${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}/`);
    console.log(`🗄️  Database: SQLite (nirman360.db)`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});
