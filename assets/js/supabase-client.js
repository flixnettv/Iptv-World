import { SUPABASE_CONFIG } from './config.js';

// استدعاء مكتبة Supabase من CDN
const { createClient } = supabase;

// إنشاء عميل Supabase
export const supabaseClient = createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// ========================================
// دوال جلب الإعدادات
// ========================================
export async function getSiteConfig() {
    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .select('key, value');
        
        if (error) throw error;
        
        // تحويل المصفوفة لكائن
        const config = {};
        data.forEach(item => {
            config[item.key] = item.value;
        });
        
        return config;
    } catch (error) {
        console.error('Error fetching config:', error);
        return null;
    }
}

// ========================================
// دوال جلب التطبيقات
// ========================================
export async function getApps(category = null) {
    try {
        let query = supabaseClient
            .from('apps')
            .select('*')
            .eq('is_active', true);
        
        if (category) {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching apps:', error);
        return [];
    }
}

// ========================================
// دوال إرسال الطلبات
// ========================================
export async function createOrder(orderData) {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([orderData]);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
    }
}

// ========================================
// دوال لوحة التحكم (تتطلب Service Role)
// ========================================
export async function updateConfig(key, value) {
    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .update({ value, updated_at: new Date() })
            .eq('key', key);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating config:', error);
        return { success: false, error: error.message };
    }
}

export async function getAllOrders() {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}