Contexto del Proyecto
Nombre del proyecto

StockFlow AI

Slogan:
"El agente inteligente que optimiza la reposición de inventario en tiendas de ropa."

¿Qué? (What)

StockFlow AI es un agente inteligente diseñado para optimizar el flujo de trabajo de gestión de inventario en tiendas de ropa.

El agente analiza el inventario almacenado en Supabase para identificar prendas con riesgo de desabastecimiento, calcular la cantidad óptima de reposición, seleccionar el proveedor más conveniente y generar automáticamente una solicitud de compra para aprobación del responsable.

Su objetivo no es solo detectar problemas, sino acompañar al usuario durante todo el proceso de toma de decisiones.

¿Quién? (Who)
Usuario principal

Encargado de Inventario

Es la persona responsable de supervisar el stock disponible y garantizar que la tienda mantenga suficiente inventario para satisfacer la demanda.

Usuario secundario

Responsable de Compras

Recibe la recomendación generada por el agente, revisa la información y aprueba la solicitud de compra antes de realizar el pedido al proveedor.

¿Para qué? (Purpose)

Optimizar el flujo de trabajo relacionado con la reposición de inventario, reduciendo el tiempo invertido en revisar manualmente existencias y facilitando la toma de decisiones mediante recomendaciones inteligentes.

El agente permite que el personal dedique menos tiempo al análisis operativo y más tiempo a actividades estratégicas del negocio.

¿Por qué? (Problem)

En muchas tiendas de ropa, el control del inventario se realiza de forma manual o mediante consultas periódicas al sistema.

Esto provoca problemas como:

Revisar cientos de productos uno por uno.
Detectar tarde la falta de tallas o prendas.
Comprar cuando el inventario ya es insuficiente.
Perder ventas por no disponer del producto solicitado.
Invertir demasiado tiempo analizando información antes de decidir qué comprar.

El agente automatiza este proceso para detectar riesgos oportunamente y acelerar la toma de decisiones.

¿Cómo? (How)

El agente ejecuta el siguiente flujo de trabajo:

El usuario solicita un análisis
            │
            ▼
Consulta el inventario en Supabase
            │
            ▼
Analiza el stock disponible
            │
            ▼
Calcula días restantes según el consumo
            │
            ▼
Identifica prendas con riesgo de agotarse
            │
            ▼
Selecciona el proveedor más conveniente
            │
            ▼
Calcula la cantidad recomendada
            │
            ▼
Genera una explicación de la decisión
            │
            ▼
Solicita aprobación del responsable
            │
            ▼
Genera la solicitud de reposición
            │
            ▼
Registra la decisión en el historial
¿Cuándo? (When)

El agente se ejecuta cuando el usuario solicita un análisis del inventario.

Durante la demostración, el encargado de inventario presionará el botón "Analizar Inventario", iniciando automáticamente todo el proceso de evaluación y generación de recomendaciones.

¿Dónde? (Where)

La solución está diseñada para tiendas de ropa que necesitan mantener un control constante sobre sus prendas y tallas disponibles.

La demostración utilizará un inventario con productos como:

Camisetas
Jeans
Chaquetas
Vestidos
Zapatos
Gorras

El agente analizará el inventario completo para identificar las prendas que requieren reposición antes de que se agoten.

Limitaciones

Para mantener un alcance adecuado durante el hackathon, la primera versión tendrá las siguientes limitaciones:

El inventario estará almacenado en Supabase con datos simulados.
Se administrará una única sucursal o bodega.
Los proveedores estarán previamente registrados en la base de datos.
El consumo de productos se calculará mediante un promedio simple.
La reposición siempre requerirá aprobación humana antes de generar la solicitud de compra.
No existirá integración con sistemas ERP o plataformas de proveedores externos.
Las notificaciones se visualizarán únicamente dentro de la aplicación.
Caso de uso de la demo

Escenario:

Una tienda de ropa desea revisar el estado actual de su inventario antes de realizar un nuevo pedido.

El encargado de inventario abre la aplicación y selecciona la opción "Analizar Inventario".

El agente consulta la información almacenada en Supabase y detecta que la Chaqueta Denim talla L tiene únicamente 5 unidades disponibles, con un consumo promedio de 3 unidades por día.

Después de analizar el tiempo de entrega de los proveedores, el agente concluye que existe un alto riesgo de desabastecimiento y recomienda comprar 30 unidades al proveedor con mejor tiempo de entrega y costo.

Finalmente, presenta una explicación de su decisión y genera una solicitud de reposición lista para que el responsable de compras la apruebe.

¿Por qué este proyecto es un agente y no un algoritmo?

Esta es una pregunta que probablemente les haga el jurado, y es importante tener una respuesta sólida.

Un algoritmo simplemente aplicaría una regla como:

"Si el stock es menor que el mínimo, mostrar una alerta."

En cambio, StockFlow AI actúa como un agente porque:

Percibe el estado actual del inventario consultando Supabase.
Analiza múltiples variables (stock, consumo, tiempo de entrega y proveedores).
Razona sobre el riesgo de desabastecimiento y evalúa alternativas.
Decide cuál es la mejor acción y el proveedor más conveniente.
Explica el motivo de su recomendación en lenguaje natural.
Interactúa con el usuario solicitando aprobación antes de continuar.
Actúa generando automáticamente una solicitud de reposición.
Aprende del flujo mediante el registro de decisiones para mantener trazabilidad.

Esta secuencia de percibir → analizar → decidir → explicar → actuar es la que convierte la solución en un agente inteligente, alineado con el reto de Agentes y Automatización del Buildathon.