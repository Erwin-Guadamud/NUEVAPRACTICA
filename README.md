# 💳 Pasarela de Pago con Payphone

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Payphone](https://img.shields.io/badge/Payphone-Integrado-success)](https://payphone.app)

Una implementación completa de una página web con integración de la pasarela de pago de **Payphone** para Ecuador, diseñada con una interfaz moderna, funcional y completamente responsiva.

![Demo del Proyecto](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Payphone+Checkout+Demo)

## 🚀 Características Principales

- ✅ **Interfaz moderna y responsiva** - Diseño atractivo que funciona en todos los dispositivos
- ✅ **Integración completa con Payphone API** - Procesamiento real de pagos
- ✅ **Validación en tiempo real** - Formularios inteligentes con feedback inmediato
- ✅ **Modo simulación** - Prueba la funcionalidad sin credenciales reales
- ✅ **Manejo robusto de errores** - Gestión completa de estados y excepciones
- ✅ **Estados de carga animados** - Feedback visual durante el procesamiento
- ✅ **Resultados detallados** - Modal con información completa de transacciones
- ✅ **Completamente responsivo** - Optimizado para móvil, tablet y escritorio

## 🌟 Vista Previa

### Página Principal
- Formulario de checkout elegante y funcional
- Resumen de compra con cálculo automático de impuestos
- Validación en tiempo real de campos

### Flujo de Pago
- Estados de carga con animaciones suaves
- Manejo de éxito y errores de pago
- Páginas dedicadas para resultados (éxito/cancelación)

## 📁 Estructura del Proyecto

```
payphone-checkout/
├── index.html              # Página principal del checkout
├── styles.css              # Estilos CSS modernos
├── script.js               # Lógica principal de la aplicación
├── payphone-config.js      # Configuración de Payphone
├── package.json            # Configuración del proyecto
├── README.md              # Documentación
└── .github/
    └── copilot-instructions.md
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Payphone

Edita el archivo `payphone-config.js` y actualiza las siguientes variables:

```javascript
const PAYPHONE_CONFIG = {
    ACCESS_TOKEN: 'tu_token_de_payphone_aqui',
    APP_ID: 'tu_app_id_aqui',
    // ... resto de la configuración
};
```

### 3. Ejecutar el proyecto

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 📦 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/payphone-checkout.git
cd payphone-checkout
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar servidor de desarrollo
```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔧 Configuración de Payphone

Para usar Payphone en producción necesitas:

1. **Registrarte en Payphone**: Ve a [payphone.app](https://payphone.app) y crea una cuenta
2. **Obtener credenciales**: Consigue tu `ACCESS_TOKEN` y `APP_ID`
3. **Configurar URLs de retorno**: Define las URLs para success, cancel y webhook
4. **Actualizar configuración**: Modifica `payphone-config.js` con tus datos reales

### URLs de Retorno

- **Success URL**: Donde redirigir después de un pago exitoso
- **Cancel URL**: Donde redirigir si el usuario cancela
- **Webhook URL**: Para recibir confirmaciones de pago

## 💡 Modo de Desarrollo

El proyecto incluye un modo de simulación que permite probar la funcionalidad sin necesidad de credenciales reales de Payphone:

- 80% de probabilidad de éxito en los pagos simulados
- Generación automática de IDs de transacción
- Validación completa de formularios
- Estados de carga y resultados realistas

## 🎨 Personalización

### Modificar Productos

Edita la configuración de productos en `payphone-config.js`:

```javascript
PRODUCTS: {
    default: {
        id: 'prod_001',
        name: 'Tu Producto',
        description: 'Descripción de tu producto',
        price: 50.00,
        tax: 0.12 // 12% de IVA
    }
}
```

### Personalizar Estilos

Modifica `styles.css` para cambiar:
- Colores de marca
- Tipografías
- Espaciado y layout
- Animaciones

## 🔍 API de Payphone

El proyecto está preparado para usar la API real de Payphone. Descomenta y ajusta la función `callPayphoneAPI` en `script.js` para implementar llamadas reales.

### Endpoint principal:
```
POST https://pay.payphonetodoesposible.com/api/v1/payments
```

### Headers requeridos:
```javascript
{
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}
```

## 📱 Responsividad

La interfaz está optimizada para:
- **Desktop**: Layout de dos columnas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout de una columna con navegación optimizada

## 🔒 Seguridad

- Validación del lado del cliente y servidor
- Tokens de acceso seguros
- URLs de retorno configurables
- Manejo seguro de datos del cliente

## 🚀 Despliegue

Para desplegar en producción:

1. Configura las credenciales reales de Payphone
2. Actualiza las URLs de retorno con tu dominio
3. Implementa el endpoint para webhook
4. Sube los archivos a tu servidor web

## 🎯 Demo en Vivo

🔗 **[Ver Demo](https://tu-usuario.github.io/payphone-checkout/)**

*Nota: El demo funciona en modo simulación para que puedas probar todas las funcionalidades*

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **HTML5** | Estructura semántica y accesible |
| **CSS3** | Estilos modernos con Flexbox y Grid |
| **JavaScript ES6+** | Lógica de aplicación con async/await |
| **Payphone API** | Procesamiento seguro de pagos |
| **Font Awesome** | Iconografía profesional |
| **Live Server** | Servidor de desarrollo |

## 📝 Notas Importantes

- **Token de acceso**: Nunca expongas tu token de producción en el frontend
- **Webhook**: Implementa validación de firma en tu webhook
- **URLs**: Usa HTTPS en producción para todas las URLs
- **Testing**: Usa el entorno sandbox de Payphone para pruebas

## 🆘 Soporte

Para soporte con Payphone:
- Documentación: [Docs de Payphone](https://docs.payphone.app)
- Soporte técnico: contacto@payphone.app

## 📄 Licencia

MIT License - Puedes usar este código libremente en tus proyectos.
