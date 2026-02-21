/**
 * IPTV World - Device Activation
 * Enhanced with Back Button & Auto Country Detection
 */

let v16_iti;
let v16_currentMAC = '';
let v16_currentVendor = '';

const DEVICE_LOGOS = {
    'Apple': 'https://flixiptv.unaux.com/wp-content/uploads/2022/10/sumsung.png',
    'Samsung': 'https://flixiptv.unaux.com/wp-content/uploads/2022/10/sumsung.png',
    'default': 'https://flixiptv.unaux.com/wp-content/uploads/2020/07/images-32.jpeg'
};

jQuery(document).ready(function($) {
    // Initialize phone input with auto country detection
    if (window.intlTelInput) {
        const phoneInput = document.querySelector("#v16-phone");
        v16_iti = window.intlTelInput(phoneInput, {
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                $.get("https://ipapi.co/jsonp", function(result) {
                    if (result && result.country_code) {
                        callback(result.country_code);
                    } else {
                        callback('eg'); // Default to Egypt
                    }
                }, "jsonp").fail(function() {
                    callback('eg'); // Fallback
                });
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
            preferredCountries: ['eg', 'sa', 'ae', 'kw', 'qa', 'us', 'gb'],
            separateDialCode: true, // ✅ Show country code
            autoPlaceholder: "polite"
        });
    }

    // Auto-format MAC input
    $('#v16-mac-input').on('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        let formatted = '';
        for (let i = 0; i < value.length && i < 12; i++) {
            if (i > 0 && i % 2 === 0) formatted += ':';
            formatted += value[i];
        }
        e.target.value = formatted;
    });
    // Enter key support
    $('#v16-mac-input').on('keypress', function(e) {
        if (e.which === 13) v16_action_step1();
    });
});

function v16_action_step1() {
    const mac = jQuery('#v16-mac-input').val().trim();
    
    if (mac.length < 17) {
        showAlert('Invalid MAC Address (must be 17 characters)', 'error');
        return;
    }

    v16_currentMAC = mac;
    const btn = jQuery('#step1Btn');
    const originalText = btn.html();
    btn.html('<i class="fas fa-spinner fa-spin"></i> Checking...');
    btn.prop('disabled', true);

    jQuery.post('https://iptv.unaux.com/wp-admin/admin-ajax.php', 
        { action: 'get_mac_vendor', mac: mac }, 
        function(response) {
            btn.html(originalText);
            btn.prop('disabled', false);
            
            if (response.success) {
                v16_currentVendor = response.data.vendor;
                jQuery('#v16-mac-display').text(mac);
                jQuery('#v16-vendor').text(v16_currentVendor);
                const logo = DEVICE_LOGOS[v16_currentVendor] || DEVICE_LOGOS.default;
                jQuery('#v16-dev-logo').attr('src', logo);
                v16_go(2);
            } else {
                jQuery('#v16-mac-display').text(mac);
                jQuery('#v16-vendor').text('Unknown Device');
                jQuery('#v16-dev-logo').attr('src', DEVICE_LOGOS.default);
                v16_go(2);
            }
        }
    ).fail(function() {
        btn.html(originalText);
        btn.prop('disabled', false);
        jQuery('#v16-mac-display').text(mac);
        jQuery('#v16-vendor').text('Unknown Device');
        jQuery('#v16-dev-logo').attr('src', DEVICE_LOGOS.default);
        v16_go(2);
    });
}
function v16_action_step3() {
    const name = jQuery('#v16-name').val().trim();
    const phoneInput = jQuery('#v16-phone');
    
    if (!name || name.length < 2) {
        showAlert('Please enter your full name', 'error');
        jQuery('#v16-name').focus();
        return;
    }

    let phone = '';
    if (v16_iti && v16_iti.isValidNumber()) {
        phone = v16_iti.getNumber();
    } else {
        showAlert('Please enter a valid phone number', 'error');
        phoneInput.focus();
        return;
    }

    const msg = encodeURIComponent(`Order FlixFlash:
MAC: ${v16_currentMAC}
Device: ${v16_currentVendor || 'Unknown'}
Name: ${name}
Phone: ${phone}`);

    // Set links - WhatsApp ONLY for floating button
    jQuery('#v16-wa').attr('href', `https://wa.me/201112246002?text=${msg}`);
    jQuery('#v16-tg').attr('href', `https://t.me/FLlXX?text=${msg}`);
    jQuery('#v16-fb').attr('href', `https://m.me/Hany.Yousseff?text=${msg}`);

    v16_go(4);
}

function v16_go(step) {
    jQuery('.v16-step').removeClass('active');
    jQuery(`#v16-step${step}`).addClass('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setMAC(mac) {
    jQuery('#v16-mac-input').val(mac);
    v16_action_step1();
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> <span>${message}</span>`;
    alert.style.cssText = `
        position: fixed;        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

window.v16_action_step1 = v16_action_step1;
window.v16_action_step3 = v16_action_step3;
window.v16_go = v16_go;
window.setMAC = setMAC;