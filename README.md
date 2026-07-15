# StockFlow AI 📦🤖

Dashboard de inventario inteligente para tiendas de ropa, diseñado para demostrar cómo una arquitectura de agentes y un backend en vivo pueden automatizar y optimizar la toma de decisiones de reposición en base a datos de consumo y cobertura.

Este proyecto representa el recorrido del Encargado de Inventario: detectar riesgos de desabastecimiento, visualizar el análisis de los agentes inteligentes, revisar recomendaciones automáticas basadas en costos y tiempos de entrega, y aprobar solicitudes de compra en tiempo real.

---

## 🚀 Características Principales

- **Centro de Control Dinámico**: Visualización de métricas críticas en tiempo real (productos monitoreados, alertas activas, solicitudes aprobadas e inversión estimada).
- **Flujo de Análisis Multiagente**: Simulación interactiva del proceso de análisis a través de 3 agentes especializados:
  1. **Inventory Analysis Agent**: Evalúa niveles de stock y calcula días de cobertura.
  2. **Replenishment Planning Agent**: Calcula cantidades a pedir y selecciona el mejor proveedor (costo vs. rapidez).
  3. **Purchasing Approval Agent**: Genera la propuesta formal para aprobación humana.
- **Base de Datos en Vivo**: Integración con **Supabase** (PostgreSQL) alojado en AWS (Canadá), con RLS y relaciones entre tablas (`inventario`, `proveedores`, `solicitudes_reposicion`, `historial_decisiones`).
- **Pruebas de Integración y E2E**: Suite completa de pruebas automatizadas con **Playwright** que validan el flujo completo desde el análisis hasta la aprobación.
- **Script de Migración Robusto**: Conexión optimizada mediante el Connection Pooler de Supabase (Supavisor) en el puerto `6543` para evitar bloqueos IPv4.

---

## 📂 Estructura del Proyecto

A continuación se detallan las carpetas y archivos clave del proyecto:

*   **[docs-backend/](docs-backend/)**: Documentación detallada del backend, base de datos y testing.
    *   [IMPLEMENTACION_BD_Y_TESTING.md](docs-backend/IMPLEMENTACION_BD_Y_TESTING.md): Especificación técnica de Supabase, tablas, RLS, semilla de datos y Playwright.
*   **[docs-frontend/](docs-frontend/)**: Documentación del diseño e interfaz.
    *   [IMPLEMENTACIONES.md](docs-frontend/IMPLEMENTACIONES.md): Flujo del dashboard, agentes y diseño estético.
*   **[docs-planificiacion/](docs-planificiacion/)**: Plan de trabajo y requerimientos del MVP.
    *   [contexto-proyecto.md](docs-planificiacion/contexto-proyecto.md): Entendimiento y objetivos de negocio.
    *   [planificicacion-implementacion.md](docs-planificiacion/planificicacion-implementacion.md): Plan de hitos y alcance del MVP.
*   **[src/](src/)**: Código fuente de la aplicación React.
    *   [src/supabaseClient.js](src/supabaseClient.js): Cliente de conexión a Supabase utilizando variables de entorno.
    *   [src/main.jsx](src/main.jsx): Componente principal del dashboard e interfaz.
    *   [src/styles.css](src/styles.css): Diseño estético del dashboard (paleta verde salvia pastel, animaciones y glassmorphism).
*   **[tests/](tests/)**: Pruebas automatizadas.
    *   [tests/e2e.spec.js](tests/e2e.spec.js): Flujo de prueba de extremo a extremo con Playwright.
*   **[supabase-setup.sql](supabase-setup.sql)**: Definición del esquema PostgreSQL, políticas de RLS e inserción de datos semilla.
*   **[migrate.js](migrate.js)**: Script Node.js de migración para resetear e inicializar la base de datos de manera automatizada.

---

## 🛠️ Requisitos Previos

- **Node.js** (v18 o superior recomendado)
- **npm** (v9 o superior)
- Instancia activa de **Supabase** (o usar la instancia demo por defecto configurada en `.env.local`)

---

## ⚙️ Configuración y Uso

### 1. Clonar e Instalar Dependencias

Instala todas las dependencias del proyecto, incluyendo el cliente de Supabase y las herramientas de desarrollo:

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (basado en [.env.example](.env.example)):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

*Nota: El proyecto ya incluye un archivo `.env.local` por defecto que apunta a la base de datos de demostración en vivo.*

### 3. Ejecutar Migraciones de Base de Datos (Opcional)

Si deseas recrear el esquema de base de datos e insertar los datos semilla en Supabase, ejecuta el script de migración pasándole la contraseña de tu base de datos PostgreSQL de Supabase:

```bash
node migrate.js <contraseña_db_supabase>
```

### 4. Iniciar Servidor de Desarrollo

Inicia el entorno local de desarrollo con Vite:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### 5. Compilar para Producción

Genera el empaquetado optimizado para despliegue:

```bash
npm run build
```

---

## 🧪 Pruebas de Integración (Playwright)

El proyecto cuenta con una prueba de extremo a extremo que realiza todo el flujo de forma autónoma:
1. Carga el Dashboard y verifica métricas.
2. Simula el análisis de los 3 agentes de IA.
3. Selecciona una recomendación crítica (`Chaqueta Denim Classic`).
4. Genera la solicitud de compra y la confirma.
5. Aprueba la compra desde la sección de solicitudes.
6. Comprueba que el movimiento quedó registrado en el Historial.

Para ejecutar las pruebas:

```bash
# Instala navegadores de Playwright si es la primera vez
npx playwright install chromium

# Ejecuta los tests en modo headless (consola)
npx playwright test

# Ejecuta los tests con interfaz gráfica (UI)
npx playwright test --ui
```

*Nota: La configuración en [playwright.config.js](playwright.config.js) levantará el servidor de desarrollo de Vite automáticamente en el puerto `5173` para realizar las pruebas y lo cerrará al terminar.*
