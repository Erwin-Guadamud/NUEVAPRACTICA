/**
 * CAJITA INTEGRADA PAYPHONE - MÉTODO SDK OFICIAL
 * Implementación que carga la cajita directamente en la página
 */

// Configuración con credenciales exactas
const PAYPHONE_CONFIG = {
    token: 'f6YRPwZvLbU_-PyyZatgWqSqmsST6A-6tmHM5n9NAYLsRPrl3s0W0i72OQFi1dZjIpqHEIeLHLzAJCsGw7xofkwdg7f0a3sO0-sLaJucEDZTpSiY8-t4zvP9-Ga55EIuI8uHYNHBSAHStONeDuvfZiHw6MwmwZuU0LkkKRn_G4NY1ZF89iEZr34QdToTHrWvZuJcT0pZeLBFXzqwNkRPfrx6eyJKzmsEcbDyjy-qu7eVrgMo0lcvyg6YcvXilLcqDlLKiZ7xAC76_y2o07RhEML1OyqLh2KY_45iXuzMqMbGbQ0iYjFg6Mc8xRn59hzRGC1MqSV4JOKUiYJzdyAD3TgcBUg',
    storeId: 'a94cb5c4-e43c-4297-aade-d556bcc9a519',
    identifier: 'IiihzaMC3kKwvrfQVyRslA',
    amount: 25.00,
    currency: 'USD',
    urlReturn: window.location.origin + '/success.html',
    urlCancel: window.location.origin + '/cancel.html'
};

console.log('✅ Configuración Payphone cargada:', PAYPHONE_CONFIG);

// Estado de la aplicación
// let payphoneGenerated = false; // Eliminado: declaración duplicada
let sdkLoaded = false;

// Función para mostrar/ocultar loading
function toggleLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Función para mostrar mensajes de estado
function showMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.style.cssText = `
        padding: 12px;
        margin: 15px 0;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        ${type === 'warning' ? 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;' : ''}
        ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
    `;
    messageDiv.textContent = message;

    const container = document.getElementById('payphone-container');
    container.parentNode.insertBefore(messageDiv, container);

    // Auto-remover después de 8 segundos si es success o info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 8000);
    }

    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Cargar CSS del SDK de Payphone
function loadPayphoneCSS() {
    return new Promise((resolve) => {
        // Verificar si ya está cargado
        const existingLink = document.querySelector('link[href*="payphone-payment-box.css"]');
        if (existingLink) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css';
        link.onload = () => {
            console.log('✅ CSS del SDK cargado');
            resolve();
        };
        link.onerror = () => {
            console.log('⚠️ Error cargando CSS, continuando...');
            resolve(); // Continuar aunque falle el CSS
        };
        document.head.appendChild(link);
    });
}

// Cargar JavaScript del SDK de Payphone
function loadPayphoneJS() {
    return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (typeof PPaymentButtonBox !== 'undefined') {
            console.log('✅ SDK ya estaba cargado');
            sdkLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js';
        script.onload = () => {
            console.log('✅ SDK JavaScript cargado exitosamente');
            sdkLoaded = true;
            
            // Verificar que la clase esté disponible
            setTimeout(() => {
                if (typeof PPaymentButtonBox !== 'undefined') {
                    resolve();
                } else {
                    reject(new Error('Clase PPaymentButtonBox no disponible después de cargar SDK'));
                }
            }, 500);
        };
        script.onerror = () => {
            const error = new Error('Error cargando SDK de Payphone');
            console.error('❌', error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// Crear la cajita integrada de Payphone
function createIntegratedPayphoneBox() {
    try {
        const container = document.getElementById('pp-button');
        
        if (!container) {
            throw new Error('Contenedor #pp-button no encontrado');
        }

        // Verificar que el SDK esté disponible
        if (typeof PPaymentButtonBox === 'undefined') {
            throw new Error('SDK de Payphone no está disponible');
        }

        // Limpiar contenedor
        container.innerHTML = '';

        // Configuración de la cajita
        const boxConfig = {
            token: PAYPHONE_CONFIG.token,
            storeId: PAYPHONE_CONFIG.storeId,
            container: 'pp-button', // ID del contenedor
            payment: {
                amount: PAYPHONE_CONFIG.amount,
                storeId: PAYPHONE_CONFIG.storeId,
                currency: PAYPHONE_CONFIG.currency,
                identifier: PAYPHONE_CONFIG.identifier,
                urlReturn: PAYPHONE_CONFIG.urlReturn,
                urlCancel: PAYPHONE_CONFIG.urlCancel,
                lang: 'es',
                sandbox: false // Usar producción
            }
        };

        console.log('🔧 Configuración de cajita:', boxConfig);

        // Crear la cajita
        const paymentBox = new PPaymentButtonBox(boxConfig);
        
        console.log('✅ Cajita de Payphone creada:', paymentBox);
        showMessage('✅ ¡Cajita de Payphone lista! Puedes proceder con el pago.', 'success');
        
        return true;

    } catch (error) {
        console.error('❌ Error creando cajita integrada:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
        
        // Mostrar fallback en el contenedor
        const container = document.getElementById('pp-button');
        if (container) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; background: #f8d7da; border-radius: 8px; color: #721c24;">
                    <h4>❌ Error cargando cajita</h4>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        🔄 Recargar página
                    </button>
                </div>
            `;
        }
        
        return false;
    }
}

// Función principal para generar la cajita de pagos
function generatePayphoneBox() {
    if (payphoneGenerated) {
        showMessage('⚠️ La cajita ya fue generada. Úsala para proceder con el pago.', 'warning');
        return;
    }

    console.log('🚀 Iniciando generación de cajita integrada...');
    toggleLoading(true);
    showMessage('🔄 Cargando cajita de Payphone integrada...', 'info');

    // Obtener datos del formulario
    const customerName = document.getElementById('customer-name').value.trim();
    const customerEmail = document.getElementById('customer-email').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();

    // Validar datos
    if (!customerName || !customerEmail || !customerPhone) {
        toggleLoading(false);
        showMessage('❌ Por favor completa todos los campos del formulario', 'error');
        return;
    }

    // Cargar SDK y crear cajita
    loadSDKAndCreateBox();
}

// Cargar SDK y crear la cajita
async function loadSDKAndCreateBox() {
    try {
        console.log('📦 Cargando SDK de Payphone...');
        
        // Cargar CSS y JS del SDK
        await loadPayphoneCSS();
        await loadPayphoneJS();

        console.log('✅ SDK cargado completamente');
        
        // Esperar un momento para que el SDK se inicialice completamente
        setTimeout(() => {
            toggleLoading(false);
            
            if (createIntegratedPayphoneBox()) {
                payphoneGenerated = true;
                
                // Actualizar el botón
                const generateButton = document.getElementById('generate-payphone-button');
                if (generateButton) {
                    generateButton.textContent = '🔄 Regenerar Cajita';
                    generateButton.onclick = function() {
                        payphoneGenerated = false;
                        const container = document.getElementById('payphone-container');
                        container.style.display = 'none';
                        generateButton.textContent = '🛒 Generar Cajita de Payphone';
                        generateButton.onclick = generatePayphoneBox;
                        showMessage('🔄 Puedes generar una nueva cajita', 'info');
                    };
                }
                
                // Mostrar contenedor
                const container = document.getElementById('payphone-container');
                if (container) {
                    container.style.display = 'block';
                }
            }
        }, 1500);

    } catch (error) {
        toggleLoading(false);
        console.error('❌ Error cargando SDK:', error);
        showMessage(`❌ Error cargando SDK: ${error.message}. Verifica tu conexión a internet.`, 'error');
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sistema de cajita integrada inicializado');
    
    // Asignar evento al botón de generar
    const generateButton = document.getElementById('generate-payphone-button');
    if (generateButton) {
        generateButton.addEventListener('click', generatePayphoneBox);
        console.log('✅ Botón de generación configurado');
    }

    // Ocultar loading inicial
    toggleLoading(false);
    
    console.log('🎉 ¡Sistema listo para mostrar cajita integrada!');
});

// Manejo de errores globales
window.addEventListener('error', function(event) {
    console.error('❌ Error detectado:', event.error);
    if (event.error && event.error.message && event.error.message.includes('PPaymentButtonBox')) {
        showMessage('⚠️ Error del SDK de Payphone. Reintenta en unos segundos.', 'warning');
    }
});

// Exportar funciones para debug
window.PayphoneDebug = {
    config: PAYPHONE_CONFIG,
    generateBox: generatePayphoneBox,
    loadSDK: loadSDKAndCreateBox,
    sdkLoaded: () => sdkLoaded,
    boxGenerated: () => payphoneGenerated
};

// Estado de la aplicación
let payphoneGenerated = false;

// Función para mostrar/ocultar loading
function toggleLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Función para mostrar mensajes de estado
function showMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.style.cssText = `
        padding: 12px;
        margin: 15px 0;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        ${type === 'warning' ? 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;' : ''}
        ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
    `;
    messageDiv.textContent = message;

    const container = document.getElementById('payphone-container');
    container.parentNode.insertBefore(messageDiv, container);

    // Auto-remover después de 5 segundos si es success o info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Función principal para generar la cajita de pagos
function generatePayphoneBox() {
    if (payphoneGenerated) {
        showMessage('⚠️ La cajita ya fue generada. Usa el botón de pago existente.', 'warning');
        return;
    }

    console.log('🚀 Iniciando generación de cajita Payphone...');
    toggleLoading(true);
    showMessage('🔄 Generando cajita de pagos segura...', 'info');

    // Obtener datos del formulario
    const customerName = document.getElementById('customer-name').value.trim();
    const customerEmail = document.getElementById('customer-email').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();

    // Validar datos
    if (!customerName || !customerEmail || !customerPhone) {
        toggleLoading(false);
        showMessage('❌ Por favor completa todos los campos del formulario', 'error');
        return;
    }

    // Simular tiempo de procesamiento
    setTimeout(() => {
        createDirectPaymentButton(customerName, customerEmail, customerPhone);
    }, 1500);
}

// Función para crear el botón de pago directo
function createDirectPaymentButton(customerName, customerEmail, customerPhone) {
    const container = document.getElementById('payphone-container');
    const buttonContainer = document.getElementById('pp-button');

    // Crear el botón de pago personalizado
    buttonContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%); 
                    padding: 20px; 
                    border-radius: 12px; 
                    text-align: center; 
                    box-shadow: 0 8px 25px rgba(0, 212, 170, 0.3);">
            <div style="color: white; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 18px;">💳 Pago Seguro con Payphone</h4>
                <p style="margin: 0; opacity: 0.9; font-size: 14px;">
                    Total a pagar: <strong>$${PAYPHONE_CONFIG.amount} ${PAYPHONE_CONFIG.currency}</strong>
                </p>
            </div>
            
            <button id="direct-payment-button" 
                    style="background: white; 
                           color: #00B894; 
                           border: none; 
                           padding: 15px 40px; 
                           border-radius: 50px; 
                           font-size: 16px; 
                           font-weight: bold; 
                           cursor: pointer; 
                           transition: all 0.3s ease;
                           box-shadow: 0 4px 15px rgba(0,0,0,0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                🔒 Procesar Pago con Payphone
            </button>
            
            <div style="color: white; margin-top: 15px; font-size: 12px; opacity: 0.8;">
                ✅ Pago 100% seguro &nbsp;•&nbsp; ✅ Procesado por Payphone &nbsp;•&nbsp; ✅ Confirmación inmediata
            </div>
        </div>
    `;

    // Asignar evento al botón
    document.getElementById('direct-payment-button').addEventListener('click', function() {
        processDirectPayment(customerName, customerEmail, customerPhone);
    });

    // Mostrar contenedor y actualizar estado
    container.style.display = 'block';
    toggleLoading(false);
    payphoneGenerated = true;

    showMessage('✅ ¡Cajita de pagos generada exitosamente! Haz clic en el botón para proceder.', 'success');

    // Cambiar el botón de generar
    const generateButton = document.getElementById('generate-payphone-button');
    generateButton.textContent = '🔄 Regenerar Cajita';
    generateButton.onclick = function() {
        payphoneGenerated = false;
        container.style.display = 'none';
        generateButton.textContent = '🛒 Generar Cajita de Payphone';
        generateButton.onclick = generatePayphoneBox;
        showMessage('🔄 Puedes generar una nueva cajita', 'info');
    };

    console.log('✅ Cajita de pagos creada exitosamente');
}

// Función para procesar el pago directo
function processDirectPayment(customerName, customerEmail, customerPhone) {
    showMessage('🔄 Preparando redirección a Payphone...', 'warning');
    
    console.log('💳 Iniciando pago directo para:', { customerName, customerEmail, customerPhone });

    // Datos del pago
    const paymentData = {
        token: PAYPHONE_CONFIG.token,
        storeId: PAYPHONE_CONFIG.storeId,
        amount: PAYPHONE_CONFIG.amount,
        currency: PAYPHONE_CONFIG.currency,
        identifier: PAYPHONE_CONFIG.identifier,
        urlReturn: PAYPHONE_CONFIG.urlReturn,
        urlCancel: PAYPHONE_CONFIG.urlCancel,
        lang: 'es',
        description: 'Camiseta Artesanal Ecuatoriana - ChicStore'
    };

    console.log('📊 Datos del pago completos:', paymentData);

    // URLs a probar en orden de prioridad
    const payphoneUrls = [
        'https://pay.payphone.app/button/pay',
        'https://api.payphone.app/button/pay',
        'https://pay.payphonetodoesposible.com/api/button/pay'
    ];

    // Función para crear y enviar formulario
    function sendPaymentForm(url) {
        console.log(`🔗 Enviando formulario a: ${url}`);
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = '_blank';
        form.style.display = 'none';

        // Crear campos del formulario
        Object.keys(paymentData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        });

        // Agregar al DOM y enviar
        document.body.appendChild(form);
        
        try {
            form.submit();
            console.log('✅ Formulario enviado exitosamente');
            
            // Limpiar después de enviar
            setTimeout(() => {
                if (form.parentNode) {
                    document.body.removeChild(form);
                }
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('❌ Error enviando formulario:', error);
            if (form.parentNode) {
                document.body.removeChild(form);
            }
            return false;
        }
    }

    // Función para método GET como alternativa
    function openPaymentUrlGet() {
        const params = new URLSearchParams(paymentData);
        const paymentUrl = `https://pay.payphone.app/button/pay?${params.toString()}`;
        
        console.log('🌐 Abriendo URL con método GET:', paymentUrl);
        
        try {
            window.open(paymentUrl, '_blank');
            return true;
        } catch (error) {
            console.error('❌ Error abriendo URL:', error);
            return false;
        }
    }

    // Intentar con cada URL
    let success = false;
    
    for (const url of payphoneUrls) {
        if (sendPaymentForm(url)) {
            success = true;
            showMessage('🚀 Formulario enviado a Payphone. Verifica si se abrió nueva ventana.', 'success');
            break;
        }
    }

    // Si todos los POST fallan, intentar GET
    if (!success) {
        console.log('⚠️ Todos los métodos POST fallaron, intentando con GET...');
        if (openPaymentUrlGet()) {
            showMessage('🚀 Abriendo Payphone con método alternativo...', 'success');
        } else {
            showMessage('❌ Error: No se pudo conectar con Payphone. Verifica las credenciales.', 'error');
        }
    }

    // Mostrar instrucciones al usuario
    setTimeout(() => {
        showMessage('💡 Si no se abrió ventana de Payphone, permite ventanas emergentes en tu navegador.', 'info');
    }, 3000);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sistema Payphone inicializado');
    
    // Asignar evento al botón de generar
    const generateButton = document.getElementById('generate-payphone-button');
    if (generateButton) {
        generateButton.addEventListener('click', generatePayphoneBox);
        console.log('✅ Botón de generación configurado');
    }

    // Ocultar loading inicial
    toggleLoading(false);
    
    console.log('🎉 ¡Sistema listo para procesar pagos!');
});

// Manejo de errores globales
window.addEventListener('error', function(event) {
    console.error('❌ Error detectado:', event.error);
    showMessage('⚠️ Se detectó un error. Por favor recarga la página.', 'error');
});

// Exportar funciones para debug (opcional)
window.PayphoneDebug = {
    config: PAYPHONE_CONFIG,
    generateBox: generatePayphoneBox,
    processPayment: processDirectPayment
};
