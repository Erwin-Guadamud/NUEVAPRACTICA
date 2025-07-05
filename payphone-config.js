// Configuración de Payphone
const PAYPHONE_CONFIG = {
    // URL base de la API de Payphone (Sandbox)
    API_BASE_URL: 'https://pay.payphonetodoesposible.com',
    
    // Token de acceso (IMPORTANTE: Reemplazar con tu token real de Payphone)
    ACCESS_TOKEN: 'YOUR_PAYPHONE_ACCESS_TOKEN_HERE',
    
    // ID de la aplicación (IMPORTANTE: Reemplazar con tu App ID real)
    APP_ID: 'YOUR_APP_ID_HERE',
    
    // Configuración de la tienda
    STORE_CONFIG: {
        storeName: 'Mi Tienda Online',
        storeId: 'store_001',
        currency: 'USD'
    },
    
    // URLs de retorno
    REDIRECT_URLS: {
        // URL donde redirigir después de un pago exitoso
        success: window.location.origin + '/success.html',
        // URL donde redirigir después de un pago cancelado
        cancel: window.location.origin + '/cancel.html',
        // URL para recibir confirmaciones del pago (webhook)
        confirm: window.location.origin + '/webhook'
    },
    
    // Configuración de productos
    PRODUCTS: {
        default: {
            id: 'prod_001',
            name: 'Producto de Ejemplo',
            description: 'Descripción del producto que se va a comprar',
            price: 25.00,
            tax: 0.12 // 12% de IVA
        }
    }
};

// Función para validar la configuración
function validatePayphoneConfig() {
    const requiredFields = ['ACCESS_TOKEN', 'APP_ID'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!PAYPHONE_CONFIG[field] || PAYPHONE_CONFIG[field].includes('YOUR_')) {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        console.warn('⚠️ Configuración de Payphone incompleta. Campos faltantes:', missingFields);
        console.warn('Por favor, actualiza el archivo payphone-config.js con tus credenciales reales.');
        return false;
    }
    
    return true;
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PAYPHONE_CONFIG;
}
