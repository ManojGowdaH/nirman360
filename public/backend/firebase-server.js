const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

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

// Firebase Admin SDK Initialization
const serviceAccount = {
  "type": "service_account",
  "project_id": "nirman360-backend",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-nirman360@nirman360-backend.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nirman360%40nirman360-backend.iam.gserviceaccount.com"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nirman360-backend-default-rtdb.firebaseio.com"
});

// Get Firestore and Auth references
const db = admin.firestore();
const auth = admin.auth();

console.log('🔥 Connected to Firebase Firestore');

// Initialize Firebase collections
async function initializeFirebaseCollections() {
  try {
    // Create service areas collection
    const serviceAreasRef = db.collection('service_areas');
    const serviceAreas = [
      { 
        name: 'Whitefield', 
        description: 'IT corridor growth', 
        demand_level: 'high',
        equipment_count: 120,
        active_projects: 45,
        status: 'active'
      },
      { 
        name: 'Sarjapur Road', 
        description: 'Apartment boom', 
        demand_level: 'high',
        equipment_count: 95,
        active_projects: 38,
        status: 'active'
      },
      { 
        name: 'Electronic City', 
        description: 'Industrial + residential', 
        demand_level: 'medium',
        equipment_count: 85,
        active_projects: 32,
        status: 'active'
      },
      { 
        name: 'Hebbal', 
        description: 'Infrastructure projects', 
        demand_level: 'high',
        equipment_count: 75,
        active_projects: 28,
        status: 'active'
      },
      { 
        name: 'Devanahalli', 
        description: 'Airport expansion', 
        demand_level: 'medium',
        equipment_count: 60,
        active_projects: 25,
        status: 'active'
      },
      { 
        name: 'HSR Layout', 
        description: 'Commercial development', 
        demand_level: 'medium',
        equipment_count: 65,
        active_projects: 22,
        status: 'active'
      }
    ];

    // Check if service areas already exist
    const snapshot = await serviceAreasRef.limit(1).get();
    if (snapshot.empty) {
      // Insert service areas
      for (const area of serviceAreas) {
        await serviceAreasRef.add(area);
        console.log(`✅ Added service area: ${area.name}`);
      }
    }

    console.log('✅ Firebase collections initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
  }
}

// Initialize collections on startup
initializeFirebaseCollections();

// Middleware to verify JWT token
async function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.userId = decodedToken.uid;
        req.userEmail = decodedToken.email;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Failed to authenticate token' });
    }
}

// API Routes

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Nirman360 Firebase Backend API',
        version: '1.0.0',
        database: 'Firebase Firestore',
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
        const usersRef = db.collection('users');
        const phoneSnapshot = await usersRef.where('phone', '==', phone).get();
        const emailSnapshot = await usersRef.where('email', '==', email).get();

        if (!phoneSnapshot.empty || !emailSnapshot.empty) {
            return res.status(400).json({ error: 'User already exists with this phone or email' });
        }

        // Create user document
        const userDoc = {
            name,
            phone,
            email,
            company_name,
            user_type,
            address,
            service_area,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active'
        };

        const docRef = await usersRef.add(userDoc);

        res.status(201).json({
            message: 'User registered successfully',
            user_id: docRef.id
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Equipment Listing Submission
app.post('/api/equipment/list', async (req, res) => {
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

        // Check if provider exists
        const usersRef = db.collection('users');
        const providerSnapshot = await usersRef.where('phone', '==', phone).get();

        let providerId;
        
        if (providerSnapshot.empty) {
            // Create new provider
            const providerDoc = {
                name: provider_name,
                phone,
                email,
                company_name,
                user_type: 'equipment_provider',
                address,
                service_area,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                updated_at: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            };

            const providerRef = await usersRef.add(providerDoc);
            providerId = providerRef.id;
        } else {
            providerId = providerSnapshot.docs[0].id;
        }

        // Create equipment document
        const equipmentDoc = {
            provider_id: providerId,
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
            address,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active'
        };

        const equipmentRef = await db.collection('equipment').add(equipmentDoc);

        res.status(201).json({
            message: 'Equipment listed successfully',
            equipment_id: equipmentRef.id,
            provider_id: providerId
        });
    } catch (error) {
        console.error('Error listing equipment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Material Listing Submission
app.post('/api/materials/list', async (req, res) => {
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

        // Check if seller exists
        const usersRef = db.collection('users');
        const sellerSnapshot = await usersRef.where('phone', '==', phone).get();

        let sellerId;
        
        if (sellerSnapshot.empty) {
            // Create new seller
            const sellerDoc = {
                name: seller_name,
                phone,
                email,
                company_name,
                user_type: 'material_seller',
                address,
                service_area,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                updated_at: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            };

            const sellerRef = await usersRef.add(sellerDoc);
            sellerId = sellerRef.id;
        } else {
            sellerId = sellerSnapshot.docs[0].id;
        }

        // Create material document
        const materialDoc = {
            seller_id: sellerId,
            material_type,
            brand_grade,
            available_quantity,
            unit_price,
            description,
            service_area,
            address,
            delivery_available,
            pickup_available,
            delivery_charges,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active'
        };

        const materialRef = await db.collection('materials').add(materialDoc);

        res.status(201).json({
            message: 'Material listed successfully',
            material_id: materialRef.id,
            seller_id: sellerId
        });
    } catch (error) {
        console.error('Error listing material:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all equipment
app.get('/api/equipment', async (req, res) => {
    try {
        const { service_area, equipment_type, min_price, max_price } = req.query;
        
        let query = db.collection('equipment').where('status', '==', 'active');
        
        if (service_area) {
            query = query.where('service_area', '==', service_area);
        }
        
        if (equipment_type) {
            query = query.where('equipment_type', '==', equipment_type);
        }
        
        if (min_price) {
            query = query.where('daily_rate', '>=', parseFloat(min_price));
        }
        
        if (max_price) {
            query = query.where('daily_rate', '<=', parseFloat(max_price));
        }
        
        const snapshot = await query.orderBy('created_at', 'desc').get();
        
        const equipment = [];
        for (const doc of snapshot.docs) {
            const equipmentData = doc.data();
            
            // Get provider information
            const providerDoc = await db.collection('users').doc(equipmentData.provider_id).get();
            const providerData = providerDoc.exists ? providerDoc.data() : {};
            
            equipment.push({
                id: doc.id,
                ...equipmentData,
                provider_name: providerData.name || 'Unknown',
                provider_phone: providerData.phone || 'Unknown',
                company_name: providerData.company_name || 'Unknown'
            });
        }
        
        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all materials
app.get('/api/materials', async (req, res) => {
    try {
        const { service_area, material_type, min_price, max_price } = req.query;
        
        let query = db.collection('materials').where('status', '==', 'active');
        
        if (service_area) {
            query = query.where('service_area', '==', service_area);
        }
        
        if (material_type) {
            query = query.where('material_type', '==', material_type);
        }
        
        if (min_price) {
            query = query.where('unit_price', '>=', parseFloat(min_price));
        }
        
        if (max_price) {
            query = query.where('unit_price', '<=', parseFloat(max_price));
        }
        
        const snapshot = await query.orderBy('created_at', 'desc').get();
        
        const materials = [];
        for (const doc of snapshot.docs) {
            const materialData = doc.data();
            
            // Get seller information
            const sellerDoc = await db.collection('users').doc(materialData.seller_id).get();
            const sellerData = sellerDoc.exists ? sellerDoc.data() : {};
            
            materials.push({
                id: doc.id,
                ...materialData,
                seller_name: sellerData.name || 'Unknown',
                seller_phone: sellerData.phone || 'Unknown',
                company_name: sellerData.company_name || 'Unknown'
            });
        }
        
        res.json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get service areas
app.get('/api/service-areas', async (req, res) => {
    try {
        const snapshot = await db.collection('service_areas')
            .where('status', '==', 'active')
            .orderBy('name')
            .get();
        
        const serviceAreas = [];
        snapshot.forEach(doc => {
            serviceAreas.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        res.json(serviceAreas);
    } catch (error) {
        console.error('Error fetching service areas:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const stats = {};
        
        // Equipment count
        const equipmentSnapshot = await db.collection('equipment')
            .where('status', '==', 'active')
            .get();
        stats.equipment_count = equipmentSnapshot.size;
        
        // Material count
        const materialSnapshot = await db.collection('materials')
            .where('status', '==', 'active')
            .get();
        stats.material_count = materialSnapshot.size;
        
        // Provider count
        const providerSnapshot = await db.collection('users')
            .where('user_type', '==', 'equipment_provider')
            .where('status', '==', 'active')
            .get();
        stats.provider_count = providerSnapshot.size;
        
        // Seller count
        const sellerSnapshot = await db.collection('users')
            .where('user_type', '==', 'material_seller')
            .where('status', '==', 'active')
            .get();
        stats.seller_count = sellerSnapshot.size;
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Database error' });
    }
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
    console.log(`🚀 Nirman360 Firebase Backend Server running on port ${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}/`);
    console.log(`🔥 Database: Firebase Firestore`);
    console.log(`📱 Firebase Auth: Enabled`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down gracefully...');
    process.exit(0);
});
