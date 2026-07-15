# Implementaciones de StockFlow AI

## Objetivo

StockFlow AI se presenta como una herramienta para el encargado de inventario de una tienda de ropa. El prototipo convierte un proceso de reposición normalmente manual en un recorrido guiado por agentes de IA.

## Experiencia implementada

### 1. Centro de control

La pantalla inicial reúne los indicadores más importantes:

- Productos monitoreados.
- Referencias que requieren atención.
- Solicitudes pendientes de aprobación.
- Alertas priorizadas por riesgo y cobertura de inventario.

Cada alerta muestra producto, categoría, talla, unidades disponibles, días de cobertura y nivel de riesgo. Al seleccionarla se abre su recomendación.

### 2. Análisis multiagente

El botón **Analizar inventario** inicia un estado de carga que representa a los tres agentes definidos para el producto:

1. **Inventory Analysis Agent**: revisa existencias, rotación y cobertura.
2. **Replenishment Planning Agent**: calcula cantidades y proveedor.
3. **Recommendation Agent**: prepara el mensaje comprensible para la persona responsable.

La simulación avanza automáticamente. Cada agente cambia de *en espera* a *analizando* y finalmente a *listo*. La barra de progreso y el indicador de carga muestran el avance general.

### 3. Resultados y recomendación

Después de completar el análisis, el usuario puede revisar productos críticos en tarjetas. El detalle de cada producto incluye:

- Stock actual y días de cobertura estimados.
- Motivo de la acción recomendada.
- Proveedor sugerido.
- Cantidad propuesta.
- Tiempo estimado de entrega.

### 4. Solicitud de reposición

Desde el detalle se puede generar una solicitud. El modal presenta el producto, proveedor, unidades, inversión estimada y una confirmación de creación de la solicitud.

### 5. Solicitudes e historial

Se agregaron vistas independientes para solicitudes pendientes e historial de decisiones, con ejemplos de estados aprobados, en tránsito y cerrados.

## Diseño y movimiento

La interfaz usa una paleta verde salvia/mint pastel, fondos claros y contrastes suaves para alejarse del estilo oscuro inicial. Se agregaron:

- Animación de entrada para cada vista.
- Aparición escalonada en métricas, listas y tarjetas.
- Transiciones de tarjetas y botones al interactuar.
- Pulso para el orquestador durante el análisis.
- Spinner para el agente que se encuentra activo.
- Soporte para `prefers-reduced-motion`, que reduce las animaciones para usuarios que lo requieran.

## Datos de demostración

El prototipo usa información local en `src/main.jsx`; no está conectado todavía con Supabase, FastAPI ni la API de OpenAI. Los datos incluyen tres prendas de ejemplo y sus recomendaciones para permitir navegar la experiencia completa sin dependencias de backend.

## Estructura relevante

```text
src/main.jsx       Componentes, vistas y estados de interacción
src/styles.css     Diseño responsive, paleta y animaciones
package.json       Scripts de desarrollo y compilación
```

## Verificación

Se verificó la compilación de producción con:

```powershell
npm.cmd run build
```
