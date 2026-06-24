# OBLIGATORIO — Cartelera de Postulaciones

> Plan-guía para construir el proyecto de cero, paso a paso, con HTML + CSS + JS vanilla.
> Esto NO es el código resuelto: son las instrucciones, el orden y el "cómo" de cada función.
> La idea es que vos lo programes siguiendo este mapa.

---

## 1. OBJETIVO

Hacer una app web local (se abre con `index.html` en Chrome) que funcione como una **cartelera de ofertas laborales**, con dos tipos de usuario:

- **Postulante**: se registra, inicia sesión, ve ofertas a las que puede postularse y se postula.
- **Administrador** (precargado): crea/edita/cierra ofertas, procesa postulaciones y ve estadísticas.

Todo el estado vive **en memoria**. No hay base de datos, no hay backend, no hay `localStorage`. Al recargar la página, se vuelve a ejecutar la precarga y se reinicia todo. Eso está bien y es lo esperado.

---

## 2. REGLAS DEL JUEGO (leé esto antes de escribir una línea)

### SÍ se puede usar (lo del curso)
- `let` / `const`, `if` / `else` / `switch`, operadores `==` `!=` `<` `>` `<=` `>=` `&&` `||` `!`
- Bucles `for` y `while`
- Funciones con parámetros y `return`
- Strings: `length`, `charAt`, `includes`, `indexOf`, `slice`, `toUpperCase`, `toLowerCase`, `trim`
- Arrays indexados: `push`, `pop`, `indexOf`, `length`, acceso por índice `arr[i]`
- Objetos y `for...in`
- **Clases**: `constructor`, `this`, métodos, propiedades privadas con `#`, getters/setters
- DOM: `document.querySelector`, `innerHTML`, `createElement`, `addEventListener`

### NO se puede usar (te baja la nota o te complica la defensa)
- `map`, `filter`, `find`, `reduce`, `sort` con callback **"o similares"** → la letra lo prohíbe explícito
- `forEach` → evitalo también (entra en "o similares", no lo discutas en la defensa)
- `localStorage` / `sessionStorage` → no se vio en el curso
- `fetch`, `async` / `await`, `import` / `export`, librerías externas, frameworks
- Deploy, servidores, nada raro

### Convenciones obligatorias
- **Clases en PascalCase**: `Sistema`, `Postulante`, `Admin`, `OfertaLaboral`, `Postulacion`
- **Funciones y variables en camelCase y mnemotécnicas** (en español): `registrarPostulante`, `buscarOfertaPorId`, `nivelExperiencia`
- **Siempre `{ }`** en todos los `if`, `for`, etc. (aunque sea una línea)
- **Sin código repetido**: si copiás y pegás dos veces, hacé una función
- **Toda la lógica de datos vive en la clase `Sistema`** — la UI nunca toca los arrays directo

### Formato de IDs (¡ojo con esto, lo piden literal!)
| Entidad | Formato del id | Ejemplo |
|---|---|---|
| Oferta laboral | `JOB_OFFER_` + número autoincremental | `JOB_OFFER_1` |
| Postulación | `JOB_` + número autoincremental | `JOB_1` |
| Admin | número autoincremental (solo el número) | `1`, `2`, `3` |
| Postulante | no pide id; el identificador único es el **usuario** | — |

---

## 3. ARQUITECTURA GENERAL

```
/index.html
/css/estilos.css
/js/Postulante.js
/js/Admin.js
/js/OfertaLaboral.js
/js/Postulacion.js
/js/Sistema.js
/js/datosPrecargados.js
/js/app.js          ← la UI (pantallas + eventos)
```

En `index.html`, al final del `<body>`, cargá los scripts **en este orden** (las clases primero, después la precarga, después la app):

```html
<script src="js/Postulante.js"></script>
<script src="js/Admin.js"></script>
<script src="js/OfertaLaboral.js"></script>
<script src="js/Postulacion.js"></script>
<script src="js/Sistema.js"></script>
<script src="js/datosPrecargados.js"></script>
<script src="js/app.js"></script>
```

**Mapa mental:**
- Las 4 clases de datos (`Postulante`, `Admin`, `OfertaLaboral`, `Postulacion`) son moldes: guardan datos y poco más.
- `Sistema` es el cerebro: tiene los arrays, los contadores y TODA la lógica.
- `app.js` es la cara: arma pantallas con `innerHTML`, escucha botones y le pide cosas al `Sistema`.

---

## 4. TABLERO DE TAREAS (orden recomendado)

Hacelo en este orden porque cada fase depende de la anterior. No pases a la siguiente hasta que la actual ande.

- [ ] **Fase 0** — Estructura de archivos + `index.html` con los `<script>`
- [ ] **Fase 1** — Las 4 clases de datos (moldes simples)
- [ ] **Fase 2** — Clase `Sistema`: arrays privados, contadores y métodos base
- [ ] **Fase 3** — Validaciones (usuario único, password) + registro y login
- [ ] **Fase 4** — Precarga de datos
- [ ] **Fase 5** — UI base: navegación entre pantallas + login/logout visual
- [ ] **Fase 6** — Funcionalidades del postulante
- [ ] **Fase 7** — Funcionalidades del admin (ofertas)
- [ ] **Fase 8** — Procesamiento de postulaciones (la parte más difícil)
- [ ] **Fase 9** — Estadísticas
- [ ] **Fase 10** — Repaso, comentarios y casos de prueba

---

## 5. FASE 1 — LAS 4 CLASES DE DATOS

### ¿Qué es una clase? (concepto base)
Una **clase es un molde** para crear objetos. Define qué datos tendrá algo y qué puede hacer, pero no es una cosa concreta: es la plantilla. Analogía del curso: la clase es **el plano de una casa**, y cada casa construida con ese plano es un **objeto**.

```
class Postulante { ... }                          // ← el molde (clase)
let ana = new Postulante("ana123", "Clave1a", ...); // ← objeto concreto (instancia)
//  ↑ minúscula = objeto       ↑ mayúscula = clase
```

La clase `Postulante` **no es** un postulante: es la definición de cómo son. Cuando querés uno de verdad, lo fabricás con `new`. Podés fabricar todos los que quieras con el mismo molde, cada uno con sus propios valores. Por eso las clases van en **PascalCase** (mayúscula inicial): para distinguir de un vistazo el molde (`Postulante`) del objeto (`postulante`).

Son moldes. Cada una: un `constructor` que recibe los datos y los guarda con `this`. Nada de lógica pesada acá.

### `Postulante`
Propiedades: `usuario`, `password`, `nombreCompleto`, `nivelExperiencia`, `areaInteres`.
- `nivelExperiencia` ∈ { "Junior", "Semi-Senior", "Senior" }
- `areaInteres` ∈ { "Tecnología", "Diseño", "Marketing", "Administración", "Otros" }

### `Admin`
Propiedades: `id` (número), `nombre`, `usuario`, `password`.

### `OfertaLaboral`
Propiedades: `id` (string `JOB_OFFER_n`), `titulo`, `empresa`, `descripcion`, `nivelRequerido`, `area`, `limitePostulaciones`, `cantidadVacantes`, `destacada` (true/false), `estado`.
- `estado` ∈ { "Activa", "Inactiva", "Cerrada" } → arranca siempre en `"Activa"`.

> **`limitePostulaciones` vs `cantidadVacantes` (no son lo mismo):** controlan dos momentos distintos.
> - `limitePostulaciones` = cuánta gente puede **anotarse** (tope de *entrada*). Ej: 5.
> - `cantidadVacantes` = cuánta gente vas a **contratar** = postulaciones aceptadas (tope de *salida*). Ej: 2.
>
> O sea: se pueden anotar hasta 5, pero solo tomás a 2. Por eso la letra exige `limitePostulaciones >= cantidadVacantes` (no podés contratar más de los que se anotaron).
>
> **Cada uno inactiva la oferta por su lado** (el que se toca primero, gana):
> 1. Se llenan las vacantes (aceptaste 2 de 2) → Inactiva, motivo "vacantes cubiertas".
> 2. Se llega al límite de anotados (5 de 5), aunque no hayas aceptado a nadie → Inactiva, motivo "límite alcanzado".
>
> `vacantes` mira las **aceptadas**; `limite` mira las **anotadas**. Esto es justo lo que chequeás en la Fase 8.

### `Postulacion`
Propiedades: `id` (string `JOB_n`), `oferta` (o el id de la oferta), `postulante` (o el usuario), `estado`.
- `estado` ∈ { "pendiente", "aceptada", "rechazada" } → arranca en `"pendiente"`.

**Cómo hacerlas:** una clase por archivo. Ejemplo del patrón (NO el código final, es para que veas la forma):

```
class Postulante {
    constructor(usuario, password, nombreCompleto, nivelExperiencia, areaInteres) {
        this.usuario = usuario;
        this.password = password;
        // ...el resto igual
    }
}
```

**Resultado esperado:** podés crear objetos con `new Postulante(...)` y ver sus propiedades en consola. Nada más por ahora.

---

## 6. FASE 2 — CLASE `Sistema` (el cerebro)

Acá viven los 4 arrays como **propiedades privadas** y los contadores autoincrementales.

```
class Sistema {
    #postulantes = [];
    #admins = [];
    #ofertas = [];
    #postulaciones = [];
    #contadorOferta = 0;
    #contadorPostulacion = 0;
    #contadorAdmin = 0;
    constructor() { }
    // ...métodos
}
```

> **¿Por qué los arrays arrancan vacíos?** Porque *cualquier* array nace vacío. No traen datos solos: se llenan cuando vos les hacés `push`. En esta app se llenan en la **precarga** (Fase 4). Después de correr la precarga, `#admins` ya tiene 3, `#ofertas` tiene 10, etc.

> **¿Por qué tres contadores separados (`#contadorOferta`, `#contadorPostulacion`, `#contadorAdmin`)?** Porque cada uno numera una cosa distinta y alimenta un id con formato distinto. Son **talonarios de tickets independientes**: cada serie va limpia desde 1 sin pisar a la otra.
> - `#contadorOferta` → ids `JOB_OFFER_1`, `JOB_OFFER_2`, `JOB_OFFER_3`...
> - `#contadorPostulacion` → ids `JOB_1`, `JOB_2`, `JOB_3`...
> - `#contadorAdmin` → ids `1`, `2`, `3` (solo el número)
>
> Si usaras un solo contador compartido, los números saldrían entreverados (`JOB_OFFER_1`, `JOB_OFFER_2`, `JOB_3`, `JOB_OFFER_4`...) y sin sentido. Todos arrancan en `0` y el primer `+1` los lleva a `1`. Al ser privados (`#`), nadie los puede desincronizar desde afuera.

### Métodos base de esta fase
| Función | Qué hace | Cómo hacerla |
|---|---|---|
| `agregarPostulante(postulante)` | mete el postulante al array | `this.#postulantes.push(postulante)` |
| `agregarAdmin(nombre, usuario, password)` | crea un `Admin` con id autoincremental y lo guarda | sumá 1 al `#contadorAdmin`, `new Admin(...)`, `push` |
| `buscarPostulantePorUsuario(usuario)` | devuelve el postulante o `null` | **for** sobre `#postulantes`, comparar `usuario` en minúsculas (`toLowerCase()`) |
| `buscarOfertaPorId(id)` | devuelve la oferta o `null` | **for** sobre `#ofertas`, comparar `oferta.id == id` |
| `obtenerTodasLasOfertas()` | devuelve una copia del array | `return [...this.#ofertas]` (copia segura, no el original) |

**Importante sobre el `for`:** como no podés usar `find`, el patrón de "buscar" es siempre así:

```
buscarOfertaPorId(id) {
    for (let i = 0; i < this.#ofertas.length; i++) {
        if (this.#ofertas[i].id == id) {
            return this.#ofertas[i];
        }
    }
    return null; // no se encontró
}
```

**Resultado esperado:** desde consola podés hacer `sistema.agregarPostulante(...)` y `sistema.buscarPostulantePorUsuario("ana")` y te devuelve el objeto.

---

## 7. FASE 3 — VALIDACIONES + REGISTRO + LOGIN

Estas funciones son **previas** a todo lo demás del postulante: sin ellas no podés registrar ni precargar bien.

### `existeUsuario(usuario)` → true / false
Reutiliza `buscarPostulantePorUsuario`. Si devuelve algo distinto de `null`, el usuario existe.
> Recordá: **case insensitive**. "a" y "A" son el mismo usuario. Compará todo en `toLowerCase()`.

### `validarPassword(password)` → true / false
Requisitos: mínimo 5 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número.
**Cómo hacerla:** recorré el string con un `for` usando `charAt(i)`. Llevá tres flags:
```
let tieneMayus = false, tieneMinus = false, tieneNumero = false;
for (let i = 0; i < password.length; i++) {
    let c = password.charAt(i);
    if (c >= "A" && c <= "Z") { tieneMayus = true; }
    if (c >= "a" && c <= "z") { tieneMinus = true; }
    if (c >= "0" && c <= "9") { tieneNumero = true; }
}
// devolver: largo >= 5 && tieneMayus && tieneMinus && tieneNumero
```

### `registrarPostulante(usuario, password, nombreCompleto, nivel, area)` → mensaje de resultado
Pasos (en este orden):
1. Que ningún campo esté vacío (`trim()` y comparar con `""`).
2. Que `usuario.length >= 5`.
3. Que NO exista ya (`existeUsuario`).
4. Que el password sea válido (`validarPassword`).
5. Si todo pasa: `new Postulante(...)` + `agregarPostulante(...)`.
6. Devolver un texto claro: éxito o el primer error encontrado.

### `loginPostulante(usuario, password)` → el postulante o `null`
Buscá por usuario; si existe y el password coincide, devolvelo. Si no, `null`.

### `loginAdmin(usuario, password)` → el admin o `null`
Igual pero sobre `#admins`.

**Resultado esperado:** desde consola registrás un usuario, intentás registrarlo de nuevo y te lo rechaza; logueás bien y mal y responde correcto.

---

## 8. FASE 4 — PRECARGA DE DATOS

Archivo `datosPrecargados.js`. Acá creás la instancia del sistema y la llenás. **Necesita que las fases 1, 2 y 3 estén hechas.**

> **"Precargado" no es magia:** es literalmente este archivo con líneas que crean objetos al arrancar la app. Que los admins estén "precargados" significa que **los creás vos acá** (no hay form de registro de admin), pero igual los fabricás con `new Admin(...)` como cualquier objeto. Por eso necesitás la **clase `Admin`** aunque "ya vengan creados": el molde es lo que te deja fabricarlos. Cuando recargás la página (F5), este archivo se vuelve a ejecutar y volvés a tener los mismos datos → esa es la razón por la que no necesitás base de datos.

> **Admin vs Postulante — la diferencia NO es "uno se crea y el otro no".** Los dos se crean con su clase y van a su array. La diferencia es **quién y cuándo**: los admins los creás vos acá (al inicio), los postulantes los crea el usuario desde el registro (mientras la app corre). Por eso no hay pantalla de "registrate como admin".

Mínimos que pide la letra:
- **3 admins**
- **15 postulantes** repartidos en distintos niveles
- **10 ofertas** (al menos 2 destacadas, con distintos niveles y estados)
- **20 postulaciones** en distintos estados

**Cómo hacerla:**
```
const sistema = new Sistema();

// --- Admins (precargados, no se registran) ---
sistema.agregarAdmin("Luciano", "luciano", "Admin123");
sistema.agregarAdmin("Gerónimo", "geronimo", "Admin123");
sistema.agregarAdmin("Surén", "suren", "Admin123");

// --- Postulantes de prueba ---
sistema.agregarPostulante(new Postulante("usuario1", "Postulante123", "Juan Pérez", "Junior", "Tecnología"));
// ...hasta 15

// --- Ofertas ---
sistema.agregarOferta("Dev Frontend", "Acme", "...", "Junior", "Tecnología", 5, 2, true);
// ...hasta 10

// --- Postulaciones consistentes ---
// ...hasta 20
```

> **Quién arma el id del admin — dos opciones:**
> - **Opción 1 (recomendada):** `agregarAdmin(nombre, usuario, password)` arma el `Admin` adentro del Sistema y le pone el id solo:
>   ```
>   agregarAdmin(nombre, usuario, password) {
>       this.#contadorAdmin = this.#contadorAdmin + 1;
>       let admin = new Admin(this.#contadorAdmin, nombre, usuario, password);
>       this.#admins.push(admin);
>   }
>   ```
>   El contador del id vive en un solo lugar y nadie de afuera lo toca.
> - **Opción 2:** armás el `Admin` afuera y le pasás el id a mano: `sistema.agregarAdmin(new Admin(1, ...))`. Funciona pero tenés que llevar vos los números (1, 2, 3) y es más fácil equivocarse.

> **Ojo:** la variable `sistema` que creás acá es **la misma** que usa `app.js`. Como los scripts comparten el ámbito global, `app.js` puede hacer `sistema.loginAdmin(...)` y va a encontrar a los admins que pusiste acá.

> **Consistencia (te lo van a mirar):** que los niveles de las postulaciones respeten la compatibilidad, que la cantidad de "aceptadas" de una oferta no supere sus vacantes, y que haya ofertas en los 3 estados para poder probar todo.

**Resultado esperado:** al abrir la página (aunque no haya UI todavía), `console.log(sistema.obtenerTodasLasOfertas())` muestra las 10 ofertas.

---

## 9. FASE 5 — UI BASE (navegación + headers + login)

### 9.0 Concepto: una sola página (SPA)

Toda la app es **una sola página** (`index.html`) que va **mostrando y ocultando** cosas con JS. Tiene nombre: **SPA** (Single Page Application). El usuario "navega" entre pantallas, pero nunca se recarga la página.

**¿Por qué una sola y no varios `.html`?** Porque tu estado vive **en memoria** (no usás `localStorage`). Si tuvieras varios HTML y navegaras con links (`<a href="otra.html">`), cada cambio de página **recarga todo el JS y perdés el estado**: la sesión, las postulaciones hechas, todo volvería a la precarga inicial. Con una sola página, los arrays del `Sistema` y la sesión sobreviven hasta que apretás F5 a propósito. **No es una opción estética, es la única forma de que no se borre el estado.**

### 9.1 Las dos formas de "mostrar/ocultar" (elegí la A)

- **Opción A — reescribir el contenido con `innerHTML`** (la que usamos): hay un solo `<div id="app">` vacío y cada pantalla lo rellena de nuevo. Lo anterior se borra y se reemplaza.
- **Opción B — todo el HTML escrito y prender/apagar con `display`**: tenés todas las pantallas en el HTML y mostrás una con `style.display = "block"` y escondés el resto con `"none"`.

**Para este obligatorio va la Opción A**, porque casi todo tu contenido es **dinámico** (las ofertas, las postulaciones y la tabla de estadísticas dependen de los arrays y cambian). Esas las tenés que generar con `for` igual. La Opción B sirve para contenido fijo, que no es tu caso. El único costo de la A: cada vez que reescribís el `innerHTML`, los botones son nuevos y hay que **reengancharles los eventos** (ver 9.4).

### 9.2 El login va fijo en el HTML; los headers se generan con JS

- **Login**: es una sola pantalla y no cambia → escribilo directo en `index.html` con su propio header fijo. No tiene sentido generarlo con JS.
- **Header del postulante y header del admin**: muestran botones distintos → **una función para cada uno** (más limpio que un `if` gigante).

```js
function headerPostulante() {
    let html = "<header>";
    html = html + "<h1>Cartelera de Postulaciones</h1>";
    html = html + "<span>Hola, " + usuarioLogueado.usuario + "</span>";
    html = html + "<button id='btnOfertas'>Ofertas</button>";
    html = html + "<button id='btnMisPost'>Mis postulaciones</button>";
    html = html + "<button id='btnDestacadas'>Destacadas</button>";
    html = html + "<button id='btnSalir'>Salir</button>";
    html = html + "</header>";
    return html;
}

function headerAdmin() {
    let html = "<header>";
    html = html + "<h1>Panel Administrador</h1>";
    html = html + "<span>Hola, " + adminLogueado.nombre + "</span>";
    html = html + "<button id='btnCrearOferta'>Crear oferta</button>";
    html = html + "<button id='btnListadoOfertas'>Ofertas</button>";
    html = html + "<button id='btnProcesar'>Procesar postulaciones</button>";
    html = html + "<button id='btnEstadisticas'>Estadísticas</button>";
    html = html + "<button id='btnSalir'>Salir</button>";
    html = html + "</header>";
    return html;
}
```

Cada pantalla pega el header que corresponde adelante de su contenido (la de admin usa `headerAdmin()`, la de postulante usa `headerPostulante()`).

### 9.3 Una sola función de navegación (router)

Tené **una sola** `mostrarPantalla(nombre)` como puerta de entrada a toda la navegación. **No le pases el rol por parámetro**: ya lo tenés en la variable de sesión, lo lee solo. Pasarlo sería redundante y podría no coincidir con quién está realmente adentro.

```js
let usuarioLogueado = null;   // sesión del postulante
let adminLogueado = null;     // sesión del admin

function mostrarPantalla(nombrePantalla) {
    // Protección: si no hay nadie logueado, siempre al login y cortamos
    if (usuarioLogueado == null && adminLogueado == null) {
        renderLogin();
        return;
    }
    // A partir de acá hay alguien adentro
    if (nombrePantalla == "ofertas") {
        renderOfertasPostulante();
    } else if (nombrePantalla == "misPostulaciones") {
        renderMisPostulaciones();
    } else if (nombrePantalla == "destacadas") {
        renderDestacadas();
    } else if (nombrePantalla == "crearOferta") {
        renderCrearOferta();
    } else if (nombrePantalla == "listadoOfertas") {
        renderListadoOfertas();
    } else if (nombrePantalla == "procesar") {
        renderProcesarPostulaciones();
    } else if (nombrePantalla == "estadisticas") {
        renderEstadisticas();
    }
}
```

El `return` temprano te protege de que alguien entre a una pantalla sin estar logueado.
> Regla: **el router es uno solo**; la separación admin/postulante vive en los **headers** y en qué pantallas habilitás, no en tener dos routers.

### 9.4 Conectar (y reconectar) los botones

Como no usás `<form>` con submit, todo va con `<button id="...">` + `addEventListener`. **Cada `innerHTML` borra los listeners anteriores**, así que después de cada render hay que volver a engancharlos. Conviene una función por header:

```js
function renderOfertasPostulante() {
    let html = headerPostulante();
    html = html + "<h2>Ofertas disponibles</h2>";
    // ...tarjetas de ofertas armadas con un for...
    document.querySelector("#app").innerHTML = html;
    conectarEventosPostulante();   // ← reenganchás los botones del header
}

function conectarEventosPostulante() {
    let btnSalir = document.querySelector("#btnSalir");
    if (btnSalir != null) {                       // chequeás que exista antes
        btnSalir.addEventListener("click", cerrarSesion);
    }
    let btnOfertas = document.querySelector("#btnOfertas");
    if (btnOfertas != null) {
        btnOfertas.addEventListener("click", function() { mostrarPantalla("ofertas"); });
    }
    // ...el resto de los botones del header del postulante
}
```

Hacé una `conectarEventosAdmin()` equivalente para el header del admin.

### 9.5 Login y cerrar sesión

```js
// en el handler del botón de login (está fijo en index.html):
let usuario = document.querySelector("#inputUsuario").value;
let pass = document.querySelector("#inputPass").value;
let postulante = sistema.loginPostulante(usuario, pass);
if (postulante != null) {
    usuarioLogueado = postulante;
    mostrarPantalla("ofertas");
} else {
    let admin = sistema.loginAdmin(usuario, pass);
    if (admin != null) {
        adminLogueado = admin;
        mostrarPantalla("crearOferta");   // o la pantalla inicial del admin
    } else {
        // mostrar error de credenciales en un <p>
    }
}

function cerrarSesion() {
    usuarioLogueado = null;
    adminLogueado = null;
    renderLogin();
}
```

### Funciones de infraestructura (resumen)
| Función | Qué hace |
|---|---|
| `mostrarPantalla(nombre)` | router único: decide qué render llamar |
| `renderLogin()` | vuelve a mostrar la pantalla de login |
| `headerPostulante()` / `headerAdmin()` | devuelven el HTML del header según el rol |
| `conectarEventosPostulante()` / `conectarEventosAdmin()` | reenganchan los botones tras cada `innerHTML` |
| `cerrarSesion()` | limpia la sesión y vuelve al login |

**Resultado esperado:** entrás como postulante o como admin, ves un header distinto según quién sos, navegás entre pantallas sin recargar (el estado se mantiene), y cerrás sesión volviendo al login.

---

## 10. FASE 6 — FUNCIONALIDADES DEL POSTULANTE

### 10.1 Ver ofertas a las que SE PUEDE postular
La estrella de esta fase. Una oferta aparece **solo si**:
1. está `"Activa"`, **Y**
2. es compatible con el nivel del postulante, **Y**
3. el postulante NO se postuló antes a esa oferta.

Funciones necesarias (crealas en este orden):

**`esCompatibleNivel(nivelPostulante, nivelOferta)` → true / false**
> ⚠️ **SUPUESTO A CONFIRMAR CON EL DOCENTE.** La letra solo dice: Junior ≠ Semi-Senior (ni al revés) y Senior puede a todo. Asumo: *un postulante solo puede a ofertas de su MISMO nivel, salvo el Senior que puede a cualquiera.* Dejá esta regla aislada en esta única función para cambiarla fácil.
```
if (nivelPostulante == "Senior") { return true; }
return nivelPostulante == nivelOferta;
```

**`yaSePostulo(postulante, oferta)` → true / false**
**for** sobre `#postulaciones`: si encontrás una con ese postulante Y esa oferta, `return true`.

**`obtenerOfertasParaPostulante(postulante, soloAreaInteres)` → array de ofertas**
**for** sobre `#ofertas`, y dentro un `if` con las 3 condiciones. Si `soloAreaInteres == true`, sumá la condición de que el área coincida. Las que pasan, las metés en un array nuevo con `push` y lo devolvés.
```
let resultado = [];
for (let i = 0; i < this.#ofertas.length; i++) {
    let o = this.#ofertas[i];
    if (o.estado == "Activa" && this.esCompatibleNivel(postulante.nivelExperiencia, o.nivelRequerido) && !this.yaSePostulo(postulante, o)) {
        if (soloAreaInteres == false || o.area == postulante.areaInteres) {
            resultado.push(o);
        }
    }
}
return resultado;
```

**UI:** `renderOfertasPostulante()` recorre ese array con un `for` y arma una tarjeta por oferta con un botón "Postularme". Por defecto `soloAreaInteres = true`, y un botón "Ver todas" que vuelve a renderizar con `false`.

### 10.2 Postularse
**`crearPostulacion(postulante, oferta)`**
1. Sumá 1 a `#contadorPostulacion`.
2. Armá el id: `"JOB_" + this.#contadorPostulacion`.
3. `new Postulacion(id, oferta, postulante)` con estado `"pendiente"`.
4. `push` al array.
> Antes de crear, podés volver a chequear `yaSePostulo` por las dudas.

### 10.3 Mis postulaciones
**`obtenerPostulacionesDePostulante(postulante)` → array**
**for** sobre `#postulaciones`, las que sean de ese postulante van a un array nuevo.
**UI:** `renderMisPostulaciones()` las recorre con `for` y muestra **nombre de la oferta + estado** (pendiente/aceptada/rechazada).

### 10.4 Catálogo de destacadas
**`obtenerOfertasDestacadas()` → array**
**for** sobre `#ofertas`, las que tengan `destacada == true`. (Pensá si filtrás también por `"Activa"` — razonable, confirmá criterio.)
**UI:** `renderDestacadas()` muestra título, empresa, nivel requerido y descripción breve, con botón para postularse.

**Resultado esperado de la Fase 6:** un postulante ve solo ofertas válidas, se postula, y esa oferta desaparece de su lista y aparece en "mis postulaciones" como pendiente.

---

## 11. FASE 7 — FUNCIONALIDADES DEL ADMIN (ofertas)

### 11.1 Crear oferta
**`agregarOferta(titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada)` → mensaje**
1. Validar campos no vacíos.
2. **Validar que `limite >= vacantes`** (lo pide la letra).
3. Sumá 1 a `#contadorOferta`, armá id `"JOB_OFFER_" + contador`.
4. `new OfertaLaboral(...)` con estado `"Activa"`.
5. `push`.
**UI:** `renderCrearOferta()` con inputs + botón. El `destacada` puede ser un checkbox.

### 11.2 Listado completo + editar + cerrar
**`renderListadoOfertas()`** recorre `obtenerTodasLasOfertas()` con `for` y muestra todas (Activas, Inactivas, Cerradas) con su info y dos botones: **Editar** y **Cerrar**.

**`cerrarOferta(idOferta)`** → eliminación **LÓGICA**: buscá la oferta y poné `oferta.estado = "Cerrada"`. **Nunca** la borres del array.

**`editarOferta(idOferta, nuevosDatos)`** → buscá la oferta y actualizá sus propiedades.

**Resultado esperado:** el admin crea una oferta y aparece en el listado; la cierra y queda como "Cerrada" pero sigue en el array.

---

## 12. FASE 8 — PROCESAR POSTULACIONES (la parte complicada, hacela con calma)

### Funciones auxiliares primero
**`obtenerPostulacionesPendientes()` → array** → `for` que junta las de estado `"pendiente"`.

**`contarPostulacionesDeOferta(oferta, estado)` → número** → `for` que cuenta cuántas postulaciones de esa oferta tienen ese estado. La vas a reusar un montón.

### El método grande
**`aceptarPostulacion(idPostulacion)` → objeto/mensaje con lo que pasó**
> La letra dice "procesar". Asumo: **procesar = aceptar** (con todos los efectos en cascada). Opcional: agregar un botón "Rechazar" manual. **Confirmá con el docente** si querés el rechazo manual.

Pasos exactos:
1. Buscá la postulación por id y su oferta asociada.
2. Marcá la postulación como `"aceptada"`.
3. Contá las **aceptadas** de esa oferta (`contarPostulacionesDeOferta(oferta, "aceptada")`).
4. **Si aceptadas == vacantes** → se cubrieron todas:
   - Recorré las postulaciones de esa oferta con un `for` y todas las que sigan `"pendiente"` pasalas a `"rechazada"` (contá cuántas rechazaste).
   - Poné `oferta.estado = "Inactiva"`. Motivo: "vacantes cubiertas".
5. **Si no**, contá el total de postulaciones de la oferta (pendientes + aceptadas + rechazadas) y **si ese total >= limitePostulaciones** → `oferta.estado = "Inactiva"`. Motivo: "límite de postulaciones alcanzado".
6. **Devolvé un mensaje claro** que diga: que la postulación fue aprobada, si la oferta cambió de estado y por qué, y cuántas pendientes se rechazaron automáticamente.

**UI:** `renderProcesarPostulaciones()` lista las pendientes (con `for`), cada una con su botón. Al apretarlo, llama `aceptarPostulacion(id)`, **muestra el mensaje devuelto** y vuelve a renderizar la lista (ya sin esa postulación).

**Resultado esperado:** aceptás postulaciones, y cuando se llenan las vacantes la oferta se inactiva sola, las demás pendientes se rechazan solas, y la pantalla te explica qué pasó.

---

## 13. FASE 9 — ESTADÍSTICAS

Vista aparte para el admin. Todas con bucles `for`, contadores manuales.

### `estadisticasPorOferta()` → array de objetos
Por cada oferta, contá sus postulaciones por estado y armá un objeto:
```
{ titulo: ..., pendientes: X, aceptadas: Y, rechazadas: Z, total: X+Y+Z }
```
Usá `contarPostulacionesDeOferta` para cada conteo. Metelos en un array y devolvelo.
**UI:** una `<table>` armada con `for`. Sumá un input de **búsqueda por título**: al escribir, re-renderizás la tabla mostrando solo las ofertas cuyo título `includes` (o `indexOf != -1`) el texto buscado, en minúsculas.

### `contarOfertasPorEstado()` → objeto `{ activas, inactivas, cerradas }`
Un `for` con tres contadores y un `switch` o `if` según `oferta.estado`.

### `porcentajeVacantesCubiertas()` → número
Dos acumuladores recorriendo ofertas: `totalVacantes` (suma de `cantidadVacantes`) y `vacantesCubiertas` (suma de aceptadas de cada oferta). Devolvé `(vacantesCubiertas / totalVacantes) * 100`. **Cuidá la división por cero** si no hay vacantes.

### `postulanteConMasPostulacionesActivas()` → el postulante
> **SUPUESTO A CONFIRMAR:** "activas" = pendientes + aceptadas (no rechazadas).
Patrón de **máximo** (como en clase, sin arrays de apoyo): recorré los postulantes, para cada uno contá sus postulaciones activas, y guardá el que tenga más en una variable acumuladora.

**Resultado esperado:** una pantalla con la tabla buscable, los totales por estado, el porcentaje y el postulante top.

---

## 14. FASE 10 — CIERRE

- [ ] Releé el código y agregá **comentarios en español** explicando el *porqué* (lo piden y ayuda en la defensa).
- [ ] Confirmá que no quedó ningún `map`/`filter`/`find`/`reduce`/`forEach`/`localStorage`.
- [ ] Verificá nombres mnemotécnicos y `{ }` en todos lados.
- [ ] Probá los **casos de prueba** (esto va en el doc de análisis, entrega aparte):
  - Registro con usuario repetido (mayúsc/minúsc) → debe rechazar.
  - Password sin número / sin mayúscula / corto → debe rechazar.
  - Junior intentando ver oferta Senior → no debe aparecer.
  - Postularse dos veces a la misma oferta → no debe poder.
  - Aceptar postulaciones hasta llenar vacantes → oferta a Inactiva + rechazos automáticos.
  - Cerrar oferta → estado "Cerrada", sigue en el array.

---

## 15. MAPA DE DEPENDENCIAS (qué necesita qué)

```
Clases de datos (Fase 1)
        │
        ▼
Sistema: arrays + buscar (Fase 2)
        │
        ├──► Validaciones + registro/login (Fase 3) ──► Precarga (Fase 4)
        │
        ▼
UI base + sesión (Fase 5)
        │
        ├──► Postulante: esCompatibleNivel → yaSePostulo → obtenerOfertasParaPostulante
        │                → crearPostulacion → misPostulaciones → destacadas (Fase 6)
        │
        ├──► Admin: agregarOferta → listado → cerrar/editar (Fase 7)
        │
        ├──► contarPostulacionesDeOferta → aceptarPostulacion (Fase 8)
        │
        └──► Estadísticas (Fase 9, usa contarPostulacionesDeOferta)
```

**Reglas de oro:**
- `esCompatibleNivel` y `yaSePostulo` tienen que existir **antes** de `obtenerOfertasParaPostulante`.
- `contarPostulacionesDeOferta` tiene que existir **antes** de `aceptarPostulacion` y de las estadísticas.
- No arranques la UI (Fase 5) sin tener la precarga (Fase 4) andando.

---

## 16. CHECKLIST FINAL DE ENTREGA (de la letra)

- [ ] Carpeta `obligatorio/` que corre desde `index.html`
- [ ] Las 5 clases implementadas (`Sistema`, `Postulante`, `Admin`, `OfertaLaboral`, `Postulacion`)
- [ ] Todos los arrays gestionados dentro de `Sistema`
- [ ] Precarga mínima: 3 admins, 15 postulantes, 10 ofertas (2+ destacadas), 20 postulaciones
- [ ] Código comentado
- [ ] Doc de análisis (formularios + casos de prueba) — **entrega aparte, ojo la fecha**
- [ ] Uso de IA documentado
- [ ] Prepararse para la **defensa presencial** (es eliminatoria: si no la das, perdés todos los puntos)