# AUDITORÍA DE COHERENCIA — Kiro

> Tu tarea es **auditar**, NO programar todavía. Compará el proyecto actual (código) contra el **Documento de Análisis** (la fuente de verdad de lo que prometimos construir) y detectá toda discrepancia: cosas que no están donde deberían, que no hacen lo que deberían, o que no muestran lo que deberían.

---

## REGLAS DE LA AUDITORÍA (leelas antes de empezar)

1. **NO modifiques código todavía.** Esta es una fase de revisión.
2. Todo lo que encuentres lo anotás en un archivo nuevo llamado **`CosasAArreglar.md`** (lo creás vos).
3. Si algo te genera duda o hay más de una forma de resolverlo, **NO decidas solo**: anotalo como pregunta y consultámelo.
4. **Esperá mi confirmación.** Recién cuando yo te diga "ejecutá los cambios", aplicás las correcciones. Ni antes.
5. La **fuente de verdad** es el Documento de Análisis (las 14 funcionalidades F01–F14, sus campos, validaciones y mensajes exactos). Si el código dice una cosa y el documento otra, es una discrepancia que hay que anotar — sin asumir cuál tiene razón; me preguntás.
6. **EXCEPCIÓN — Arquitectura SPA (ya decidida):** el proyecto se mantiene como una sola página (`index.html`) con pantallas que se muestran/ocultan por JS. Donde el documento mencione `registro.html` u otras páginas separadas, la discrepancia se resuelve corrigiendo el TEXTO DEL DOCUMENTO, nunca partiendo el código en varios HTML. Esto NO es una duda: es una instrucción firme (ver detalle en "Discrepancias de arquitectura", punto 1).

---

## FORMATO DE `CosasAArreglar.md`

Organizá el archivo por funcionalidad (F01 a F14) y al final una sección de "Generales". Para cada hallazgo usá este formato:

```
### F0X – <nombre de la funcionalidad>

- [ ] **[DISCREPANCIA]** <qué dice el documento> vs <qué hace/muestra el código>.
      Archivo/línea: <dónde está>.
      Propuesta: <cómo se arreglaría>.

- [ ] **[FALTA]** <qué pide el documento que no existe en el código>.

- [ ] **[DUDA]** <pregunta concreta para Lucho antes de tocar nada>.
```

Usá las etiquetas `[DISCREPANCIA]`, `[FALTA]`, `[DUDA]`, `[OK]` (si querés dejar constancia de lo que sí coincide). Las dudas van también resumidas en una sección **"PREGUNTAS PARA LUCHO"** al inicio del archivo, para que las vea de una.

---

## QUÉ VERIFICAR EN CADA FUNCIONALIDAD

Para cada una de las F01–F14, chequeá estas tres dimensiones:

1. **Existe y está donde debería** (la pantalla/acción existe y se accede desde donde el documento dice).
2. **Hace lo que debería** (la lógica cumple la descripción y TODAS las validaciones listadas, con los mensajes EXACTOS).
3. **Muestra lo que debería** (los campos/columnas que el documento enumera están todos, ni de más ni de menos).

A continuación, el detalle de qué buscar en cada una.

### F01 – Registro (Postulante)
- Campos exactos: Nombre completo, Nombre de usuario, Contraseña, Nivel de experiencia, Área de interés.
- Nivel y Área deben ser **selección** (dropdown), no texto libre. Nivel ∈ {Junior, Semi-Senior, Senior}. Área ∈ {Tecnología, Diseño, Marketing, Administración, Otros}.
- Validaciones con mensajes EXACTOS:
  - vacíos → "Debe completar todos los campos"
  - usuario < 5 → "El nombre de usuario debe tener al menos 5 caracteres"
  - usuario duplicado (case insensitive) → "El nombre de usuario ya existe"
  - pass < 5 → "La contraseña debe tener al menos 5 caracteres"
  - pass sin mayús/minús/número → "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
- Verificá que los mensajes en el código sean **textualmente** estos. Si difieren (aunque sea una palabra), es discrepancia.

### F02 – Ingresar (ambos)
- Un solo formulario (usuario + contraseña) para postulante Y admin.
- Login correcto redirige según perfil: postulante → ofertas disponibles; admin → postulaciones pendientes o panel admin.
- Validaciones/mensajes exactos: vacíos → "Debe completar todos los campos"; usuario inexistente → "Nombre de usuario incorrecto"; pass incorrecta → "Contraseña incorrecta".
- La contraseña respeta mayúsculas/minúsculas (NO case insensitive). El **usuario** sí es case insensitive.
- Admins NO pueden registrarse desde la app.

### F03 – Cerrar sesión (ambos)
- Botón "Cerrar sesión" visible SOLO con sesión iniciada.
- Limpia el usuario activo y vuelve al login.
- Tras cerrar sesión, no deben verse pantallas privadas (ni de postulante ni de admin).

### F04 – Ofertas disponibles (Postulante)
- Tabla con columnas exactas: ID, Título, Empresa, Descripción, Nivel, Área, Vacantes, Límite postulaciones, Destacada (sí/no), Acción.
- Buscador por puesto o empresa arriba de la tabla.
- Filtros lógicos (TODOS): solo estado "Activa"; NO cerradas; NO inactivas; NO las que alcanzaron el límite; NO ofertas a las que ya se postuló.
- Por defecto solo su área de interés, con opción "ver todas".
- Compatibilidad de nivel: solo su mismo nivel, EXCEPTO Senior que ve todos.
- Si no hay ofertas → mensaje "No hay ofertas laborales disponibles".
- Botón "Postularme" solo si la oferta acepta nuevas postulaciones.

### F05 – Postularse (Postulante)
- Crea Postulacion estado "Pendiente", id formato `JOB_n`.
- Validaciones: la oferta existe, está Activa, no cerrada, no inactiva, no superó el límite; compatible con su nivel; no postulado antes.
- Mensajes exactos: éxito → "Postulación realizada correctamente"; ya postulado → "Ya te postulaste a esta oferta".

### F06 – Mis postulaciones (Postulante)
- Tabla con columnas exactas: ID Postulación, Título oferta, Empresa, Nivel requerido, Área, Estado.
- Solo las del usuario logueado (NO de otros).
- Sin postulaciones → "No tenés postulaciones realizadas".
- El postulante NO puede modificar estados.

### F07 – Ofertas destacadas (Postulante)
- Solo ofertas con `destacada == true` Y activas Y que aceptan postulaciones.
- Muestra: ID, Título, Empresa, Descripción, Nivel, Área, Vacantes, Límite, indicador destacada, botón Postularme.
- Sin destacadas → "No hay ofertas destacadas disponibles".

### F08 – Crear oferta (Admin)
- Formulario con campos exactos: Título, Empresa, Descripción, Nivel (dropdown), Área (dropdown), Límite de postulaciones, Cantidad de vacantes, checkbox destacada.
- id `JOB_OFFER_n`, estado "Activa" por defecto.
- Validaciones/mensajes exactos: vacíos → "Debe completar todos los campos"; límite < vacantes → "El límite de postulaciones debe ser mayor o igual a la cantidad de vacantes"; vacantes ≤ 0 → "La cantidad de vacantes debe ser mayor a 0"; límite ≤ 0 → "El límite de postulaciones debe ser mayor a 0".

### F09 – Gestionar ofertas (Admin)
- Tabla con TODAS las ofertas (Activas, Inactivas, Cerradas).
- Columnas exactas: ID, Título, Empresa, Nivel, Área, Límite, Vacantes, Destacada, Estado, Acciones.
- Acciones: Editar y Cerrar oferta. Botón "+ Crear nueva oferta" lleva a F08.
- Sin eliminación física.

### F10 – Editar oferta (Admin)
- Formulario igual al de crear pero con datos precargados.
- El ID se muestra pero NO es editable.
- Mismas validaciones que F08 (mismos mensajes).

### F11 – Cerrar oferta (Admin)
- Eliminación LÓGICA: estado pasa a "Cerrada", NO se borra del array.
- Solo se cierran ofertas no cerradas previamente.
- Informa "oferta cerrada correctamente".

### F12 – Postulaciones pendientes (Admin)
- Tabla SOLO con postulaciones "Pendiente".
- Columnas exactas: ID Postulación, Nombre del postulante, Oferta, Empresa, Estado, Acción.
- Botón "Procesar" por fila.
- NO mostrar aceptadas ni rechazadas.

### F13 – Procesar postulación (Admin)
- **OJO – posible discrepancia clave:** el documento dice que se puede **Aprobar Y Rechazar** manualmente (dos botones). Verificá que el código tenga AMBAS acciones, no solo aceptar. Si solo está aceptar, es una FALTA.
- Al aprobar: estado "Aceptada"; si se cubren vacantes → oferta "Inactiva" + rechazo automático de las demás pendientes de esa oferta; si se alcanza el límite → oferta "Inactiva".
- Al rechazar: estado "Rechazada".
- Solo se procesan las "Pendiente".
- Debe INFORMAR: si fue aprobada/rechazada, si la oferta cambió de estado y el motivo, y cuántas se rechazaron automáticamente.

### F14 – Estadísticas (Admin)
- Tabla postulaciones por oferta, columnas exactas: Título, Pendientes, Aceptadas, Rechazadas, Total postulaciones. Con TODAS las ofertas (cualquier estado).
- Buscador por título de oferta.
- Total de ofertas por estado (Activas / Inactivas / Cerradas).
- Porcentaje de vacantes cubiertas sobre total de vacantes ofrecidas (cuidar división por cero).
- Postulante con más postulaciones activas.
- Sin datos suficientes → mensaje informativo.

---

## DISCREPANCIAS DE ARQUITECTURA A REVISAR ESPECIALMENTE

Estas son las que más probablemente aparezcan. Revisalas con atención:

1. **SPA — DECISIÓN YA TOMADA (no es duda).** El proyecto es y se mantiene una **SPA de un único `index.html`** con pantallas que se muestran/ocultan vía JS (atributo `hidden`). NO queremos varios archivos `.html`. El motivo es técnico: con varios HTML se perdería el estado en memoria al navegar (no usamos `localStorage`), y eso rompería toda la app. Por lo tanto:
   - Donde el Documento de Análisis menciona páginas separadas o redirecciones a otros archivos (ej. F01 dice "redireccionan a la página de registro (registro.html)"), eso es una **redacción a corregir EN EL DOCUMENTO**, no en el código. Anotalo como `[DISCREPANCIA]` con la propuesta de reescribir el texto del documento para que diga "muestra la pantalla de registro" en vez de "redirecciona a registro.html".
   - NO conviertas el código a múltiples HTML bajo ninguna circunstancia.
   - Si encontrás que el código YA usa varios `.html` separados, eso SÍ es un problema a anotar: hay que unificarlo en la SPA. Marcalo como `[DISCREPANCIA]` prioritaria.

2. **Navegación por header.** El documento muestra un header con: "Postulaciones Pendientes · Gestionar Ofertas · Crear Oferta · Estadísticas · Cerrar Sesión" (admin) y "Ofertas disponibles · Ofertas Destacadas · Mis Postulaciones · Cerrar Sesión" (postulante). Verificá que esos enlaces existan, lleven a donde dicen, y que cada rol vea SOLO su header.

3. **Pantallas que existen en el HTML pero pueden estar vacías o a medias.** Recorré los divs/pantallas del `index.html` y confirmá que cada uno tenga su contenido real y su lógica conectada, no que esté declarado pero vacío.

4. **Columnas/campos exactos.** El documento es muy específico sobre qué columnas tiene cada tabla. Compará columna por columna. Si una tabla del código tiene una columna de más, de menos, o en otro orden, anotalo.

5. **Mensajes textuales.** Compará cada mensaje de validación del código contra el texto EXACTO del documento. Diferencias de redacción cuentan como discrepancia (en la defensa los comparan).

6. **Estado "Inactiva" vs filtros del postulante.** Verificá que las ofertas Inactivas y Cerradas efectivamente NO aparezcan en F04 ni F07, y que las que llegaron al límite tampoco.

---

## RESTRICCIONES TÉCNICAS (verificá que se respeten)

Mientras audita, anotá también si encontrás recursos prohibidos por el curso:
- `map`, `filter`, `find`, `reduce`, `sort` con callback, `forEach` → deben ser `for` clásico.
- `localStorage` / `sessionStorage`, `fetch`, `async/await`, `import/export`, arrow functions, librerías externas.
- Que todos los arrays estén SOLO dentro de la clase `Sistema` (privados con `#`).
- Que los métodos que devuelven listas devuelvan copia (`[...]`), no el array original.
- IDs con formato correcto: `JOB_OFFER_n` (ofertas), `JOB_n` (postulaciones).

---

## ENTREGABLE DE ESTA FASE

1. El archivo **`CosasAArreglar.md`** completo, con:
   - Sección "PREGUNTAS PARA LUCHO" al inicio (todas las `[DUDA]` juntas).
   - Un bloque por funcionalidad F01–F14 con sus hallazgos.
   - Una sección "Generales / Arquitectura" con los puntos de arriba.
   - Una sección "Restricciones técnicas" con lo prohibido que hayas encontrado.
2. Un resumen corto al final: cuántas discrepancias, cuántas faltas, cuántas dudas.
3. **NO toques el código.** Esperá a que Lucho revise `CosasAArreglar.md`, responda las dudas y te dé la orden de ejecutar.