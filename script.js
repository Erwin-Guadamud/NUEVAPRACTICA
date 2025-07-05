// Variables globales
let currentTransaction = null;
let paymentInProgress = false;

// Elementos del DOM
const elements = {
    form: null,
    payButton: null,
    loadingOverlay: null,
    modal: null,
    modalTitle: null,
    modalIcon: null,
    modalMessage: null,
    transactionDetails: null,
    closeModalBtn: null,
    modalOkBtn: null
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Obtener elementos del DOM
    elements.form = document.getElementById('checkoutForm');
    elements.payButton = document.getElementById('payButton');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    elements.modal = document.getElementById('resultModal');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.modalIcon = document.getElementById('modalIcon');
    elements.modalMessage = document.getElementById('modalMessage');
    elements.transactionDetails = document.getElementById('transactionDetails');
    elements.closeModalBtn = document.getElementById('closeModal');
    elements.modalOkBtn = document.getElementById('modalOkBtn');

    // Configurar event listeners
    setupEventListeners();
    
    // Validar configuración de Payphone
    if (!validatePayphoneConfig()) {
        showConfigurationWarning();
    }
    
    // Calcular totales iniciales
    calculateTotals();
    
    console.log('✅ Aplicación inicializada correctamente');
}

function setupEventListeners() {
    // Formulario de checkout
    if (elements.form) {
        elements.form.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Botones del modal
    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (elements.modalOkBtn) {
        elements.modalOkBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal al hacer clic fuera de él
    if (elements.modal) {
        elements.modal.addEventListener('click', function(e) {
            if (e.target === elements.modal) {
                closeModal();
            }
        });
    }
}

function calculateTotals() {
    const product = PAYPHONE_CONFIG.PRODUCTS.default;
    const subtotal = product.price;
    const tax = subtotal * product.tax;
    const total = subtotal + tax;
    
    // Actualizar elementos en la página
    updateElement('subtotal', formatCurrency(subtotal));
    updateElement('tax', formatCurrency(tax));
    updateElement('total', formatCurrency(total));
    updateElement('productPrice', formatCurrency(subtotal));
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    if (paymentInProgress) {
        return;
    }
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Obtener datos del formulario
    const formData = getFormData();
    
    // Iniciar proceso de pago
    await processPayment(formData);
}

function validateForm() {
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('shake');
            field.focus();
            isValid = false;
            
            // Remover la clase de animación después de un tiempo
            setTimeout(() => {
                field.classList.remove('shake');
            }, 500);
        }
    });
    
    if (!isValid) {
        showNotification('Por favor, completa todos los campos requeridos', 'error');
    }
    
    return isValid;
}

function getFormData() {
    return {
        customerName: document.getElementById('customerName').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim()
    };
}

async function processPayment(customerData) {
    try {
        paymentInProgress = true;
        showLoading(true);
        
        // Preparar datos del pago
        const paymentData = preparePaymentData(customerData);
        
        // Simular llamada a la API de Payphone
        const result = await simulatePayphonePayment(paymentData);
        
        if (result.success) {
            currentTransaction = result.transaction;
            showPaymentResult(true, result);
        } else {
            showPaymentResult(false, result);
        }
        
    } catch (error) {
        console.error('Error procesando el pago:', error);
        showPaymentResult(false, { 
            error: 'Error interno del servidor',
            message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
        });
    } finally {
        paymentInProgress = false;
        showLoading(false);
    }
}

function preparePaymentData(customerData) {
    const product = PAYPHONE_CONFIG.PRODUCTS.default;
    const subtotal = product.price;
    const tax = subtotal * product.tax;
    const total = subtotal + tax;
    
    return {
        // Información del cliente
        client: {
            name: customerData.customerName,
            email: customerData.customerEmail,
            phone: customerData.customerPhone
        },
        
        // Información del pedido
        order: {
            id: generateOrderId(),
            description: product.description,
            amount: total,
            subtotal: subtotal,
            tax: tax,
            currency: PAYPHONE_CONFIG.STORE_CONFIG.currency
        },
        
        // Configuración de URLs
        urls: PAYPHONE_CONFIG.REDIRECT_URLS,
        
        // Metadatos
        metadata: {
            store: PAYPHONE_CONFIG.STORE_CONFIG.storeName,
            timestamp: new Date().toISOString()
        }
    };
}

function generateOrderId() {
    return 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Simulación de la API de Payphone (reemplazar con implementación real)
async function simulatePayphonePayment(paymentData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simular respuesta exitosa o fallida (80% éxito)
            const isSuccess = Math.random() > 0.2;
            
            if (isSuccess) {
                resolve({
                    success: true,
                    transaction: {
                        id: 'TXN-' + Date.now(),
                        orderId: paymentData.order.id,
                        amount: paymentData.order.amount,
                        currency: paymentData.order.currency,
                        status: 'completed',
                        paymentMethod: 'payphone',
                        customer: paymentData.client,
                        timestamp: new Date().toISOString(),
                        reference: 'REF-' + Math.random().toString(36).substr(2, 12).toUpperCase()
                    }
                });
            } else {
                resolve({
                    success: false,
                    error: 'payment_failed',
                    message: 'El pago no pudo ser procesado. Por favor, verifica tus datos e intenta nuevamente.'
                });
            }
        }, 2000); // Simular 2 segundos de procesamiento
    });
}

// IMPLEMENTACIÓN REAL DE PAYPHONE (comentada para referencia)
/*
async function callPayphoneAPI(paymentData) {
    try {
        const response = await fetch(`${PAYPHONE_CONFIG.API_BASE_URL}/api/v1/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PAYPHONE_CONFIG.ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                appId: PAYPHONE_CONFIG.APP_ID,
                clientTxId: paymentData.order.id,
                amount: paymentData.order.amount,
                currency: paymentData.order.currency,
                description: paymentData.order.description,
                client: paymentData.client,
                redirectUrls: paymentData.urls
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error llamando a la API de Payphone:', error);
        throw error;
    }
}
*/

function showPaymentResult(isSuccess, data) {
    if (isSuccess) {
        showSuccessModal(data.transaction);
    } else {
        showErrorModal(data);
    }
}

function showSuccessModal(transaction) {
    elements.modalTitle.textContent = '¡Pago Exitoso!';
    elements.modalIcon.innerHTML = '<i class="fas fa-check-circle success-icon"></i>';
    elements.modalMessage.textContent = '¡Tu pago ha sido procesado exitosamente!';
    
    // Mostrar detalles de la transacción
    const detailsHTML = `
        <h4>Detalles de la Transacción</h4>
        <div class="detail-item">
            <span>ID de Transacción:</span>
            <span>${transaction.id}</span>
        </div>
        <div class="detail-item">
            <span>Número de Orden:</span>
            <span>${transaction.orderId}</span>
        </div>
        <div class="detail-item">
            <span>Referencia:</span>
            <span>${transaction.reference}</span>
        </div>
        <div class="detail-item">
            <span>Método de Pago:</span>
            <span>Payphone</span>
        </div>
        <div class="detail-item">
            <span>Fecha:</span>
            <span>${new Date(transaction.timestamp).toLocaleString()}</span>
        </div>
        <div class="detail-item">
            <span>Total Pagado:</span>
            <span>${formatCurrency(transaction.amount)}</span>
        </div>
    `;
    
    elements.transactionDetails.innerHTML = detailsHTML;
    showModal();
}

function showErrorModal(errorData) {
    elements.modalTitle.textContent = 'Error en el Pago';
    elements.modalIcon.innerHTML = '<i class="fas fa-times-circle error-icon"></i>';
    elements.modalMessage.textContent = errorData.message || 'Ocurrió un error procesando tu pago.';
    
    elements.transactionDetails.innerHTML = `
        <h4>Información del Error</h4>
        <div class="detail-item">
            <span>Código de Error:</span>
            <span>${errorData.error || 'unknown'}</span>
        </div>
        <div class="detail-item">
            <span>Fecha:</span>
            <span>${new Date().toLocaleString()}</span>
        </div>
    `;
    
    showModal();
}

function showModal() {
    elements.modal.style.display = 'flex';
    elements.modal.classList.add('fade-in');
}

function closeModal() {
    elements.modal.style.display = 'none';
    elements.modal.classList.remove('fade-in');
    
    // Si el pago fue exitoso, limpiar el formulario
    if (currentTransaction) {
        resetForm();
        currentTransaction = null;
    }
}

function resetForm() {
    if (elements.form) {
        elements.form.reset();
    }
}

function showLoading(show) {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    
    if (elements.payButton) {
        elements.payButton.disabled = show;
        elements.payButton.textContent = show ? 'Procesando...' : 'Pagar con Payphone';
    }
}

function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1002;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function showConfigurationWarning() {
    const warningHTML = `
        <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; color: #92400e;">
            <h4 style="margin: 0 0 10px 0;">⚠️ Configuración Requerida</h4>
            <p style="margin: 0;">Para usar Payphone en producción, debes:</p>
            <ol style="margin: 10px 0 0 20px;">
                <li>Obtener tu token de acceso en <a href="https://payphone.app" target="_blank">payphone.app</a></li>
                <li>Actualizar las credenciales en <code>payphone-config.js</code></li>
                <li>Configurar las URLs de retorno</li>
            </ol>
            <p style="margin: 10px 0 0 0; font-size: 0.9em;"><strong>Nota:</strong> Actualmente funciona en modo simulación.</p>
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertAdjacentHTML('afterbegin', warningHTML);
    }
}

// Función para verificar el estado de un pago (útil para webhooks)
function checkPaymentStatus(transactionId) {
    // Implementar verificación del estado del pago
    console.log('Verificando estado del pago:', transactionId);
}

// Exportar funciones para uso global
window.PayphoneCheckout = {
    processPayment,
    checkPaymentStatus,
    validatePayphoneConfig
};
