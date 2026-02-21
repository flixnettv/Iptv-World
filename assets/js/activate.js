/**
 * IPTV World - Device Activation
 * Complete Activation Flow with MAC Lookup
 * Version: 2.0
 */

let v16_iti;
let v16_currentMAC = '';
let v16_currentVendor = '';

// Device logos mapping
const DEVICE_LOGOS = {
    'Apple': 'https://flixiptv.unaux.com/wp-content/uploads/2022/10/sumsung.png',
    'Samsung': 'https://flixiptv.unaux.com/wp-content/uploads/2022/10/sumsung.png',
    'default': 'https://flixiptv.unaux.com/wp-content/uploads/2020/07/images-32.jpeg'
};

/**
 * Initialize activation page
 */
jQuery(document).ready(function($) {
    initPhoneInput();
    initMACInput();
    initKeyboardSupport();
});

/**
 * Initialize international phone input with auto country detection
 */
function initPhoneInput() {
    const phoneInput = document.querySelector("#v16-phone");
    
    if (phoneInput && window.intlTelInput) {
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
                    callback('eg'); // Fallback to Egypt on error
                });
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
            preferredCountries: ['eg', 'sa', 'ae', 'kw', 'qa', 'us', 'gb'],
            separateDialCode: true,
            autoPlaceholder: "polite",            nationalMode: false
        });
        
        console.log('✅ Phone input initialized with auto country detection');
    } else {
        console.warn('⚠️ Phone input library not loaded');
    }
}

/**
 * Initialize MAC input with auto-formatting
 */
function initMACInput() {
    const macInput = $('#v16-mac-input');
    
    macInput.on('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        let formatted = '';
        
        // Format as XX:XX:XX:XX:XX:XX
        for (let i = 0; i < value.length && i < 12; i++) {
            if (i > 0 && i % 2 === 0) {
                formatted += ':';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted;
    });
    
    console.log('✅ MAC input initialized');
}

/**
 * Initialize keyboard support (Enter key)
 */
function initKeyboardSupport() {
    $('#v16-mac-input').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            v16_action_step1();
        }
    });
    
    $('#v16-name, #v16-phone').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            v16_action_step3();
        }
    });    
    console.log('✅ Keyboard support initialized');
}

/**
 * Step 1: Validate MAC and fetch vendor information
 */
function v16_action_step1() {
    const mac = jQuery('#v16-mac-input').val().trim();
    const btn = jQuery('#step1Btn');
    
    // Validate MAC length (17 characters with colons)
    if (mac.length < 17) {
        showAlert('Invalid MAC Address (must be 17 characters)', 'error');
        jQuery('#v16-mac-input').focus();
        return;
    }
    
    v16_currentMAC = mac;
    
    // Show loading state
    const originalText = btn.html();
    btn.html('<i class="fas fa-spinner fa-spin"></i> Checking...');
    btn.prop('disabled', true);
    
    // Fetch vendor information from WordPress backend
    jQuery.post('https://iptv.unaux.com/wp-admin/admin-ajax.php', 
        { 
            action: 'get_mac_vendor',
            mac: mac 
        }, 
        function(response) {
            btn.html(originalText);
            btn.prop('disabled', false);
            
            if (response.success) {
                v16_currentVendor = response.data.vendor;
                displayDeviceInfo(mac, v16_currentVendor);
                v16_go(2);
            } else {
                // Unknown device - show default
                v16_currentVendor = 'Unknown Device';
                displayDeviceInfo(mac, 'Unknown Device');
                v16_go(2);
            }
        }
    ).fail(function(xhr, status, error) {
        console.error('MAC Lookup Error:', error);
        btn.html(originalText);
        btn.prop('disabled', false);        
        // Continue anyway with unknown device
        v16_currentVendor = 'Unknown Device';
        displayDeviceInfo(mac, 'Unknown Device');
        v16_go(2);
    });
}

/**
 * Display device information in step 2
 */
function displayDeviceInfo(mac, vendor) {
    jQuery('#v16-mac-display').text(mac);
    jQuery('#v16-vendor').text(vendor);
    
    // Set device logo
    const logo = DEVICE_LOGOS[vendor] || DEVICE_LOGOS.default;
    jQuery('#v16-dev-logo').attr('src', logo);
    
    console.log('Device Info:', { mac, vendor });
}

/**
 * Step 3: Validate contact information and prepare social media links
 */
function v16_action_step3() {
    const name = jQuery('#v16-name').val().trim();
    const phoneInput = jQuery('#v16-phone');
    const btn = jQuery('#step3Btn');
    
    // Validate name
    if (!name || name.length < 2) {
        showAlert('Please enter your full name', 'error');
        jQuery('#v16-name').focus();
        return;
    }
    
    // Validate phone
    let phone = '';
    if (v16_iti && v16_iti.isValidNumber()) {
        phone = v16_iti.getNumber();
    } else {
        showAlert('Invalid phone number', 'error');
        phoneInput.focus();
        return;
    }
    
    // Show loading
    const originalText = btn.html();
    btn.html('<i class="fas fa-spinner fa-spin"></i> Continuing...');    btn.prop('disabled', true);
    
    // Prepare message for social media
    const msg = encodeURIComponent(
        `Order FlixFlash:\n` +
        `MAC: ${v16_currentMAC}\n` +
        `Device: ${v16_currentVendor || 'Unknown'}\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}`
    );
    
    // Set social media links
    jQuery('#v16-wa').attr('href', `https://wa.me/201112246002?text=${msg}`);
    jQuery('#v16-tg').attr('href', `https://t.me/FLlXX?text=${msg}`);
    jQuery('#v16-fb').attr('href', `https://m.me/Hany.Yousseff?text=${msg}`);
    
    // Reset button and go to step 4
    setTimeout(() => {
        btn.html(originalText);
        btn.prop('disabled', false);
        v16_go(4);
    }, 500);
}

/**
 * Navigate between steps
 */
function v16_go(step) {
    // Hide all steps
    jQuery('.v16-step').removeClass('active');
    
    // Show target step
    jQuery(`#v16-step${step}`).addClass('active');
    
    // Scroll to top smoothly
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
    
    console.log(`Navigated to step ${step}`);
}

/**
 * Set MAC address from examples
 */
function setMAC(mac) {
    jQuery('#v16-mac-input').val(mac);
    v16_action_step1();
}
/**
 * Toggle floating contact menu
 */
function toggleFloatingMenu() {
    document.querySelector('.floating-contact').classList.toggle('active');
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add alert animations
const alertStyle = document.createElement('style');
alertStyle.textContent = `    @keyframes slideDown {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideUp {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(alertStyle);

// Export functions to global scope
window.v16_action_step1 = v16_action_step1;
window.v16_action_step3 = v16_action_step3;
window.v16_go = v16_go;
window.setMAC = setMAC;
window.toggleFloatingMenu = toggleFloatingMenu;