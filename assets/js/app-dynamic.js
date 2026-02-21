/**
 * IPTV World - Dynamic App Details
 */

const appsData = {
    aroma: {
        name: 'Aroma IPTV',
        subtitle: 'Premium IPTV Experience',
        description: 'Aroma IPTV offers the best streaming experience with thousands of channels in HD/FHD/4K quality. Perfect for Android, iOS, Smart TV, and all devices.',
        features: [
            '+10,000 Live Channels',
            'HD/FHD/4K Quality',
            'Movies & Series Library',
            'Sports & PPV Events',
            'EPG (Electronic Program Guide)',
            'Catch-up TV',
            'Multi-device Support',
            '24/7 Customer Support'
        ],
        price: 70,
        icon: 'fa-tv'
    },
    elaf: {
        name: 'Elaf IPTV',
        subtitle: 'Arabic & International Channels',
        description: 'Elaf IPTV specializes in Arabic content with comprehensive coverage of Middle Eastern channels plus international content.',
        features: [
            'Arabic Channels Focus',
            'International Content',
            'High Quality Streaming',
            'VOD Library',
            'Sports Channels',
            'News & Entertainment',
            'Kids Channels',
            'Reliable Servers'
        ],
        price: 70,
        icon: 'fa-play-circle'
    },
    nova: {
        name: 'Nova IPTV',
        subtitle: 'Next Generation Streaming',
        description: 'Nova IPTV brings you cutting-edge streaming technology with an intuitive interface and exceptional channel selection.',
        features: [
            'Modern Interface',
            'Fast Loading',
            'No Buffering',
            'Regular Updates',
            'Multi-language Support',
            'Parental Controls',            'Favorites Management',
            'Search Function'
        ],
        price: 70,
        icon: 'fa-rocket'
    },
    flix: {
        name: 'Flix IPTV',
        subtitle: 'Your Entertainment Hub',
        description: 'Flix IPTV is your complete entertainment solution with movies, series, sports, and live TV channels from around the world.',
        features: [
            'Movies & Series',
            'Live Sports',
            'International Channels',
            'Documentary Channels',
            'Music Channels',
            'Radio Stations',
            'M3U Support',
            'Xtream Codes'
        ],
        price: 70,
        icon: 'fa-film'
    },
    maven: {
        name: 'Maven IPTV',
        subtitle: 'Professional IPTV Service',
        description: 'Maven IPTV delivers professional-grade streaming with premium channels and exceptional reliability.',
        features: [
            'Premium Channels',
            '99.9% Uptime',
            'Anti-Freeze Technology',
            'Multiple Servers',
            'Quick Support',
            'Easy Setup',
            'Regular Updates',
            'Competitive Pricing'
        ],
        price: 70,
        icon: 'fa-crown'
    },
    cobra: {
        name: 'Cobra IPTV',
        subtitle: 'Powerful Streaming Solution',
        description: 'Cobra IPTV strikes with powerful performance and extensive channel lineup for the ultimate viewing experience.',
        features: [
            'Extensive Channel List',
            'Premium Sports',
            'PPV Events',
            'International Content',
            'High Bitrate',            'Stable Connection',
            'Multi-screen',
            'Device Compatibility'
        ],
        price: 70,
        icon: 'fa-snake'
    },
    dita: {
        name: 'Dita 4K IPTV',
        subtitle: 'Ultra HD Streaming',
        description: 'Dita 4K specializes in ultra-high-definition content, bringing you crystal-clear picture quality for the best viewing experience.',
        features: [
            'True 4K Content',
            'UHD Channels',
            'HDR Support',
            'Premium Quality',
            'Sports in 4K',
            'Movies in 4K',
            'Documentary 4K',
            'Best Picture Quality'
        ],
        price: 70,
        icon: 'fa-tv'
    },
    ceme: {
        name: 'Ceme TV',
        subtitle: 'Complete Entertainment',
        description: 'Ceme TV provides complete entertainment coverage with diverse channels and content for the whole family.',
        features: [
            'Family Friendly',
            'Diverse Content',
            'Kids Section',
            'Educational Channels',
            'Entertainment',
            'News & Current Affairs',
            'Lifestyle Channels',
            'Regional Content'
        ],
        price: 70,
        icon: 'fa-heart'
    },
    ipfox: {
        name: 'Ipfox IPTV',
        subtitle: 'Smart Streaming Choice',
        description: 'Ipfox IPTV is the smart choice for discerning viewers who demand quality, variety, and reliability.',
        features: [
            'Smart Selection',
            'Quality Assured',
            'Variety of Content',
            'Reliable Service',            'Fast Servers',
            'Easy to Use',
            'Great Value',
            'Trusted Provider'
        ],
        price: 70,
        icon: 'fa-fox'
    }
};

// Load app data on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const appName = urlParams.get('name');
    
    if (appName && appsData[appName]) {
        loadAppData(appsData[appName]);
    } else {
        // Default to first app or show error
        loadAppData(appsData.aroma);
    }
});

function loadAppData(app) {
    document.getElementById('appName').textContent = app.name;
    document.getElementById('appDesc').textContent = app.subtitle;
    document.getElementById('appDescription').textContent = app.description;
    
    // Set icon or logo
    const logoEl = document.getElementById('appLogo');
    if (app.icon) {
        logoEl.innerHTML = `<i class="fas ${app.icon}"></i>`;
    }
    
    // Load features
    const featuresList = document.getElementById('appFeaturesList');
    featuresList.innerHTML = app.features.map(feature => 
        `<li><i class="fas fa-check"></i> ${feature}</li>`
    ).join('');
    
    // Update title
    document.title = `${app.name} - IPTV World`;
}