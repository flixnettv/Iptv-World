/**
 * IPTV World - Configuration File
 * إعدادات التطبيق العامة
 */

window.AppConfig = {
    // التطبيق
    appName: 'IPTV World',
    appVersion: '2.0.0',
    
    // الإعدادات
    settings: {
        itemsPerPage: 12,
        cacheDuration: 3600, // 1 hour
        enableNotifications: true,
    },
    
    // روابط مهمة
    links: {
        support: 'mailto:support@iptvworld.com',
        telegram: 'https://t.me/iptvworld',
        whatsapp: 'https://wa.me/1234567890',
    },
    
    // النصوص
    texts: {
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'تم بنجاح',
    },
};

console.log('📋 AppConfig Loaded');