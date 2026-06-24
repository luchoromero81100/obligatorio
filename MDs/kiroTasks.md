# INSTRUCCIONES PARA KIRO — Obligatorio Programación 1 (ORT)

> Este documento es tu brief de trabajo. Leelo entero antes de tocar una línea.
> Tu objetivo NO es reescribir el proyecto desde cero: es **analizar lo que ya existe, completar lo que falta y corregir lo que esté mal**, respetando estrictamente las restricciones de abajo.

---

## 0. TU PRIMERA TAREA (obligatoria, antes de programar)

Antes de escribir o modificar código, hacé esto y mostrámelo:

1. **Inventario del estado actual.** Recorré todos los archivos del proyecto y armá un resumen de qué clases, métodos y pantallas YA existen y cuáles faltan. Indicá también qué encontrás roto o fuera de las restricciones.
2. **Generá un archivo `TASKS.md`** con la lista de tareas pendientes para terminar el obligatorio, ordenadas por dependencia (qué necesita qué). Cada tarea debe tener: nombre, qué archivo toca, qué función/pantalla implica, y de qué depende. Usá checkboxes `- [ ]`.
3. **Esperá mi confirmación** del `TASKS.md` antes de empezar a implementar. No te mandes a programar todo de una.

A medida que completes tareas, andá marcando los checkboxes en `TASKS.md`.

---

## 1. QUÉ ES LA APP

Una **cartelera de postulaciones** (job board) en HTML + CSS + JavaScript vanilla, que corre 100% local abriendo `index.html` en Chrome. NO hay base de datos, NO hay backend, NO hay deploy, NO hay frameworks ni librerías. Todo el estado vive **en memoria**: al recargar la página, se vuelve a ejecutar la precarga y se reinicia todo. Eso es correcto y esperado.

Dos perfiles de usuario: **Postulante** (se registra, ve ofertas y se postula) y **Administrador** (precargado; gestiona ofertas, procesa postulaciones y ve estadísticas).

---

## 2. RESTRICCIONES TÉCNICAS DURAS (no negociables)

Esta app es para una materia inicial. Solo podés usar lo que se vio en el curso. Cualquier cosa fuera de esta lista está PROHIBIDA, aunque sea más eficiente.

### PERMITIDO (lo del curso)
- `let` / `const`, `if` / `else` / `switch`, operadores `==` `!=` `<` `>` `<=` `>=` `&&` `||` `!`
- Bucles `for`, `while`, `do...while`
- Funciones con parámetros y `return`
- Strings: `length`, `charAt`, `charCodeAt`, `includes`, `indexOf`, `slice`, `toUpperCase`, `toLowerCase`, `trim`, template strings con backticks
- Arrays indexados: `push`, `pop`, `shift`, `unshift`, `splice`, `indexOf`, `length`, acceso por índice `arr[i]`
- Objetos y `for...in`
- **Clases**: `constructor`, `this`, métodos, propiedades privadas con `#`, getters/setters
- `isNaN()`, `Number()` para convertir inputs
- DOM: `document.querySelector`, `querySelectorAll`, `innerHTML`, `addEventListener`, `.value`, `.checked`, `.hidden`

### PROHIBIDO (te baja la nota / complica la defensa)
- `map`, `filter`, `find`, `reduce`, `sort` con callback **"o similares"** (la letra lo prohíbe explícito)
- `forEach` → NO lo uses. Recorré SIEMPRE con `for` clásico (entra en "o similares")
- `localStorage` / `sessionStorage` → no se vio en el curso. El estado es en memoria
- `fetch`, `async` / `await`, Promesas
- `import` / `export`, módulos ES
- Arrow functions (`=>`) → usá `function() { }` tradicional para mantener el estilo del curso
- Librerías externas, frameworks, CDNs

### Si encontrás algo prohibido ya escrito en el código
Marcalo en el inventario y reescribilo con recursos del curso. Por ejemplo: si hay un `.filter(...)`, reemplazalo por un `for` que arma un array con `push`.

---

## 3. CONVENCIONES OBLIGATORIAS

- **Clases en PascalCase**: `Sistema`, `Postulante`, `Admin`, `OfertaLaboral`, `Postulacion`.
- **Funciones y variables en camelCase y en español, mnemotécnicas**: `registrarPostulante`, `buscarOfertaPorId`, `nivelExperiencia`.
- **Siempre `{ }`** en todo `if`, `for`, `while` (aunque sea una línea).
- **Sin código repetido**: si una validación o un recorrido se repite, sacalo a una función reutilizable.
- **Comentarios en español** explicando el porqué, pensados para alguien que recién aprende.
- **Sin `<form>` con `type="submit"`**: usá `<button>` normal + `addEventListener("click", ...)`. Un submit recarga la página y borra el estado en memoria.

### Formato de IDs (literal, lo pide la letra)
| Entidad | Formato | Ejemplo |
|---|---|---|
| Oferta | `JOB_OFFER_` + autoincremental | `JOB_OFFER_1` |
| Postulación | `JOB_` + autoincremental | `JOB_1` |
| Admin | número autoincremental | `1`, `2`, `3` |
| Postulante | sin id; el identificador único es el `usuario` | — |

---

## 4. ARQUITECTURA (respetala)

### Las 5 clases (cada una en su archivo)
- **Postulante**: `usuario`, `password`, `nombreCompleto`, `nivelExperiencia`, `areaInteres`.
- **Admin**: `id`, `nombre`, `usuario`, `password`. Precargados.
- **OfertaLaboral**: `id` (`JOB_OFFER_n`), `titulo`, `empresa`, `descripcion`, `nivelRequerido`, `area`, `limitePostulaciones`, `cantidadVacantes`, `destacada` (bool), `estado` (`"Activa"`/`"Inactiva"`/`"Cerrada"`, arranca Activa).
- **Postulacion**: `id` (`JOB_n`), referencia a la oferta y al postulante, `estado` (`"pendiente"`/`"aceptada"`/`"rechazada"`, arranca pendiente).
- **Sistema**: clase controladora. TODOS los arrays (`#postulantes`, `#admins`, `#ofertas`, `#postulaciones`) y los contadores autoincrementales viven acá como propiedades **privadas (`#`)**. Toda la lógica de negocio va en métodos de Sistema. La UI nunca toca los arrays directo.

> **Encapsulamiento:** los datos van con `#`. Los métodos que devuelven listas para mostrar deben devolver una **copia** (`return [...this.#ofertas]`), nunca el array privado original.

### `limitePostulaciones` vs `cantidadVacantes`
No son lo mismo: `limitePostulaciones` = cuántos pueden **anotarse** (tope de entrada); `cantidadVacantes` = cuántos se **contratan** = aceptadas (tope de salida). Debe cumplirse `limitePostulaciones >= cantidadVacantes`. Cada uno inactiva la oferta por su lado (ver Fase 8).

### La UI es una SPA (una sola página)
Un solo `index.html` con varias "pantallas" (divs) que se muestran/ocultan con el atributo `hidden`. Para contenido dinámico (listas, tablas) se rellena un div interno con `innerHTML` + `for`. Hay dos headers (admin y postulante). No usar varios `.html` (se perdería el estado en memoria).

### Orden de carga de scripts en `index.html` (crítico)
Las clases primero, luego la precarga, luego la UI:
```
Admin.js, Postulante.js, OfertaLaboral.js, Postulacion.js  (las clases base)
Sistema.js                                                  (usa las de arriba)
datosPrecargados.js                                         (crea la instancia y la llena)
pantallas.js / app.js                                       (la UI)
```

---

## 5. FUNCIONALIDADES COMPLETAS (qué tiene que hacer la app)

Esto es el "done" del proyecto. Cada punto es una funcionalidad a tener implementada.

### 5.1 Postulante

**Registro** (método `registrarPostulante`):
- Validar: usuario único (case insensitive, "a" y "A" son el mismo) y mínimo 5 caracteres; password mínimo 5 con al menos 1 mayúscula, 1 minúscula y 1 número; todos los campos obligatorios.
- Nivel ∈ {Junior, Semi-Senior, Senior}. Área ∈ {Tecnología, Diseño, Marketing, Administración, Otros}.
- Devolver mensaje claro (éxito o el error puntual).

**Login / logout**: usuario + password, con mensajes de error. Poder cerrar sesión y volver a entrar.

**Ver ofertas a las que se puede postular** (`obtenerOfertasParaPostulante`): mostrar SOLO ofertas que cumplan TODAS:
1. Estado `"Activa"`.
2. Compatibles con el nivel del postulante (ver regla abajo).
3. El postulante NO se postuló antes a esa oferta.
Por defecto mostrar solo su **área de interés**, con opción de "ver todas". Cada oferta con botón "Postularme".

**Regla de compatibilidad de nivel** (`esCompatibleNivel`, aislada en un solo método):
> SUPUESTO A CONFIRMAR CON EL DOCENTE: un postulante solo puede postularse a ofertas de su MISMO nivel, EXCEPTO los Senior, que pueden a cualquier nivel. Dejá esta regla en un único método fácil de cambiar.

**Postularse** (`crearPostulacion`): crear `Postulacion` con id `JOB_n`, estado `"pendiente"`, guardarla en el array. Validar que no se haya postulado ya.

**Mis postulaciones** (`obtenerPostulacionesDePostulante`): listar todas las suyas (pendientes, aceptadas, rechazadas) con nombre de la oferta y estado.

**Catálogo de destacadas** (`obtenerOfertasDestacadas`): solo las marcadas `destacada == true`, mostrando título, empresa, nivel requerido y descripción breve. Poder postularse desde ahí.

### 5.2 Admin (precargado, login/logout igual)

**Crear oferta** (`agregarOferta`): validar campos no vacíos y `limitePostulaciones >= cantidadVacantes`. id `JOB_OFFER_n`, estado Activa por defecto.

**Listado completo de ofertas**: todas (Activas/Inactivas/Cerradas) con su info, botones **Editar** y **Cerrar**.
- `editarOferta`: actualizar propiedades (revalidando).
- `cerrarOferta`: eliminación **LÓGICA** (estado a `"Cerrada"`, NUNCA borrar del array).

**Inactivación automática de ofertas**: una oferta pasa a `"Inactiva"` cuando se alcanza el límite de postulaciones O cuando se cubren todas las vacantes (todas aceptadas).

**Procesar postulaciones** (`aceptarPostulacion`): listado de pendientes, cada una con botón para procesarla. Al ACEPTAR una:
- Si con esa aceptación se cubren todas las vacantes → rechazar automáticamente las demás pendientes de esa oferta y pasar la oferta a Inactiva (motivo: vacantes cubiertas).
- Si con esa aceptación se alcanza el límite de postulaciones → oferta a Inactiva (motivo: límite alcanzado).
- Informar SIEMPRE al admin: si fue aprobada/rechazada, si la oferta cambió de estado y el motivo, y cuántas pendientes se rechazaron automáticamente.
> La letra dice "procesar". Asumí procesar = aceptar (con cascada). Un botón "Rechazar" manual es opcional; confirmá con el docente.

**Estadísticas** (vista aparte):
- Tabla de postulaciones por oferta: Título, # pendientes, # aceptadas, # rechazadas, total. Con buscador por título.
- Total de ofertas por estado (Activas/Inactivas/Cerradas).
- Porcentaje de vacantes cubiertas sobre el total de vacantes ofrecidas (cuidar división por cero).
- Postulante con más postulaciones activas.
> SUPUESTO A CONFIRMAR: "activas" = pendientes + aceptadas (no rechazadas).

### 5.3 Precarga (consistente)
- 3 admins.
- 15 postulantes en distintos niveles.
- 10 ofertas (al menos 2 destacadas, con distintos niveles y estados).
- 20 postulaciones en distintos estados, con datos coherentes (niveles compatibles, aceptadas que no superen vacantes, ofertas en los 3 estados) para poder probar el procesamiento.

---

## 6. CÓMO IMPLEMENTAR (patrones del curso)

Usá estos patrones, que son los que se enseñaron. No uses atajos fuera del curso.

**Buscar en un array** (sin `find`): `for` que compara y hace `return` al encontrar; `return null` al final si no encontró.

**Filtrar** (sin `filter`): `for` con un `if`; los que cumplen se meten en un array nuevo con `push`; al final `return` de ese array.

**Contar** (sin `reduce`): `for` con una variable contadora que suma cuando se cumple la condición.

**Máximo / "el que más tiene"** (sin `sort`): patrón de variable acumuladora — recorrer guardando el mayor visto hasta el momento.

**Validar password**: `for` sobre el string con `charAt(i)` o `charCodeAt(i)`, llevando flags `tieneMayus`/`tieneMinus`/`tieneNumero`.

**Case insensitive**: comparar con `.toLowerCase()` de ambos lados.

**Devolver datos para mostrar**: copia con `[...this.#array]`, no el original.

**Validaciones**: van DENTRO del método del Sistema (no en la UI). El método valida primero, corta con `return mensaje` si algo falla, y solo crea/modifica si pasó todo. La UI solo recolecta inputs, llama al método y muestra el mensaje devuelto.

**UI dinámica**: armar el HTML de listas/tablas con un `for` que concatena strings, e inyectar con `innerHTML`. Reenganchar los `addEventListener` de los botones generados después de cada `innerHTML`.

---

## 7. QUÉ VERIFICAR DEL CÓDIGO EXISTENTE

Durante el inventario, prestá atención a:
- Que las 5 clases existan y que los arrays estén SOLO dentro de `Sistema` (con `#`).
- Que NO haya doble sistema de contadores (ej: `#contadorOferta` y un `this.nextId` haciendo lo mismo). Debe haber un solo juego.
- Que los métodos que devuelven listas devuelvan copia (`[...]`).
- Que el orden de parámetros al hacer `new OfertaLaboral(...)` / `new Postulante(...)` coincida con el orden del constructor de cada clase.
- Anidación correcta del HTML (divs y `</form>` bien cerrados).
- Que cada pantalla (div) tenga una clase común (ej. `class="pantalla"`) para poder mostrarlas/ocultarlas en bloque con un `for`.
- Que no haya recursos prohibidos (map/filter/forEach/localStorage/fetch/arrow functions).

---

## 8. ENTREGABLES Y CIERRE (de la letra)

- Carpeta `obligatorio/` que corre desde `index.html`.
- Las 5 clases, con todos los arrays gestionados en `Sistema`.
- Precarga mínima cumplida.
- Código comentado.
- Marcá en el código (con comentarios `// TODO confirmar con docente`) los dos supuestos: compatibilidad de niveles y definición de "postulaciones activas".
- **Documentá tu propio uso** en una sección al final de `TASKS.md`: qué archivos creaste/modificaste y por qué (esto le sirve al alumno para la defensa y para documentar el uso de IA que exige la letra).

---

## 9. CÓMO QUERÉS QUE TRABAJES (resumen)

1. Inventario + `TASKS.md` + esperar confirmación.
2. Implementar por dependencia, dejando el código funcionando en cada etapa.
3. Solo recursos del curso. Ante la duda entre dos formas, elegí la más simple y a nivel principiante.
4. Comentarios en español explicando el porqué.
5. No agregar funcionalidades que la letra no pide.
6. No reescribir lo que ya funciona bien: completá y corregí.