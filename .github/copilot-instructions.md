<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrucciones Personalizadas para Copilot - Proyecto Payphone

## Contexto del Proyecto
Este es un proyecto de pasarela de pago integrada con Payphone para Ecuador. El proyecto incluye:
- Una página web de checkout moderna y responsiva
- Integración completa con la API de Payphone
- Simulación de pagos para desarrollo
- Manejo completo de estados y errores

## Tecnologías Utilizadas
- HTML5 semántico
- CSS3 con Flexbox y Grid
- JavaScript vanilla (ES6+)
- API de Payphone
- Font Awesome para iconos

## Patrones de Código
- Usar const/let en lugar de var
- Preferir arrow functions cuando sea apropiado
- Implementar async/await para operaciones asíncronas
- Usar template literals para strings complejos
- Mantener separación de responsabilidades

## Convenciones de Nomenclatura
- Variables y funciones: camelCase (ej: `processPayment`)
- Constantes: UPPER_SNAKE_CASE (ej: `PAYPHONE_CONFIG`)
- Clases CSS: kebab-case (ej: `pay-button`)
- IDs de elementos: camelCase (ej: `payButton`)

## Estructura de Archivos
- `payphone-config.js`: Configuración y credenciales
- `script.js`: Lógica principal de la aplicación
- `styles.css`: Estilos CSS organizados por componentes
- `index.html`: Estructura HTML semántica

## Buenas Prácticas Específicas
- Validar todos los inputs del usuario
- Manejar errores de red graciosamente
- Mostrar estados de carga durante operaciones
- Implementar feedback visual para acciones del usuario
- Mantener la configuración separada del código lógico

## API de Payphone
- Usar siempre HTTPS en producción
- Validar respuestas de la API
- Implementar retry logic para fallos de red
- Nunca exponer tokens de acceso en el frontend en producción
- Usar el modo sandbox para desarrollo

## Consideraciones de Seguridad
- Validar datos tanto en cliente como servidor
- Sanitizar inputs del usuario
- Usar tokens seguros para autenticación
- Implementar validación de webhook signatures

## UX/UI Guidelines
- Priorizar claridad y simplicidad
- Usar animaciones suaves para transiciones
- Implementar estados de carga visibles
- Proporcionar feedback inmediato para acciones
- Mantener diseño responsivo para todos los dispositivos
