# Implementación de Base de Datos, Datos de Semilla y Pruebas E2E (StockFlow AI)

Este documento detalla la integración del backend con Supabase, el esquema de base de datos implementado, los datos semilla de demostración, el script de migración, y la suite de pruebas E2E configurada mediante Playwright para el MVP de StockFlow AI.

---

## 1. Arquitectura y Base de Datos (Supabase)

Se ha integrado la aplicación React con un backend en vivo en **Supabase** (ID de referencia del proyecto: `ckvbubwbaouxobqmfvum`), alojado en la región **ca-central-1** (Canadá Central) de AWS. 

El archivo de configuración y esquema de la base de datos es **[supabase-setup.sql](file:///home/neicervb/Documentos/Codex-Buildathon/supabase-setup.sql)**.

### Esquema de Tablas
Se definen cuatro tablas principales con sus relaciones correspondientes:

1. **`inventario`**: Almacena las prendas monitoreadas.
   - `id` (PK, Autoincremental)
   - `producto` (VARCHAR)
   - `categoria` (VARCHAR)
   - `talla` (VARCHAR)
   - `stock_actual` (INTEGER)
   - `consumo_diario_promedio` (NUMERIC)
   - `imagen` (VARCHAR)
2. **`proveedores`**: Almacena los proveedores asociados a cada producto.
   - `id` (PK, Autoincremental)
   - `producto_id` (FK a `inventario.id`)
   - `nombre` (VARCHAR)
   - `costo_unitario` (NUMERIC)
   - `plazo_entrega_dias` (INTEGER)
3. **`solicitudes_reposicion`**: Registra las solicitudes de compra generadas.
   - `id` (PK, Autoincremental)
   - `producto_id` (FK a `inventario.id`)
   - `proveedor_id` (FK a `proveedores.id`)
   - `cantidad` (INTEGER)
   - `costo_estimado` (NUMERIC)
   - `estado` (VARCHAR: `pendiente`, `aprobada`, `en tránsito`, `cerrada`)
   - `fecha_creacion` (TIMESTAMPTZ)
4. **`historial_decisiones`**: Bitácora del motor de decisiones.
   - `id` (PK, Autoincremental)
   - `producto_id` (FK a `inventario.id`)
   - `decision` (VARCHAR)
   - `explicacion` (TEXT)
   - `fecha` (TIMESTAMPTZ)

### Seguridad y RLS (Row Level Security)
Para asegurar el funcionamiento del MVP sin comprometer la estabilidad en la demo de 3 minutos, se habilitó RLS con las siguientes políticas públicas:
* Lectura pública habilitada en todas las tablas (`SELECT USING true`).
* Escritura pública para inserción de solicitudes e historial (`INSERT WITH CHECK true`).

---

## 2. Datos Semilla (Mock Data)

El script SQL realiza la inserción de **9 productos** de prueba, cubriendo las categorías de *Outerwear*, *Sastrería*, *Bottoms*, *Camisas*, *Vestidos*, *Camisetas*, *Jeans*, *Zapatos* y *Gorras* para alinearse con los requerimientos originales del proyecto:

* **Casos de Riesgo Crítico/Alto**:
  * *Chaqueta Denim Classic* (talla L, stock: 5, consumo: 2.50) -> Quedan 2 días de stock. Ningún proveedor entrega a tiempo, lo que activa la advertencia y selecciona la alternativa más rápida (`Confecciones Express` en 2 días).
  * *Tenis Urban Retro* (talla 42, stock: 4, consumo: 1.00) -> Quedan 4 días de stock. Ambos proveedores entregan a tiempo; la IA selecciona el de menor costo total (`Calzado Express`).
  * *Camiseta Básica Algodón* (talla M, stock: 15, consumo: 4.00) -> Quedan 3.75 días de stock.
* **Casos Saludables**:
  * *Camisa Oxford Blanca* (talla M, stock: 35, consumo: 1.20) -> Cobertura de 29 días.
  * *Jeans Slim Fit Indigo* (talla 32, stock: 50, consumo: 1.50) -> Cobertura de 33 días.
* **Casos Límite**:
  * *Vestido Midi Lino* (talla S, stock: 2, consumo: 0.00) -> Consumo cero para evitar problemas de división por cero en el motor.

---

## 3. Script de Migración Automatizada (`migrate.js`)

Se ha diseñado el archivo **[migrate.js](file:///home/neicervb/Documentos/Codex-Buildathon/migrate.js)**. 

### ¿Por qué se necesita?
Supabase restringe el acceso directo a PostgreSQL en puertos directos (`5432`) mediante redes IPv4 puras. Para solventarlo, el script se conecta a través del **Connection Pooler de Supabase (Supavisor)** en el puerto **`6543`** bajo la dirección `aws-0-ca-central-1.pooler.supabase.com`, utilizando credenciales de inquilino (`postgres.ckvbubwbaouxobqmfvum`).

### Ejecución
Para ejecutar y resetear la base de datos con los datos de ejemplo:
```bash
node migrate.js <contraseña_db_supabase>
```

---

## 4. Pruebas de Integración y E2E (Playwright)

Se han añadido los archivos de pruebas en **[playwright.config.js](file:///home/neicervb/Documentos/Codex-Buildathon/playwright.config.js)** y **[tests/e2e.spec.js](file:///home/neicervb/Documentos/Codex-Buildathon/tests/e2e.spec.js)**.

### Funcionalidad del Test
El test realiza de forma automática y secuencial:
1. **Navegación al Dashboard**: Comprueba que el banner y las métricas de control se rendericen.
2. **Análisis Multiagente**: Presiona **Analizar inventario** y espera a que los 3 agentes progresen en su análisis.
3. **Visualización de Recomendaciones**: Pasa a la vista de resultados y selecciona la recomendación para `Chaqueta Denim Classic`.
4. **Validación de la Propuesta**: Verifica la sugerencia y la justificación dada por la IA.
5. **Creación de la Solicitud**: Presiona **Generar solicitud** y confirma la transacción en el modal.
6. **Aprobación de Compra**: Navega al panel de **Solicitudes**, verifica que esté en estado `pendiente` y la aprueba.
7. **Verificación de Historial**: Navega a **Historial** y constata que el evento e inversión se hayan grabado con éxito en la bitácora.

### Ejecución de las Pruebas
Puedes ejecutar el test runner mediante:
```bash
npx playwright test
```
*Esto iniciará el servidor de desarrollo de Vite automáticamente en segundo plano, ejecutará el navegador Chromium sin cabecera (headless) para interactuar con la aplicación conectada a Supabase, y cerrará todo al terminar.*
