// Supabase Configuration for Nirman360
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = 'https://vlfucggnbkizkxkvzfux.supabase.co';
const supabaseAnonKey = 'sb_publishable_3XK1mz1LLVc7016pPUpgmQ_uk7CXWSr';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Schema Setup
const databaseSchema = `
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
  images TEXT[], -- Array of image URLs
  specifications JSONB, -- Equipment specifications
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
  images TEXT[], -- Array of image URLs
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('equipment', 'material')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
`;

// API Functions for Nirman360

class Nirman360API {
  constructor() {
    this.supabase = supabase;
  }

  // User Registration
  async registerUser(userData) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Equipment Listing
  async listEquipment(equipmentData) {
    try {
      // First check if provider exists
      const { data: existingProvider } = await this.supabase
        .from('users')
        .select('id')
        .eq('phone', equipmentData.phone)
        .single();

      let providerId;

      if (existingProvider) {
        providerId = existingProvider.id;
      } else {
        // Create new provider
        const providerData = {
          name: equipmentData.provider_name,
          phone: equipmentData.phone,
          email: equipmentData.email,
          company_name: equipmentData.company_name,
          user_type: 'equipment_provider',
          address: equipmentData.address,
          service_area: equipmentData.service_area
        };

        const { data: newProvider } = await this.supabase
          .from('users')
          .insert([providerData])
          .select()
          .single();

        providerId = newProvider.id;
      }

      // Create equipment listing
      const equipmentListing = {
        provider_id: providerId,
        equipment_type: equipmentData.equipment_type,
        brand_model: equipmentData.brand_model,
        year_of_manufacture: equipmentData.year_of_manufacture,
        working_condition: equipmentData.working_condition,
        description: equipmentData.description,
        hourly_rate: equipmentData.hourly_rate,
        daily_rate: equipmentData.daily_rate,
        monthly_rate: equipmentData.monthly_rate,
        availability_status: equipmentData.availability_status,
        service_area: equipmentData.service_area,
        address: equipmentData.address
      };

      const { data, error } = await this.supabase
        .from('equipment')
        .insert([equipmentListing])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Material Listing
  async listMaterial(materialData) {
    try {
      // First check if seller exists
      const { data: existingSeller } = await this.supabase
        .from('users')
        .select('id')
        .eq('phone', materialData.phone)
        .single();

      let sellerId;

      if (existingSeller) {
        sellerId = existingSeller.id;
      } else {
        // Create new seller
        const sellerData = {
          name: materialData.seller_name,
          phone: materialData.phone,
          email: materialData.email,
          company_name: materialData.company_name,
          user_type: 'material_seller',
          address: materialData.address,
          service_area: materialData.service_area
        };

        const { data: newSeller } = await this.supabase
          .from('users')
          .insert([sellerData])
          .select()
          .single();

        sellerId = newSeller.id;
      }

      // Create material listing
      const materialListing = {
        seller_id: sellerId,
        material_type: materialData.material_type,
        brand_grade: materialData.brand_grade,
        available_quantity: materialData.available_quantity,
        unit_price: materialData.unit_price,
        description: materialData.description,
        service_area: materialData.service_area,
        address: materialData.address,
        delivery_available: materialData.delivery_available,
        pickup_available: materialData.pickup_available,
        delivery_charges: materialData.delivery_charges
      };

      const { data, error } = await this.supabase
        .from('materials')
        .insert([materialListing])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get Equipment with Filters
  async getEquipment(filters = {}) {
    try {
      let query = this.supabase
        .from('equipment')
        .select(`
          *,
          users!equipment_provider_id_fkey (
            name,
            phone,
            company_name
          )
        `)
        .eq('status', 'active');

      // Apply filters
      if (filters.service_area) {
        query = query.eq('service_area', filters.service_area);
      }
      if (filters.equipment_type) {
        query = query.eq('equipment_type', filters.equipment_type);
      }
      if (filters.min_price) {
        query = query.gte('daily_rate', parseFloat(filters.min_price));
      }
      if (filters.max_price) {
        query = query.lte('daily_rate', parseFloat(filters.max_price));
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Format data to match frontend expectations
      const formattedData = data.map(item => ({
        id: item.id,
        ...item,
        provider_name: item.users?.name || 'Unknown',
        provider_phone: item.users?.phone || 'Unknown',
        company_name: item.users?.company_name || 'Unknown',
        users: undefined // Remove nested users object
      }));

      return { success: true, data: formattedData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get Materials with Filters
  async getMaterials(filters = {}) {
    try {
      let query = this.supabase
        .from('materials')
        .select(`
          *,
          users!material_seller_id_fkey (
            name,
            phone,
            company_name
          )
        `)
        .eq('status', 'active');

      // Apply filters
      if (filters.service_area) {
        query = query.eq('service_area', filters.service_area);
      }
      if (filters.material_type) {
        query = query.eq('material_type', filters.material_type);
      }
      if (filters.min_price) {
        query = query.gte('unit_price', parseFloat(filters.min_price));
      }
      if (filters.max_price) {
        query = query.lte('unit_price', parseFloat(filters.max_price));
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Format data to match frontend expectations
      const formattedData = data.map(item => ({
        id: item.id,
        ...item,
        seller_name: item.users?.name || 'Unknown',
        seller_phone: item.users?.phone || 'Unknown',
        company_name: item.users?.company_name || 'Unknown',
        users: undefined // Remove nested users object
      }));

      return { success: true, data: formattedData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get Service Areas
  async getServiceAreas() {
    try {
      const { data, error } = await this.supabase
        .from('service_areas')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get Dashboard Statistics
  async getDashboardStats() {
    try {
      const [equipmentResult, materialResult, providerResult, sellerResult] = await Promise.all([
        this.supabase.from('equipment').select('id').eq('status', 'active'),
        this.supabase.from('materials').select('id').eq('status', 'active'),
        this.supabase.from('users').select('id').eq('user_type', 'equipment_provider').eq('status', 'active'),
        this.supabase.from('users').select('id').eq('user_type', 'material_seller').eq('status', 'active')
      ]);

      const stats = {
        equipment_count: equipmentResult.data?.length || 0,
        material_count: materialResult.data?.length || 0,
        provider_count: providerResult.data?.length || 0,
        seller_count: sellerResult.data?.length || 0
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export for use in frontend
export { Nirman360API, supabase };

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Nirman360API, supabase, databaseSchema };
}
