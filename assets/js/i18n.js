/**
 * IPTV World - Internationalization System
 * Professional Multi-Language Support
 * Version: 2.1 (English Fallback)
 */

const I18N = {
    defaultLang: 'en',  // ✅ الإنجليزية هي الافتراضية
    currentLang: 'en',

    translations: {
        ar: {
            'nav.home': 'الرئيسية',
            'nav.activate': 'تفعيل الجهاز',
            'hero.title': 'عالم IPTV بين يديك',
            // ... باقي الترجمات العربية
        },
        en: {
            'nav.home': 'Home',
            'nav.activate': 'Activate',
            'hero.title': 'IPTV World in Your Hands',
            // ... باقي الترجمات الإنجليزية
        }
    },

    detectLanguage() {
        // 1. localStorage أولاً
        const saved = localStorage.getItem('iptv-lang');
        if (saved && this.translations[saved]) {
            return saved;
        }

        // 2. لغة المتصفح
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();

        // 3. التحقق من الدعم
        if (this.translations[langCode]) {
            return langCode;
        }

        // 4. الإنجليزية افتراضياً ✅
        return 'en';
    },

    setLanguage(lang) {
        if (!this.translations[lang]) {
            lang = 'en';  // ✅ fallback للإنجليزية
        }
        this.currentLang = lang;
        localStorage.setItem('iptv-lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.updateAllTexts();
        this.updateLangSwitcher();
    },

    t(key) {
        return this.translations[this.currentLang][key] || 
               this.translations['en'][key] ||  // ✅ fallback للإنجليزية
               key;
    },

    updateAllTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    },

    updateLangSwitcher() {
        document.querySelectorAll('#langText').forEach(el => {
            el.textContent = this.currentLang === 'ar' ? 'EN' : 'عربي';
        });
    },

    init() {
        const lang = this.detectLanguage();
        this.setLanguage(lang);
    }
};

function toggleLanguage() {
    const newLang = I18N.currentLang === 'ar' ? 'en' : 'ar';
    I18N.setLanguage(newLang);
}

document.addEventListener('DOMContentLoaded', () => {
    I18N.init();
});

window.I18N = I18N;
window.toggleLanguage = toggleLanguage;