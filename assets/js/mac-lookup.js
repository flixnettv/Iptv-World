const ouiDatabase = {
    "00:00:00": "XEROX CORPORATION",
    "00:1A:2B": "Apple Inc.",
    "00:1B:44": "Apple Inc.",
    "00:1C:B3": "Apple Inc.",
    "00:50:56": "VMware Inc.",
    "00:0C:29": "VMware Inc.",
    "B8:27:EB": "Raspberry Pi Foundation",
    "DC:A6:32": "Raspberry Pi Foundation",
    "E4:5F:01": "Raspberry Pi Foundation",
    "00:16:EA": "Sony Corporation",
    "00:1D:BA": "Sony Corporation",
    "00:1F:3E": "Samsung Electronics",
    "00:21:4C": "Samsung Electronics",
    "00:0F:B5": "Intel Corporate",
    "00:15:17": "Intel Corporate",
    "00:18:DE": "Intel Corporate"
};

async function lookupMAC() {
    const macInput = document.getElementById('macInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!macInput) {
        resultDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${I18N.t('mac.error.empty')}</div>`;
        return;
    }

    const cleanMAC = macInput.toUpperCase().replace(/[:-]/g, '');
    
    if (cleanMAC.length < 6) {
        resultDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${I18N.t('mac.error.invalid')}</div>`;
        return;
    }
    
    const oui = cleanMAC.substring(0, 6);
    const formattedOUI = `${oui.substring(0,2)}:${oui.substring(2,4)}:${oui.substring(4,6)}`;
    
    let manufacturer = ouiDatabase[formattedOUI];
    
    if (manufacturer) {
        resultDiv.innerHTML = `
            <div class="success">
                <h3><i class="fas fa-check-circle"></i> ${I18N.t('mac.success.found')}</h3>
                <p><strong>${I18N.t('mac.success.manufacturer')}:</strong> ${manufacturer}</p>
                <p><strong>MAC Prefix:</strong> ${formattedOUI}</p>
                <p><strong>${I18N.t('mac.success.device')}:</strong> ${macInput}</p>
            </div>
        `;
    } else {
        try {
            const response = await fetch(`https://api.maclookup.app/v2/macs/${macInput}`);
            const data = await response.json();
            
            if (data.success && data.company) {
                resultDiv.innerHTML = `
                    <div class="success">
                        <h3><i class="fas fa-check-circle"></i> ${I18N.t('mac.success.found')}</h3>
                        <p><strong>${I18N.t('mac.success.manufacturer')}:</strong> ${data.company}</p>
                        <p><strong>MAC Prefix:</strong> ${formattedOUI}</p>
                        <p><strong>${I18N.t('mac.success.device')}:</strong> ${macInput}</p>
                        ${data.country ? `<p><strong>Country:</strong> ${data.country}</p>` : ''}
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<div class="error"><i class="fas fa-times-circle"></i> ${I18N.t('mac.success.notFound')}</div>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<div class="error"><i class="fas fa-times-circle"></i> ${I18N.t('mac.error.connection')}</div>`;
        }
    }
}

function setMAC(mac) {
    document.getElementById('macInput').value = mac;
    lookupMAC();
}