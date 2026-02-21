// (نفس الكود السابق مع إضافة تحسينات بسيطة)
let v16_iti;
let v16_currentMAC = '';
let v16_currentVendor = '';

const DEVICE_LOGOS = {
    'Apple': 'https://flixiptv.unaux.com/wp-content/uploads/2022/10/sumsung.png',
    'Samsung': 'https://flixiptv.unaux.com/wp-content/uploads/2022/10/sumsung.png',
    'default': 'https://flixiptv.unaux.com/wp-content/uploads/2020/07/images-32.jpeg'
};

jQuery(document).ready(function($) {
    if (window.intlTelInput) {
        v16_iti = window.intlTelInput(document.querySelector("#v16-phone"), {
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                $.get("https://ipapi.co/jsonp", function(result) {
                    callback(result.country_code || 'us');
                }, "jsonp").fail(function() {
                    callback('us');
                });
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
            preferredCountries: ['eg', 'sa', 'ae', 'kw', 'qa']
        });
    }

    $('#v16-mac-input').on('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        let formatted = '';
        for (let i = 0; i < value.length && i < 12; i++) {
            if (i > 0 && i % 2 === 0) formatted += ':';
            formatted += value[i];
        }
        e.target.value = formatted;
    });
});

function v16_action_step1() {
    const mac = jQuery('#v16-mac-input').val().trim();
    if (mac.length < 17) {
        alert('Invalid MAC Address');
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
    const phone = v16_iti ? v16_iti.getNumber() : jQuery('#v16-phone').val().trim();

    if (!name) {
        alert('Please enter your name');
        return;
    }

    if (!v16_iti || !v16_iti.isValidNumber()) {
        alert('Invalid phone number');
        return;
    }

    const msg = encodeURIComponent(`Order FlixFlash:
MAC: ${v16_currentMAC}
Name: ${name}
Phone: ${phone}`);
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

window.v16_action_step1 = v16_action_step1;
window.v16_action_step3 = v16_action_step3;
window.v16_go = v16_go;
window.setMAC = setMAC;