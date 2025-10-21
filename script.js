// Tab switching
function switchTab(index) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active');
            contents[i].classList.add('active');
        } else {
            tab.classList.remove('active');
            contents[i].classList.remove('active');
        }
    });
}

// Global variables
let encryptImage = null;
let decryptImage = null;
const MAX_MESSAGE_LENGTH = 256;
const MOD_VALUE = 256;

// Get encryption parameters from user input
function getEncryptionParams() {
    const a = parseInt(document.getElementById('paramA').value);
    const b = parseInt(document.getElementById('paramB').value);
    return { a, b };
}

// Validate encryption parameters
function validateParams(a, b) {
    if (isNaN(a) || isNaN(b)) {
        return { valid: false, message: 'Els paràmetres han de ser números vàlids.' };
    }
    
    if (a < 1 || a > 255) {
        return { valid: false, message: 'El valor de "a" ha d\'estar entre 1 i 255.' };
    }
    
    if (b < 0 || b > 255) {
        return { valid: false, message: 'El valor de "b" ha d\'estar entre 0 i 255.' };
    }
    
    // Check if 'a' is odd (required for modular inverse to exist)
    if (a % 2 === 0) {
        return { valid: false, message: 'El valor de "a" ha de ser senar (imparell) per tenir un invers modular.' };
    }
    
    // Check GCD(a, 256) = 1
    if (gcd(a, 256) !== 1) {
        return { valid: false, message: 'El valor de "a" ha de ser coprimer amb 256 (sense factors comuns).' };
    }
    
    return { valid: true, message: '' };
}

// Calculate GCD
function gcd(a, b) {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Extended Euclidean Algorithm to find modular multiplicative inverse
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1;
}

// Encryption: (a*x + b) mod 256
function encryptChar(charCode, a, b) {
    return (a * charCode + b) % MOD_VALUE;
}

// Decryption: inverse of (a*x + b) mod 256
// Formula: x = inverse(a) * (y - b) mod 256
function decryptChar(encryptedValue, a, b) {
    const inverse = modInverse(a, MOD_VALUE);
    let result = (inverse * (encryptedValue - b)) % MOD_VALUE;
    // Ensure positive result
    if (result < 0) result += MOD_VALUE;
    return result;
}

// Test encryption with sample text
function testEncryption() {
    const params = getEncryptionParams();
    const validation = validateParams(params.a, params.b);
    
    if (!validation.valid) {
        document.getElementById('testResult').innerHTML = `
            <div class="message error">${validation.message}</div>
        `;
        return;
    }
    
    const testText = "Hola";
    let resultHTML = '<div class="message success">';
    resultHTML += '<strong>✓ Paràmetres vàlids!</strong><br><br>';
    resultHTML += `<strong>Fórmula:</strong> (${params.a}x + ${params.b}) mod 256<br>`;
    resultHTML += `<strong>Invers de ${params.a}:</strong> ${modInverse(params.a, 256)}<br><br>`;
    resultHTML += '<strong>Prova amb "Hola":</strong><br>';
    
    for (let i = 0; i < testText.length; i++) {
        const char = testText[i];
        const ascii = testText.charCodeAt(i);
        const encrypted = encryptChar(ascii, params.a, params.b);
        const decrypted = decryptChar(encrypted, params.a, params.b);
        
        resultHTML += `<div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">`;
        resultHTML += `'${char}' → ASCII ${ascii} → Encriptat ${encrypted} → Desencriptat ${decrypted} `;
        resultHTML += decrypted === ascii ? '✓' : '❌';
        resultHTML += `</div>`;
    }
    
    resultHTML += '</div>';
    document.getElementById('testResult').innerHTML = resultHTML;
}

// Validate parameters on input change
document.getElementById('paramA').addEventListener('input', function() {
    const params = getEncryptionParams();
    const validation = validateParams(params.a, params.b);
    
    if (!validation.valid) {
        document.getElementById('paramWarning').innerHTML = `
            <div class="message error">${validation.message}</div>
        `;
    } else {
        document.getElementById('paramWarning').innerHTML = '';
    }
});

document.getElementById('paramB').addEventListener('input', function() {
    const params = getEncryptionParams();
    const validation = validateParams(params.a, params.b);
    
    if (!validation.valid) {
        document.getElementById('paramWarning').innerHTML = `
            <div class="message error">${validation.message}</div>
        `;
    } else {
        document.getElementById('paramWarning').innerHTML = '';
    }
});

// Character counter
document.getElementById('secretMessage').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
});

// File upload handlers
document.getElementById('encryptFile').addEventListener('change', function(e) {
    handleEncryptFile(e.target.files[0]);
});

document.getElementById('decryptFile').addEventListener('change', function(e) {
    handleDecryptFile(e.target.files[0]);
});

// Drag and drop
['encryptUpload', 'decryptUpload'].forEach(id => {
    const area = document.getElementById(id);
    
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('dragover');
    });
    
    area.addEventListener('dragleave', () => {
        area.classList.remove('dragover');
    });
    
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (id === 'encryptUpload') {
            handleEncryptFile(file);
        } else {
            handleDecryptFile(file);
        }
    });
});

function handleEncryptFile(file) {
    if (!file || !file.type.match('image/png')) {
        showMessage('encryptMessage', 'Si us plau, puja una imatge PNG.', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showMessage('encryptMessage', 'Fitxer massa gran. La mida màxima és de 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            encryptImage = img;
            document.getElementById('encryptBtn').disabled = false;
            showMessage('encryptMessage', '✓ Imatge carregada correctament! Introdueix el teu missatge i fes clic a Encriptar.', 'success');
            
            // Show preview
            const preview = document.getElementById('encryptImagePreview');
            preview.innerHTML = `<img src="${e.target.result}" class="image-preview" alt="Imatge Original">`;
            
            // Show pixel matrix preview
            showPixelMatrix(img, 'encryptPreview', 'original');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleDecryptFile(file) {
    if (!file || !file.type.match('image/png')) {
        showMessage('decryptMessage', 'Si us plau, puja una imatge PNG.', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showMessage('decryptMessage', 'Fitxer massa gran. La mida màxima és de 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            decryptImage = img;
            document.getElementById('decryptBtn').disabled = false;
            showMessage('decryptMessage', '✓ Imatge carregada correctament! Fes clic a Desencriptar per extreure el missatge.', 'success');
            
            // Show preview
            const preview = document.getElementById('decryptImagePreview');
            preview.innerHTML = `<img src="${e.target.result}" class="image-preview" alt="Imatge Encriptada">`;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function encryptMessage() {
    const message = document.getElementById('secretMessage').value;
    
    if (!message) {
        showMessage('encryptMessage', 'Si us plau, introdueix un missatge per amagar.', 'error');
        return;
    }
    
    if (!encryptImage) {
        showMessage('encryptMessage', 'Si us plau, puja una imatge primer.', 'error');
        return;
    }
    
    const params = getEncryptionParams();
    const validation = validateParams(params.a, params.b);
    
    if (!validation.valid) {
        showMessage('encryptMessage', validation.message, 'error');
        return;
    }
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = encryptImage.width;
    canvas.height = encryptImage.height;
    
    // Draw image
    ctx.drawImage(encryptImage, 0, 0);
    
    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Check capacity (need 8 bits per encrypted byte)
    const maxChars = Math.floor((pixels.length / 4) / 8);
    if (message.length > maxChars) {
        showMessage('encryptMessage', `Missatge massa llarg per a aquesta imatge. Màxim: ${maxChars} caràcters.`, 'error');
        return;
    }
    
    // Encode message length first (16 bits)
    const messageLength = message.length;
    for (let i = 0; i < 16; i++) {
        const bit = (messageLength >> (15 - i)) & 1;
        const pixelIndex = i * 4 + 2; // Blue channel
        pixels[pixelIndex] = (pixels[pixelIndex] & 0xFE) | bit;
    }
    
    // Encode message with modular arithmetic encryption
    let bitIndex = 16; // Start after length bits
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        const encryptedValue = encryptChar(charCode, params.a, params.b);
        
        // Store encrypted value (8 bits)
        for (let j = 7; j >= 0; j--) {
            const bit = (encryptedValue >> j) & 1;
            const pixelIndex = bitIndex * 4 + 2; // Blue channel only
            pixels[pixelIndex] = (pixels[pixelIndex] & 0xFE) | bit;
            bitIndex++;
        }
    }
    
    // Put modified data back
    ctx.putImageData(imageData, 0, 0);
    
    // Download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'imatge_encriptada.png';
        a.click();
        URL.revokeObjectURL(url);
        
        showMessage('encryptMessage', `✓ Missatge encriptat amb aritmètica modular (${params.a}x + ${params.b}) mod 256 i codificat correctament! La teva imatge encriptada s'ha descarregat.`, 'success');
        
        // Show encryption details
        showEncryptionDetails(message, params.a, params.b);
        
        // Show after matrix
        showPixelMatrix(canvas, 'encryptPreview', 'modificada');
    }, 'image/png');
}

function decryptMessage() {
    if (!decryptImage) {
        showMessage('decryptMessage', 'Si us plau, puja una imatge primer.', 'error');
        return;
    }
    
    const params = getEncryptionParams();
    const validation = validateParams(params.a, params.b);
    
    if (!validation.valid) {
        showMessage('decryptMessage', validation.message, 'error');
        return;
    }
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = decryptImage.width;
    canvas.height = decryptImage.height;
    
    // Draw image
    ctx.drawImage(decryptImage, 0, 0);
    
    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Decode message length (16 bits)
    let messageLength = 0;
    for (let i = 0; i < 16; i++) {
        const pixelIndex = i * 4 + 2; // Blue channel
        const bit = pixels[pixelIndex] & 1;
        messageLength = (messageLength << 1) | bit;
    }
    
    // Validate length
    if (messageLength > MAX_MESSAGE_LENGTH || messageLength === 0) {
        showMessage('decryptMessage', 'No s\'ha trobat cap missatge amagat vàlid en aquesta imatge.', 'error');
        return;
    }
    
    // Decode message with modular arithmetic decryption
    let message = '';
    let bitIndex = 16; // Start after length bits
    
    for (let i = 0; i < messageLength; i++) {
        let encryptedValue = 0;
        
        // Read 8 bits to get encrypted byte
        for (let j = 0; j < 8; j++) {
            const pixelIndex = bitIndex * 4 + 2; // Blue channel
            const bit = pixels[pixelIndex] & 1;
            encryptedValue = (encryptedValue << 1) | bit;
            bitIndex++;
        }
        
        // Decrypt using inverse formula
        const originalCharCode = decryptChar(encryptedValue, params.a, params.b);
        message += String.fromCharCode(originalCharCode);
    }
    
    // Display message
    document.getElementById('extractedMessage').innerHTML = `
        <div class="message success">
            <strong>🔓 Desencriptació Completa!</strong><br>
            <p style="margin-top: 10px;">Missatge desencriptat utilitzant la fórmula inversa d'aritmètica modular.</p>
            <p><strong>Paràmetres utilitzats:</strong> a=${params.a}, b=${params.b}</p>
            <div style="margin-top: 10px; padding: 15px; background: white; border-radius: 5px; border: 2px solid #28a745;">
                <strong>Missatge Amagat:</strong><br>
                <div style="font-family: monospace; font-size: 1.1em; margin-top: 10px;">${escapeHtml(message)}</div>
            </div>
        </div>
    `;
    
    showMessage('decryptMessage', '', '');
    
    // Show pixel matrix
    showPixelMatrix(canvas, 'decryptPreview', 'descodificada');
}

function showEncryptionDetails(message, a, b) {
    let details = '<div class="message info" style="margin-top: 20px;"><strong>🔐 Detalls d\'Encriptació (Primers 3 caràcters):</strong><br><br>';
    
    for (let i = 0; i < Math.min(3, message.length); i++) {
        const char = message[i];
        const ascii = message.charCodeAt(i);
        const encrypted = encryptChar(ascii, a, b);
        
        details += `<div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px;">`;
        details += `<strong>Caràcter:</strong> '${escapeHtml(char)}'<br>`;
        details += `<strong>Valor ASCII:</strong> ${ascii}<br>`;
        details += `<strong>Fórmula:</strong> (${a} × ${ascii} + ${b}) mod 256 = ${encrypted}<br>`;
        details += `<strong>Valor Encriptat:</strong> ${encrypted}<br>`;
        details += `<strong>Binari:</strong> ${encrypted.toString(2).padStart(8, '0')}`;
        details += `</div>`;
    }
    
    details += '</div>';
    
    const container = document.getElementById('encryptMessage');
    container.innerHTML += details;
}

function showPixelMatrix(source, containerId, label) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (source instanceof HTMLCanvasElement) {
        canvas.width = source.width;
        canvas.height = source.height;
        ctx.drawImage(source, 0, 0);
    } else {
        canvas.width = source.width;
        canvas.height = source.height;
        ctx.drawImage(source, 0, 0);
    }
    
    const imageData = ctx.getImageData(0, 0, Math.min(5, canvas.width), Math.min(5, canvas.height));
    const pixels = imageData.data;
    
    let html = `<div class="preview-container"><div class="preview-box">
        <h4>Vista Prèvia de la Matriu de Píxels (${label}) - Primers 5×5 píxels (Canal blau)</h4>
        <div class="matrix-grid">`;
    
    for (let i = 0; i < Math.min(25, pixels.length / 4); i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        const lsb = b & 1;
        html += `<div class="pixel-cell" style="background: rgb(${r},${g},${b}); color: ${b > 127 ? '#000' : '#fff'};">
            ${b}<br><small>LSB:${lsb}</small>
        </div>`;
    }
    
    html += '</div></div></div>';
    document.getElementById(containerId).innerHTML = html;
}

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (!message) {
        element.innerHTML = '';
        return;
    }
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}