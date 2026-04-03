// Database Stats Fetcher for Nirmanh360
// Fetches real-time statistics from Supabase database

class DatabaseStats {
    constructor() {
        this.supabaseUrl = 'https://vlfucggnbkizkxkvzfux.supabase.co';
        this.supabaseAnonKey = 'sb_publishable_3XK1mz1LLVc7016pPUpgmQ_uk7CXWSr';
        this.supabase = window.supabase?.createClient
            ? window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey)
            : null;
    }

    async fetchStats() {
        if (!this.supabase) {
            console.error('Supabase client not available');
            return this.getDefaultStats();
        }

        try {
            const [
                equipmentResult,
                materialsResult,
                usersResult,
                serviceAreasResult
            ] = await Promise.all([
                this.supabase.from('equipment').select('id', { count: 'exact', head: true }),
                this.supabase.from('materials').select('id', { count: 'exact', head: true }),
                this.supabase.from('users').select('id', { count: 'exact', head: true }),
                this.supabase.from('service_areas').select('id', { count: 'exact', head: true })
            ]);

            const stats = {
                equipmentCount: equipmentResult.count || 0,
                materialsCount: materialsResult.count || 0,
                usersCount: usersResult.count || 0,
                serviceAreasCount: serviceAreasResult.count || 0,
                totalListings: (equipmentResult.count || 0) + (materialsResult.count || 0)
            };

            console.log('✅ Database stats fetched:', stats);
            return stats;
        } catch (error) {
            console.error('❌ Error fetching database stats:', error);
            return this.getDefaultStats();
        }
    }

    getDefaultStats() {
        return {
            equipmentCount: 0,
            materialsCount: 0,
            usersCount: 0,
            serviceAreasCount: 6, // We know this from setup
            totalListings: 0
        };
    }

    async updatePageStats() {
        const stats = await this.fetchStats();
        
        // Update equipment listings stat
        const equipmentStatEl = document.querySelector('[data-stat="equipment-listings"]');
        if (equipmentStatEl) {
            equipmentStatEl.textContent = stats.equipmentCount > 0 ? `${stats.equipmentCount}+` : 'Growing';
        }

        // Update materials listings stat
        const materialsStatEl = document.querySelector('[data-stat="materials-listings"]');
        if (materialsStatEl) {
            materialsStatEl.textContent = stats.materialsCount > 0 ? `${stats.materialsCount}+` : 'Growing';
        }

        // Update total listings stat
        const totalListingsEl = document.querySelector('[data-stat="total-listings"]');
        if (totalListingsEl) {
            totalListingsEl.textContent = stats.totalListings > 0 ? `${stats.totalListings}+` : 'Growing';
        }

        // Update users/customers stat
        const usersStatEl = document.querySelector('[data-stat="happy-customers"]');
        if (usersStatEl) {
            usersStatEl.textContent = stats.usersCount > 0 ? `${stats.usersCount}+` : 'Growing';
        }

        // Update service areas stat
        const serviceAreasEl = document.querySelector('[data-stat="areas-covered"]');
        if (serviceAreasEl) {
            serviceAreasEl.textContent = stats.serviceAreasCount;
        }

        return stats;
    }

    async populateServiceAreas() {
        if (!this.supabase) return;

        try {
            const { data, error } = await this.supabase
                .from('service_areas')
                .select('*')
                .eq('status', 'active')
                .order('name');

            if (error) throw error;

            const serviceAreasGrid = document.querySelector('[data-service-areas]');
            if (serviceAreasGrid && data.length > 0) {
                let html = '';
                data.forEach(area => {
                    const demandBadge = area.demand_level === 'high' ? 'high-demand' : 
                                     area.demand_level === 'medium' ? 'medium-demand' : 'low-demand';
                    
                    html += `
                        <div class="card group hover:shadow-lg transition-all duration-300">
                            <div class="p-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-xl font-semibold text-gray-800">${area.name}</h3>
                                    <span class="px-3 py-1 text-xs font-medium rounded-full ${demandBadge}">
                                        ${area.demand_level} demand
                                    </span>
                                </div>
                                <p class="text-gray-600 mb-4">${area.description}</p>
                                <div class="flex items-center justify-between text-sm text-gray-500">
                                    <span>🏗️ ${area.equipment_count || 0} equipment</span>
                                    <span>📋 ${area.active_projects || 0} projects</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                serviceAreasGrid.innerHTML = html;
            }
        } catch (error) {
            console.error('Error populating service areas:', error);
        }
    }

    async populateRecentListings() {
        if (!this.supabase) return;

        try {
            const [equipmentResult, materialsResult] = await Promise.all([
                this.supabase.from('equipment')
                    .select(`
                        *,
                        users!equipment_provider_id_fkey (
                            name,
                            phone,
                            company_name
                        )
                    `)
                    .eq('status', 'active')
                    .limit(3),
                this.supabase.from('materials')
                    .select(`
                        *,
                        users!material_seller_id_fkey (
                            name,
                            phone,
                            company_name
                        )
                    `)
                    .eq('status', 'active')
                    .limit(3)
            ]);

            const recentListingsEl = document.querySelector('[data-recent-listings]');
            if (recentListingsEl) {
                let html = '';
                
                // Add equipment listings
                equipmentResult.data?.forEach(item => {
                    html += `
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-start justify-between">
                                <div>
                                    <h4 class="font-semibold text-gray-800">${item.brand_model}</h4>
                                    <p class="text-sm text-gray-600">${item.equipment_type} • ${item.working_condition}</p>
                                    <p class="text-blue-600 font-semibold mt-1">₹${item.daily_rate}/day</p>
                                    <p class="text-sm text-gray-500 mt-2">📍 ${item.service_area}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-gray-700">${item.users?.company_name || 'Provider'}</p>
                                    <p class="text-xs text-gray-500">${item.users?.name || 'Contact for details'}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                // Add material listings
                materialsResult.data?.forEach(item => {
                    html += `
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-start justify-between">
                                <div>
                                    <h4 class="font-semibold text-gray-800">${item.brand_grade}</h4>
                                    <p class="text-sm text-gray-600">${item.material_type} • ${item.available_quantity}</p>
                                    <p class="text-blue-600 font-semibold mt-1">₹${item.unit_price}/unit</p>
                                    <p class="text-sm text-gray-500 mt-2">📍 ${item.service_area}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-gray-700">${item.users?.company_name || 'Seller'}</p>
                                    <p class="text-xs text-gray-500">${item.users?.name || 'Contact for details'}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                if (html) {
                    recentListingsEl.innerHTML = html;
                } else {
                    recentListingsEl.innerHTML = '<p class="text-gray-500 text-center py-8">No listings yet. Be the first to list your equipment or materials!</p>';
                }
            }
        } catch (error) {
            console.error('Error populating recent listings:', error);
        }
    }

    async initialize() {
        console.log('🔄 Initializing database stats...');
        
        // Update page statistics
        await this.updatePageStats();
        
        // Populate service areas
        await this.populateServiceAreas();
        
        // Populate recent listings
        await this.populateRecentListings();
        
        console.log('✅ Database stats initialized');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dbStats = new DatabaseStats();
    dbStats.initialize();
});

// Export for use in other files
window.DatabaseStats = DatabaseStats;
