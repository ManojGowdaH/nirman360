// Frontend Integration for Nirman360 with Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration - Replace with your actual values
const SUPABASE_URL = 'https://vlfucggnbkizkxkvzfux.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3XK1mz1LLVc7016pPUpgmQ_uk7CXWSr';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// API Class for frontend usage
class Nirman360Frontend {
  constructor() {
    this.supabase = supabase;
  }

  // Equipment Form Submission
  async submitEquipmentForm(formData) {
    try {
      const equipmentData = {
        provider_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company_name: formData.company_name,
        equipment_type: formData.equipment_type,
        brand_model: formData.brand_model,
        year_of_manufacture: formData.year_of_manufacture,
        working_condition: formData.working_condition,
        description: formData.description,
        hourly_rate: parseFloat(formData.hourly_rate),
        daily_rate: parseFloat(formData.daily_rate),
        monthly_rate: parseFloat(formData.monthly_rate),
        availability_status: formData.availability_status,
        service_area: formData.service_area,
        address: formData.address
      };

      // Call backend API (or use Supabase directly)
      const response = await fetch('/api/equipment/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipmentData)
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Material Form Submission
  async submitMaterialForm(formData) {
    try {
      const materialData = {
        seller_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company_name: formData.company_name,
        material_type: formData.material_type,
        brand_grade: formData.brand_grade,
        available_quantity: formData.available_quantity,
        unit_price: parseFloat(formData.unit_price),
        description: formData.description,
        service_area: formData.service_area,
        address: formData.address,
        delivery_available: formData.delivery_available,
        pickup_available: formData.pickup_available,
        delivery_charges: formData.delivery_charges
      };

      // Call backend API (or use Supabase directly)
      const response = await fetch('/api/materials/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData)
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.error };
      }
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
      
      // Format data
      return data.map(item => ({
        id: item.id,
        ...item,
        provider_name: item.users?.name || 'Unknown',
        provider_phone: item.users?.phone || 'Unknown',
        company_name: item.users?.company_name || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
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
      
      // Format data
      return data.map(item => ({
        id: item.id,
        ...item,
        seller_name: item.users?.name || 'Unknown',
        seller_phone: item.users?.phone || 'Unknown',
        company_name: item.users?.company_name || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching materials:', error);
      return [];
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
      return data;
    } catch (error) {
      console.error('Error fetching service areas:', error);
      return [];
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

      return {
        equipment_count: equipmentResult.data?.length || 0,
        material_count: materialResult.data?.length || 0,
        provider_count: providerResult.data?.length || 0,
        seller_count: sellerResult.data?.length || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        equipment_count: 0,
        material_count: 0,
        provider_count: 0,
        seller_count: 0
      };
    }
  }
}

// Initialize the API
const nirman360API = new Nirman360Frontend();

// Export for use in your HTML files
window.Nirman360API = nirman360API;

// Update form submission functions to use Supabase
function submitEquipmentForm(event) {
  event.preventDefault();
  
  // Collect form data
  const formData = {
    name: document.querySelector('input[placeholder="John Doe"]').value,
    phone: document.querySelector('input[placeholder="+91 98765 43210"]').value,
    email: document.querySelector('input[placeholder="john@example.com"]').value,
    company_name: document.querySelector('input[placeholder="ABC Construction Equipment"]').value,
    equipment_type: document.querySelector('select[required] option:checked').value,
    brand_model: document.querySelector('input[placeholder="JCB 3DX, Tata Hitachi, etc."]').value,
    year_of_manufacture: document.querySelector('input[placeholder="2020"]').value,
    working_condition: document.querySelector('select').value,
    description: document.querySelector('textarea[placeholder*="equipment"]').value,
    hourly_rate: document.querySelector('input[placeholder="500"]').value,
    daily_rate: document.querySelector('input[placeholder="3000"]').value,
    monthly_rate: document.querySelector('input[placeholder="45000"]').value,
    availability_status: document.querySelector('select:last-of-type').value,
    service_area: document.querySelector('select[required]:last-of-type option:checked').value,
    address: document.querySelector('input[placeholder*="Main Road"]').value
  };
  
  // Submit using Supabase
  nirman360API.submitEquipmentForm(formData)
    .then(result => {
      if (result.success) {
        console.log('Success:', result.data);
        // Show success message
        document.getElementById('equipmentForm').classList.add('hidden');
        document.getElementById('materialForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        
        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.error('Error:', result.error);
        alert('Error submitting form: ' + result.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    });
}

function submitMaterialForm(event) {
  event.preventDefault();
  
  // Collect form data
  const formData = {
    name: document.querySelector('#materialForm input[placeholder="John Doe"]').value,
    phone: document.querySelector('#materialForm input[placeholder="+91 98765 43210"]').value,
    email: document.querySelector('#materialForm input[placeholder="john@example.com"]').value,
    company_name: document.querySelector('#materialForm input[placeholder="ABC Building Materials"]').value,
    material_type: document.querySelector('#materialForm select[required] option:checked').value,
    brand_grade: document.querySelector('#materialForm input[placeholder="ACC Cement 53 Grade, TATA TMT, etc."]').value,
    available_quantity: document.querySelector('#materialForm input[placeholder="500 bags, 10 tons, etc."]').value,
    unit_price: document.querySelector('#materialForm input[placeholder="350 per bag, 50000 per ton"]').value,
    description: document.querySelector('#materialForm textarea[placeholder*="material"]').value,
    service_area: document.querySelector('#materialForm select[required]:last-of-type option:checked').value,
    address: document.querySelector('#materialForm input[placeholder*="Main Road"]').value,
    delivery_available: document.getElementById('delivery').checked,
    pickup_available: document.getElementById('pickup').checked,
    delivery_charges: document.querySelector('#materialForm input[placeholder*="delivery"]').value
  };
  
  // Submit using Supabase
  nirman360API.submitMaterialForm(formData)
    .then(result => {
      if (result.success) {
        console.log('Success:', result.data);
        // Show success message
        document.getElementById('equipmentForm').classList.add('hidden');
        document.getElementById('materialForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        
        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.error('Error:', result.error);
        alert('Error submitting form: ' + result.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    });
}

// Load service areas on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const serviceAreas = await nirman360API.getServiceAreas();
    
    // Populate service area select options
    const serviceAreaSelects = document.querySelectorAll('select[required]');
    serviceAreaSelects.forEach(select => {
      if (select.name === 'service_area' || select.id === 'service_area') {
        // Clear existing options except the first one
        while (select.children.length > 1) {
          select.removeChild(select.lastChild);
        }
        
        // Add service area options
        serviceAreas.forEach(area => {
          const option = document.createElement('option');
          option.value = area.name;
          option.textContent = area.name;
          select.appendChild(option);
        });
      }
    });
    
    console.log('✅ Service areas loaded successfully');
  } catch (error) {
    console.error('Error loading service areas:', error);
  }
});

export { Nirman360Frontend, nirman360API };
