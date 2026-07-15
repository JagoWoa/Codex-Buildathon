# StockFlow AI

Dashboard de inventario para una tienda de ropa, diseñado para mostrar cómo una arquitectura multiagente puede convertir datos operativos en decisiones de reposición claras.

La interfaz está construida directamente con React y representa el recorrido del encargado de inventario: detectar riesgo, observar el análisis de agentes, revisar una recomendación y confirmar una solicitud de compra.

## Ejecutar el proyecto

Requiere Node.js.

```powershell
npm.cmd install
npm.cmd run dev
```

Para crear la versión de producción:

```powershell
npm.cmd run build
```

## Funcionalidades

- Centro de control con métricas, alertas y productos críticos.
- Flujo de análisis multiagente con progreso simulado.
- Recomendaciones de reposición por producto.
- Solicitud de compra con confirmación.
- Vistas de solicitudes e historial.
- Diseño responsive con paleta verde salvia pastel y animaciones de entrada.

Consulta el documento de implementación en [docs/IMPLEMENTACIONES.md](docs/IMPLEMENTACIONES.md).

## Tecnologías

- React
- Vite
- Lucide React
- CSS nativo
