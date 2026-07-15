# Planificación del MVP — StockFlow AI

> **Objetivo:** entregar en las 2 horas restantes del hackathon una demostración estable del flujo de análisis y reposición de inventario.

## 1. Resultado esperado

La demostración debe permitir que el Encargado de Inventario:

1. Presione **Analizar inventario**.
2. Consulte el inventario simulado almacenado en Supabase.
3. Identifique prendas con riesgo de agotarse.
4. Revise la cantidad y el proveedor recomendados, junto con una explicación.
5. Apruebe una recomendación de reposición.
6. Confirme que la solicitud y la decisión quedaron registradas.

La demo completa debe poder ejecutarse desde una recarga limpia en menos de 3 minutos.

## 2. Alcance congelado

### Incluido

- Una sola sucursal o bodega.
- Inventario simulado en Supabase.
- Productos de demostración: camisetas, jeans, chaquetas, vestidos, zapatos y gorras.
- Consumo calculado mediante un promedio diario simple.
- Detección de riesgo de desabastecimiento.
- Recomendación de cantidad y proveedor.
- Explicación determinista de cada recomendación.
- Aprobación humana obligatoria.
- Generación de una solicitud de reposición con estado `pendiente`.
- Registro de la decisión en un historial.
- Mensajes y notificaciones únicamente dentro de la aplicación.

### Fuera de alcance

- Integraciones con ERP o plataformas de proveedores.
- Pedidos o pagos reales.
- Múltiples sucursales o bodegas.
- Predicción avanzada de demanda.
- Autenticación, permisos o auditoría avanzados.
- Notificaciones por correo, SMS o aplicaciones externas.
- Integración con un modelo generativo si compromete la estabilidad de la demo.
- Funcionalidades visuales que no sean necesarias para completar el flujo principal.

## 3. Experiencia mínima de la aplicación

Se construirá un dashboard de una sola pantalla con cuatro áreas:

- **Resumen:** total de productos, productos en riesgo y solicitudes pendientes.
- **Acción principal:** botón **Analizar inventario**, con estados normal, cargando y error.
- **Recomendaciones:** producto, stock, días restantes, nivel de riesgo, cantidad recomendada, proveedor, costo estimado y explicación.
- **Aprobación e historial:** acción **Aprobar reposición**, confirmación visible y lista de decisiones registradas.

No se abrirán nuevas pantallas salvo que la base existente lo requiera. La prioridad es que el recorrido sea corto, comprensible y resistente a errores durante la presentación.

## 4. Datos y contratos mínimos

### Inventario

Campos mínimos:

- `id`
- `producto`
- `categoria`
- `talla`
- `stock_actual`
- `consumo_diario_promedio`

### Proveedores

Campos mínimos:

- `id`
- `producto_id`
- `nombre`
- `costo_unitario`
- `plazo_entrega_dias`

### Solicitudes de reposición

Campos mínimos:

- `id`
- `producto_id`
- `proveedor_id`
- `cantidad`
- `costo_estimado`
- `estado`
- `fecha_creacion`

### Historial de decisiones

Campos mínimos:

- `id`
- `producto_id`
- `decision`
- `explicacion`
- `fecha`

### Resultado del análisis

La operación de análisis debe producir, para cada producto evaluado:

- Identificación y descripción del producto.
- Stock y consumo diario.
- Días restantes estimados.
- Nivel de riesgo.
- Cantidad recomendada.
- Proveedor recomendado.
- Costo estimado.
- Explicación legible de la decisión.

## 5. Reglas de recomendación

### Cálculos

```text
días_restantes = stock_actual / consumo_diario_promedio
cobertura_objetivo = plazo_entrega_dias + 7 días de operación + 3 días de seguridad
cantidad_recomendada = max(0, ceil(consumo_diario_promedio × cobertura_objetivo - stock_actual))
costo_estimado = cantidad_recomendada × costo_unitario
```

- Si el consumo diario es `0`, el producto no se marca como riesgo por consumo y los días restantes se muestran como no aplicables.
- Un producto está en riesgo cuando sus días restantes son menores o iguales al plazo de entrega del proveedor más 3 días de seguridad.
- Solo se mostrarán recomendaciones cuya cantidad calculada sea mayor que `0`.

### Selección del proveedor

1. Priorizar proveedores capaces de entregar antes del agotamiento estimado.
2. Entre los proveedores elegibles, seleccionar el de menor costo total estimado.
3. Resolver empates usando el menor plazo de entrega.
4. Si ninguno puede entregar a tiempo, usar el proveedor con menor plazo y mostrar una advertencia.

### Explicación

La explicación se generará con una plantilla basada en datos. Ejemplo:

> El producto dispone de 4 días de inventario y el proveedor entrega en 3 días. Se recomiendan 20 unidades para cubrir la entrega, 7 días de operación y 3 días de seguridad.

## 6. Distribución del equipo

### Frente A — Datos y Supabase

Responsabilidades:

- Crear las cuatro entidades mínimas o adaptar las existentes.
- Cargar un conjunto pequeño y estable de datos simulados.
- Garantizar al menos dos productos en riesgo, un producto saludable y dos alternativas de proveedor para un producto.
- Entregar consultas y operaciones de escritura listas para integrar.

### Frente B — Interfaz

Responsabilidades:

- Construir el dashboard de una sola pantalla.
- Implementar los estados de carga, error, resultados y confirmación.
- Mostrar recomendaciones de forma legible.
- Mantener un modo de datos simulados local como respaldo de la presentación.

### Frente C — Lógica, integración y demo

Responsabilidades:

- Implementar los cálculos y la selección de proveedor.
- Conectar análisis, aprobación, solicitud e historial.
- Preparar el guion de demostración y los datos esperados.
- Coordinar las integraciones de los minutos 45 y 80.

Una persona será responsable de integrar y congelar la rama o versión de la demo. Ningún frente debe cambiar contratos de datos después del minuto 45 sin aprobación de esa persona.

## 7. Cronograma de las 2 horas restantes

| Tiempo | Actividad | Criterio de salida |
|---|---|---|
| 0–10 min | Asignar responsables, congelar alcance y datos | Cada frente conoce su entregable; no quedan decisiones funcionales abiertas |
| 10–45 min | Trabajo paralelo de datos, interfaz y lógica | Supabase responde, la interfaz muestra datos y los cálculos funcionan de forma aislada |
| 45–60 min | Primera integración | **Analizar inventario** devuelve y muestra recomendaciones |
| 60–80 min | Aprobación e historial | Aprobar genera una solicitud `pendiente` y registra la decisión |
| 80–100 min | Prueba integral y corrección | El flujo principal funciona desde una recarga limpia |
| 100–115 min | Preparar y ensayar la presentación | Demo completa en menos de 3 minutos, con datos y mensajes conocidos |
| 115–120 min | Congelar la versión | No se agregan funciones; solo se conserva la versión estable |

## 8. Estrategia de recorte y contingencia

Orden de prioridad:

1. Análisis visible del inventario.
2. Recomendaciones coherentes.
3. Aprobación y confirmación.
4. Persistencia de solicitud e historial.
5. Pulido visual.

Si una tarea amenaza la ruta crítica:

- Sustituir la explicación generativa por una plantilla determinista.
- Usar el conjunto local de respaldo si Supabase falla durante la demo.
- Mostrar el historial actualizado en memoria si la escritura remota no puede estabilizarse antes del minuto 100.
- Eliminar animaciones, filtros y métricas secundarias.
- No reemplazar datos estables durante los últimos 20 minutos.

## 9. Pruebas obligatorias

- El análisis identifica al menos dos productos en riesgo y uno saludable.
- Los cálculos coinciden con los datos mostrados.
- Un consumo diario igual a cero no provoca una división por cero.
- La ausencia de un proveedor capaz de entregar a tiempo muestra una advertencia.
- Una aprobación genera una única solicitud, incluso ante doble clic.
- La solicitud se crea con estado `pendiente`.
- La decisión aparece en el historial.
- Los errores de consulta muestran un mensaje comprensible y permiten reintentar.
- La interfaz funciona con los datos de respaldo si Supabase no está disponible.
- La demo completa funciona después de recargar la aplicación.

## 10. Guion de demostración

1. Explicar brevemente el problema: la revisión manual provoca detección tardía y pérdida de ventas.
2. Mostrar el inventario y presionar **Analizar inventario**.
3. Destacar un producto con pocos días restantes.
4. Explicar por qué se eligieron la cantidad y el proveedor recomendados.
5. Aprobar la reposición.
6. Mostrar la solicitud `pendiente` y el registro en el historial.
7. Cerrar con el beneficio: menos revisión manual, decisiones más rápidas y control humano antes de comprar.

## 11. Definición de terminado

El MVP está listo cuando:

- El flujo principal se completa sin intervención técnica.
- Los datos y recomendaciones son coherentes y explicables.
- La aprobación siempre es explícita.
- La solicitud y el historial son visibles.
- Existe un respaldo local probado.
- El equipo ha realizado al menos dos ensayos completos.
- La versión estable queda congelada durante los últimos 5 minutos.

## 12. Supuestos

- El equipo dispone de tres o más personas durante las dos horas restantes.
- Actualmente solo existe la definición del proyecto.
- Supabase está disponible para almacenar datos simulados.
- La prioridad es una demostración estable, no una arquitectura de producción.
- Las reglas y constantes descritas son valores del MVP y deberán revisarse antes de un uso real.