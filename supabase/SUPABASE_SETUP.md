# Supabase Setup for Nirman360 - Complete Guide 🚀

## 🎯 Option 1 (Easiest) — Frontend + Backend using Vercel + Supabase

### 🧩 STEP 1: Backend (Supabase)

#### ✅ Good news:
- No hosting needed ✅
- Already live in cloud 🌐
- Free tier available 💰

#### 📋 What you need:
- **SUPABASE_URL** - Your Supabase project URL
- **SUPABASE_ANON_KEY** - Your Supabase anonymous key

### 🔥 STEP 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up** with GitHub or Google
3. **Click "New Project"**
4. **Choose organization** or create new one
5. **Project name**: `nirman360`
6. **Database password**: Create a strong password
7. **Region**: Choose closest to your users (Singapore for Bangalore)
8. **Click "Create new project"**

### 🗄️ STEP 2: Setup Database

#### Run SQL in Supabase SQL Editor:

```sql
-- Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  company_name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('equipment_provider', 'material_seller', 'contractor')),
  address TEXT,
  service_area TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Table
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  brand_model TEXT NOT NULL,
  year_of_manufacture INTEGER,
  working_condition TEXT CHECK (working_condition IN ('excellent', 'good', 'fair')),
  description TEXT,
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'maintenance')),
  service_area TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials Table
CREATE TABLE materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  material_type TEXT NOT NULL,
  brand_grade TEXT NOT NULL,
  available_quantity TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  service_area TEXT NOT NULL,
  address TEXT,
  delivery_available BOOLEAN DEFAULT FALSE,
  pickup_available BOOLEAN DEFAULT FALSE,
  delivery_charges TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Areas Table
CREATE TABLE service_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  demand_level TEXT DEFAULT 'medium' CHECK (demand_level IN ('low', 'medium', 'high')),
  equipment_count INTEGER DEFAULT 0,
  active_projects INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Service Areas Data
INSERT INTO service_areas (name, description, demand_level, equipment_count, active_projects) VALUES
('Whitefield', 'IT corridor growth', 'high', 120, 45),
('Sarjapur Road', 'Apartment boom', 'high', 95, 38),
('Electronic City', 'Industrial + residential', 'medium', 85, 32),
('Hebbal', 'Infrastructure projects', 'high', 75, 28),
('Devanahalli', 'Airport expansion', 'medium', 60, 25),
('HSR Layout', 'Commercial development', 'medium', 65, 22);
```

### 🔑 STEP 3: Get Supabase Credentials

1. **Go to Project Settings** (⚙️ icon)
2. **API** section
3. **Copy** the following:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

### 🔒 STEP 4: Setup Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Anyone can read equipment and materials
CREATE POLICY "Equipment is viewable by everyone" ON equipment
  FOR SELECT USING (status = 'active');

CREATE POLICY "Materials are viewable by everyone" ON materials
  FOR SELECT USING (status = 'active');

-- Service areas are public
CREATE POLICY "Service areas are viewable by everyone" ON service_areas
  FOR SELECT USING (status = 'active');

-- Authenticated users can insert equipment/materials
CREATE POLICY "Authenticated users can insert equipment" ON equipment
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert materials" ON materials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 🌐 STEP 5: Frontend Deployment (Vercel)

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Deploy
vercel --prod
```

#### Option B: Using Vercel Website
1. **Go to [Vercel](https://vercel.com)**
2. **Click "New Project"**
3. **Import Git Repository** (or upload from local)
4. **Configure**:
   - Framework: **Other**
   - Build Command: `echo "No build needed"`
   - Output Directory: `.`
5. **Add Environment Variables**:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key
6. **Click "Deploy"**

### 🔗 STEP 6: Connect Frontend → Backend

#### Update your HTML file to include Supabase:

```html
<!-- Add this to your HTML head -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="supabase/frontend-integration.js"></script>
```

#### Update Supabase configuration in `frontend-integration.js`:

```javascript
// Replace with your actual values
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 🌍 STEP 7: Connect Custom Domain

#### In Vercel:
1. **Go to Project Settings**
2. **Domains** tab
3. **Add custom domain**
4. **Update DNS** with provided records

#### DNS Configuration:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 📱 STEP 8: Test Your Application

1. **Visit your Vercel URL**
2. **Test equipment listing form**
3. **Test material listing form**
4. **Check Supabase dashboard** for data

### 🎯 Benefits of Supabase

| Feature | Supabase | Firebase | SQLite |
|---------|----------|----------|--------|
| **Setup** | ✅ Easiest | 🔥 Medium | 📁 Local |
| **Hosting** | ✅ Included | 🔥 Included | 📁 Self-hosted |
| **Cost** | ✅ Free tier | 🔥 Free tier | 📁 Free |
| **SQL** | ✅ PostgreSQL | 🔥 NoSQL | 📁 SQLite |
| **Real-time** | ✅ Yes | 🔥 Yes | 📁 No |
| **Auth** | ✅ Built-in | 🔥 Built-in | 📁 Custom |
| **RLS** | ✅ Built-in | 🔥 Custom rules | 📁 None |

### 🚀 Quick Start Summary

1. **Create Supabase project** (2 minutes)
2. **Run SQL setup** (1 minute)
3. **Copy credentials** (30 seconds)
4. **Deploy to Vercel** (3 minutes)
5. **Update frontend config** (1 minute)

**Total time: ~8 minutes** ⚡

### 🎉 You're Live! 

Your Nirman360 platform is now:
- ✅ **Hosted on Vercel** (global CDN)
- ✅ **Backend on Supabase** (PostgreSQL)
- ✅ **Real-time updates** (WebSocket)
- ✅ **Secure** (RLS policies)
- ✅ **Scalable** (auto-scaling)
- ✅ **Free tier** (no cost)

### 📞 Support

- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Issues**: Check browser console for errors

---

**🎯 Ready to scale Nirman360 with Supabase + Vercel!**
