# Firebase Backend Setup for Nirman360

## 🚀 Firebase Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Project name: `nirman360-backend`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services

#### Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

#### Authentication
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Click "Save"

### 3. Get Service Account Key

1. Go to Project Settings (⚙️ icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Select JSON format
5. Click "Generate key"
6. Download the JSON file

### 4. Update Firebase Configuration

Replace the service account configuration in `firebase-server.js` with your actual credentials:

```javascript
const serviceAccount = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  // ... rest of your service account JSON
};
```

### 5. Install Dependencies

```bash
cd backend
npm install --package-lock-path firebase-package.json
```

### 6. Start Firebase Server

```bash
npm run dev
```

## 🔥 Firebase vs SQLite Comparison

| Feature | SQLite | Firebase |
|---------|--------|----------|
| **Database** | Local file | Cloud-hosted |
| **Scalability** | Limited | Auto-scaling |
| **Real-time** | No | Yes |
| **Authentication** | Custom JWT | Firebase Auth |
| **Security** | Local rules | Firestore rules |
| **Backup** | Manual | Automatic |
| **Cost** | Free | Free tier available |

## 📊 Firebase Collections Structure

### Users Collection
```javascript
{
  name: "John Doe",
  phone: "+91 98765 43210",
  email: "john@example.com",
  company_name: "ABC Construction",
  user_type: "equipment_provider", // or "material_seller", "contractor"
  address: "123, Main Road, Bangalore",
  service_area: "Whitefield",
  created_at: timestamp,
  status: "active"
}
```

### Equipment Collection
```javascript
{
  provider_id: "user_document_id",
  equipment_type: "jcb",
  brand_model: "JCB 3DX",
  year_of_manufacture: 2020,
  working_condition: "excellent",
  description: "Well-maintained JCB for rent",
  hourly_rate: 500,
  daily_rate: 3000,
  monthly_rate: 45000,
  availability_status: "available",
  service_area: "Whitefield",
  address: "123, Main Road, Bangalore",
  created_at: timestamp,
  status: "active"
}
```

### Materials Collection
```javascript
{
  seller_id: "user_document_id",
  material_type: "cement",
  brand_grade: "ACC Cement 53 Grade",
  available_quantity: "500 bags",
  unit_price: 350,
  description: "High quality cement",
  service_area: "Whitefield",
  address: "123, Main Road, Bangalore",
  delivery_available: true,
  pickup_available: true,
  delivery_charges: "500 per trip",
  created_at: timestamp,
  status: "active"
}
```

### Service Areas Collection
```javascript
{
  name: "Whitefield",
  description: "IT corridor growth",
  demand_level: "high",
  equipment_count: 120,
  active_projects: 45,
  status: "active"
}
```

## 🔧 Firebase Emulator Setup (for Development)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

4. Start emulators:
```bash
firebase emulators:start
```

5. Update server to use emulator:
```javascript
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "http://localhost:8080"
});
```

## 🚀 Deployment Options

### Option 1: Firebase Functions
```bash
firebase deploy --only functions
```

### Option 2: Cloud Run
```bash
gcloud run deploy nirman360-api --image gcr.io/your-project/nirman360-api
```

### Option 3: Vercel/Heroku (with Firebase)
Deploy the Express server to any hosting platform while keeping Firebase as the database.

## 🔒 Firebase Security Rules

Create Firestore rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Equipment and materials are publicly readable but require auth to write
    match /equipment/{equipmentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /materials/{materialId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Service areas are publicly readable
    match /service_areas/{areaId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Firebase Authentication Integration

To use Firebase Authentication in the frontend:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in with custom token from backend
async function signIn(token) {
  try {
    const userCredential = await signInWithCustomToken(auth, token);
    console.log('Signed in:', userCredential.user);
  } catch (error) {
    console.error('Sign in error:', error);
  }
}
```

## 🎯 Benefits of Firebase

1. **Real-time Updates**: Equipment availability updates in real-time
2. **Scalability**: Handles millions of users without performance issues
3. **Security**: Built-in security rules and authentication
4. **Offline Support**: Automatic data synchronization
5. **Analytics**: Built-in Firebase Analytics
6. **Hosting**: Can also host your frontend with Firebase Hosting

## 🔄 Migration from SQLite

The API endpoints remain the same, so your frontend code doesn't need changes. Only the backend implementation changes from SQLite to Firebase.

**SQLite Query:**
```javascript
db.get('SELECT * FROM equipment WHERE service_area = ?', [area])
```

**Firebase Query:**
```javascript
db.collection('equipment').where('service_area', '==', area).get()
```

---

**Ready to scale Nirman360 with Firebase! 🔥**
