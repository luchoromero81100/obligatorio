# TASKS.md — Plan para terminar el Obligatorio

> Generado por Kiro tras el inventario del código existente.
> Decisiones confirmadas por el usuario:
> 1. Las pantallas nuevas se hacen en **HTML básico**, sin CSS pulido.
> 2. Los estados de postulación quedan como están (mayúscula inicial: "Pendiente"/"Aceptada"/"Rechazada").

---

## A. CORRECCIONES DE RESTRICCIONES (prohibido lo de fuera del curso)

- [x] **A1. Reescribir `aceptarPostulacion` sin `find` ni arrow function.** (`js/sistema.js`)
- [x] **A2. Reescribir el `for...of` de `aceptarPostulacion` con `for` clásico.** (`js/sistema.js`)
- [x] **A3. Eliminar arrow functions en `pantallas.js`** (listeners, `setTimeout`, `load`).
- [x] **A4. (extra) Convertir `===`/`!==` → `==`/`!=`, `parseInt` → `Number`, `getElementById` → `querySelector`** en `pantallas.js` (la lista permitida del curso es estricta).

---

## B. LIMPIEZA Y UBICACIÓN DE CÓDIGO

- [x] **B1. Quitar la `mostrarMisPostulaciones()` duplicada de `sistema.js`** (era UI dentro del cerebro; queda solo en `pantallas.js`).
- [x] **B2. Eliminar `js/usuarios.js`** (array muerto) y su `<script>` en `index.html`.
- [x] **B3. Centralizar la lógica de inactivación en `Sistema`.** `OfertaLaboral` quedó como molde simple; el cambio de estado (límite alcanzado / vacantes cubiertas) se calcula en `crearPostulacion` y `aceptarPostulacion` con `contarPostulacionesDeOferta` / `contarTotalPostulacionesDeOferta`.
- [x] **B4. Quitar `this.postulaciones = []` no usado de `Postulante`.**
- [x] **B5. Sacar el argumento extra `"Activa"` del `new OfertaLaboral(...)`** en `agregarOferta`.

---

## C. CONSISTENCIA DE DATOS

- [x] **C1. Unificar Áreas** al conjunto del registro {Tecnología, Diseño, Marketing, Administración, Otros} en `datosPrecargados.js`.
- [x] **C2. Completar la precarga**: 3 admins, 15 postulantes, 10 ofertas (3 destacadas, estados variados), 20 postulaciones con datos coherentes.
- [x] **C3. Estados de postulación**: se dejan con mayúscula inicial (decisión del usuario).

---

## D. SUPUESTOS A MARCAR

- [x] **D1. `// TODO confirmar con docente` en `esCompatibleNivel`** (regla de niveles).
- [x] **D2. `// TODO confirmar con docente` en `postulanteConMasPostulacionesActivas`** (definición de "activas").

---

## E. FUNCIONALIDADES FALTANTES (UI nueva, HTML básico)

- [x] **E1. Pantalla de listado completo de ofertas del Admin (Editar / Cerrar).** Nueva sección `seccion-admin-ofertas` + `mostrarListadoOfertasAdmin`, `mostrarFormularioEditar`, `guardarEdicionOferta`, `procesarCerrarOferta`.
- [x] **E2. Pantalla de Estadísticas del Admin (con buscador por título).** Nueva sección `seccion-admin-estadisticas` + `mostrarEstadisticas`.

---

## Verificación realizada
- `node --check` sobre las 6 clases/archivos JS → sin errores de sintaxis.
- Smoke test de la precarga (temporal, ya eliminado): 10 ofertas, 20 postulaciones (12 pendientes / 5 aceptadas / 3 rechazadas), ofertas por estado {activas:6, inactivas:3, cerradas:1}, login admin y postulante OK.

---

## Registro de uso de IA (Kiro)

Archivos creados / modificados y por qué:

- **`js/postulante.js`** — modificado: se quitó `this.postulaciones = []` (no se usaba; las postulaciones viven en `Sistema`).
- **`js/ofertaLaboral.js`** — modificado: se convirtió en molde simple. Se eliminaron los contadores propios (`postulacionesRecibidas`, `postulantesAceptados`) y los métodos `verificarEstado`/`registrarPostulacion`/`registrarAceptado`/`cerrarOferta`. La lógica de estado ahora vive en `Sistema` (lo exige la letra).
- **`js/usuarios.js`** — eliminado: era un array de usuarios sin uso (los datos reales están en `datosPrecargados.js`).
- **`js/sistema.js`** — modificado:
  - `aceptarPostulacion`: reescrito sin `find` ni arrow ni `for...of`; ahora informa motivo del cambio de estado y cuántas pendientes se rechazaron.
  - `crearPostulacion`: ya no llama a la oferta; la inactivación por límite se calcula en el Sistema.
  - se agregó `contarTotalPostulacionesDeOferta`.
  - comentarios `// TODO confirmar con docente` en `esCompatibleNivel` y `postulanteConMasPostulacionesActivas`.
  - se quitó la función UI duplicada `mostrarMisPostulaciones` que estaba al final.
  - se sacó el argumento extra `"Activa"` del `new OfertaLaboral(...)`.
- **`js/datosPrecargados.js`** — reescrito: áreas unificadas, 15 postulantes, 10 ofertas (3 destacadas), 20 postulaciones coherentes y procesamiento de algunas para tener estados variados (incluye una oferta cerrada).
- **`js/pantallas.js`** — reescrito: sin arrow functions, `==`/`!=`, `querySelector`, `Number()`. Se agregaron `mostrarListadoOfertasAdmin`, `mostrarFormularioEditar`, `guardarEdicionOferta`, `procesarCerrarOferta` y `mostrarEstadisticas`.
- **`interfaz/index.html`** — modificado: se quitó el `<script>` de `usuarios.js`, se agregaron dos botones en el header del admin y dos secciones nuevas en HTML básico (`seccion-admin-ofertas`, `seccion-admin-estadisticas`). No se tocó el estilo visual existente.
