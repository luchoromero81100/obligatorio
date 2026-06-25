// =========================================================================
//  UI (pantallas + eventos). Solo recolecta datos de inputs, llama a métodos
//  del Sistema y muestra resultados. Nunca toca los arrays privados directo.
// =========================================================================

// --- VARIABLES DE SESIÓN GLOBAL ---
let usuarioLogueado = null;
let rolLogueado = "";

// --- ARRANQUE: conectamos los botones fijos del HTML ---
window.addEventListener("load", function () {
    // Botón de login
    let btnIngresar = document.querySelector("#btn-login-ingresar");
    if (btnIngresar != null) {
        btnIngresar.addEventListener("click", procesarLogin);
    }

    // Botón de crear oferta (admin)
    let btnCrearOferta = document.querySelector("#btn-admin-crear-oferta");
    if (btnCrearOferta != null) {
        btnCrearOferta.addEventListener("click", procesarAltaOferta);
    }

    // Botón de registro de postulante
    let btnRegistro = document.querySelector("#btn-registrar-usuario");
    if (btnRegistro != null) {
        btnRegistro.addEventListener("click", procesarRegistro);
    }
});

// --- LOGIN ---
function procesarLogin() {
    let txtUser = document.querySelector("#txt-login-usuario").value.trim();
    let txtPass = document.querySelector("#txt-login-password").value;
    let lblError = document.querySelector("#lbl-login-error");

    if (txtUser == "" || txtPass == "") {
        lblError.innerText = "Debe completar todos los campos";
        return;
    }

    // Vemos si el usuario existe como postulante o como admin
    let postulanteExistente = miSistema.buscarPostulantePorUsuario(txtUser);
    let adminExistente = miSistema.buscarAdminPorUsuario(txtUser);

    if (postulanteExistente == null && adminExistente == null) {
        lblError.innerText = "Nombre de usuario incorrecto";
        return;
    }

    // Intentar como postulante
    if (postulanteExistente != null) {
        let postulanteEncontrado = miSistema.loginPostulante(txtUser, txtPass);
        if (postulanteEncontrado == null) {
            lblError.innerText = "Contraseña incorrecta";
            return;
        }
        usuarioLogueado = postulanteEncontrado;
        rolLogueado = "postulante";
        mostrarSeccion("seccion-postulante");
        document.querySelector("#nombre-postulante-logueado").innerText = usuarioLogueado.nombreCompleto;
        mostrarOfertasPostulante();
        return;
    }

    // Intentar como admin
    let adminEncontrado = miSistema.loginAdmin(txtUser, txtPass);
    if (adminEncontrado == null) {
        lblError.innerText = "Contraseña incorrecta";
        return;
    }
    usuarioLogueado = adminEncontrado;
    rolLogueado = "admin";
    mostrarSeccion("seccion-admin");
    mostrarPostulacionesAdmin();
}

// --- REGISTRO DE POSTULANTE ---
function procesarRegistro() {
    let u = document.querySelector("#reg-usuario").value;
    let p = document.querySelector("#reg-password").value;
    let n = document.querySelector("#reg-nombre").value;
    let niv = document.querySelector("#reg-nivel").value;
    let area = document.querySelector("#reg-area").value;

    let resultado = miSistema.registrarPostulante(u, p, n, niv, area);

    let labelResultado = document.querySelector("#lbl-registro-resultado");
    labelResultado.innerText = resultado;

    // Si fue exitoso, volvemos al login después de 1.5 segundos
    if (resultado == "Registro exitoso") {
        setTimeout(function () {
            mostrarSeccion("seccion-login");
        }, 1500);
    }
}

// --- NAVEGACIÓN ENTRE SECCIONES ---
function mostrarSeccion(idSeccionAMostrar) {
    // Si vamos al login, limpiamos la sesión y los inputs
    if (idSeccionAMostrar == "seccion-login") {
        usuarioLogueado = null;
        rolLogueado = "";

        let inputUser = document.querySelector("#txt-login-usuario");
        let inputPass = document.querySelector("#txt-login-password");
        let lblError = document.querySelector("#lbl-login-error");

        if (inputUser != null) { inputUser.value = ""; }
        if (inputPass != null) { inputPass.value = ""; }
        if (lblError != null) { lblError.innerText = ""; }
    }

    let secciones = ["seccion-login", "seccion-postulante", "seccion-admin", "seccion-registro", "seccion-destacadas", "seccion-mis-postulaciones", "seccion-admin-ofertas", "seccion-admin-estadisticas"];

    for (let i = 0; i < secciones.length; i++) {
        let id = secciones[i];
        let elemento = document.querySelector("#" + id);

        if (elemento != null) {
            if (id == idSeccionAMostrar) {
                // Login y registro se centran con flex; el resto en bloque
                if (id == "seccion-login" || id == "seccion-registro") {
                    elemento.style.display = "flex";
                } else {
                    elemento.style.display = "block";
                }
            } else {
                elemento.style.display = "none";
            }
        }
    }
}

// --- VISUALIZAR LAS OFERTAS (POSTULANTE) ---
function mostrarOfertasPostulante() {
    let contenedor = document.querySelector("#contenedor-ofertas-postulante");
    if (contenedor == null) { return; }

    if (usuarioLogueado == null) {
        contenedor.innerHTML = "<p>Error: No se encontró la sesión del postulante.</p>";
        return;
    }

    // Estado del checkbox: si está marcado, solo su área de interés
    let chkFiltro = document.querySelector("#chk-ver-todas");
    let soloArea = true;
    if (chkFiltro != null) {
        soloArea = chkFiltro.checked;
    }

    let listaOfertas = miSistema.obtenerOfertasParaPostulante(usuarioLogueado, soloArea);

    // Buscador por puesto (título) o empresa
    let textoBusqueda = "";
    let inputBusqueda = document.querySelector("#txt-buscar-oferta");
    if (inputBusqueda != null) {
        textoBusqueda = inputBusqueda.value.toLowerCase();
    }

    let listaFiltrada = [];
    for (let i = 0; i < listaOfertas.length; i++) {
        let o = listaOfertas[i];
        if (textoBusqueda == "" || o.titulo.toLowerCase().indexOf(textoBusqueda) != -1 || o.empresa.toLowerCase().indexOf(textoBusqueda) != -1) {
            listaFiltrada.push(o);
        }
    }

    if (listaFiltrada.length == 0) {
        contenedor.innerHTML = "<p>No hay ofertas laborales disponibles</p>";
        return;
    }

    let tablaHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Empresa</th>
                    <th>Descripción</th>
                    <th>Nivel</th>
                    <th>Área</th>
                    <th>Vacantes</th>
                    <th>Límite postulaciones</th>
                    <th>Destacada</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < listaFiltrada.length; i++) {
        let oferta = listaFiltrada[i];
        let textoDestacada = "No";
        if (oferta.destacada == true) {
            textoDestacada = "Sí";
        }
        tablaHTML += `
            <tr>
                <td>${oferta.id}</td>
                <td><strong>${oferta.titulo}</strong></td>
                <td>${oferta.empresa}</td>
                <td>${oferta.descripcion}</td>
                <td>${oferta.nivelRequerido}</td>
                <td>${oferta.area}</td>
                <td>${oferta.cantidadVacantes}</td>
                <td>${oferta.limitePostulaciones}</td>
                <td>${textoDestacada}</td>
                <td>
                    <div class="acciones-tabla">
                        <button onclick="procesarPostulacion('${oferta.id}')">Postularme</button>
                    </div>
                </td>
            </tr>
        `;
    }

    tablaHTML += `
            </tbody>
        </table>
        <p id="lbl-mensaje-postulacion" class="mensaje"></p>
    `;

    contenedor.innerHTML = tablaHTML;
}

// --- ALTA DE OFERTAS (ADMINISTRADOR) ---
function procesarAltaOferta() {
    let titulo = document.querySelector("#txt-admin-titulo").value.trim();
    let empresa = document.querySelector("#txt-admin-empresa").value.trim();
    let descripcion = document.querySelector("#txt-admin-descripcion").value.trim();
    let nivel = document.querySelector("#sel-admin-nivel").value;
    let area = document.querySelector("#sel-admin-area").value;
    let limiteStr = document.querySelector("#num-admin-limite").value;
    let vacantesStr = document.querySelector("#num-admin-vacantes").value;
    let destacada = document.querySelector("#chk-admin-destacada").checked;
    let lbl = document.querySelector("#lbl-admin-oferta-resultado");

    // Convertimos los números; si están vacíos o no son válidos quedan en 0
    // y el Sistema devuelve el mensaje de validación correspondiente.
    let limite = Number(limiteStr);
    let vacantes = Number(vacantesStr);
    if (isNaN(limite)) { limite = 0; }
    if (isNaN(vacantes)) { vacantes = 0; }

    // El Sistema hace todas las validaciones y devuelve el mensaje exacto
    let respuesta = miSistema.agregarOferta(titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada);

    lbl.innerText = respuesta;
    if (respuesta.includes("correctamente")) {
        lbl.style.color = "green";
    } else {
        lbl.style.color = "red";
    }

    if (respuesta.includes("correctamente")) {
        // Limpiamos los inputs
        document.querySelector("#txt-admin-titulo").value = "";
        document.querySelector("#txt-admin-empresa").value = "";
        document.querySelector("#txt-admin-descripcion").value = "";
        document.querySelector("#num-admin-limite").value = "";
        document.querySelector("#num-admin-vacantes").value = "";
        document.querySelector("#chk-admin-destacada").checked = false;
    }
}

// --- PROCESAR LA POSTULACIÓN (POSTULANTE) ---
window.procesarPostulacion = function (idOferta) {
    // Detectamos en qué pantalla estamos para mostrar el mensaje en el label correcto
    let lblMensaje;
    let seccionDestacadas = document.querySelector("#seccion-destacadas");

    if (seccionDestacadas != null && seccionDestacadas.style.display != "none") {
        lblMensaje = document.querySelector("#lbl-mensaje-postulacion-destacada");
    } else {
        lblMensaje = document.querySelector("#lbl-mensaje-postulacion");
    }

    if (lblMensaje == null) {
        alert("Ocurrió un error: No se encontró el contenedor de mensajes.");
        return;
    }

    if (usuarioLogueado == null) {
        lblMensaje.innerText = "Error: Debes iniciar sesión.";
        return;
    }

    let ofertaEncontrada = miSistema.buscarOfertaPorId(idOferta);
    if (ofertaEncontrada == null) {
        lblMensaje.innerText = "Error: Oferta no encontrada.";
        return;
    }

    let mensajeResultado = miSistema.crearPostulacion(usuarioLogueado, ofertaEncontrada);

    if (mensajeResultado == "Postulación realizada correctamente") {
        lblMensaje.innerText = mensajeResultado;
        // Refrescamos la tabla actual para reflejar los cambios
        if (seccionDestacadas != null && seccionDestacadas.style.display != "none") {
            mostrarOfertasDestacadas();
        } else {
            mostrarOfertasPostulante();
        }
    } else {
        lblMensaje.innerText = mensajeResultado;
    }
};

// --- HISTORIAL DE POSTULACIONES (POSTULANTE) ---
function mostrarMisPostulaciones() {
    let contenedor = document.querySelector("#contenedor-mis-postulaciones");
    if (contenedor == null) { return; }

    let misPostulaciones = miSistema.obtenerPostulacionesDePostulante(usuarioLogueado);

    if (misPostulaciones.length == 0) {
        contenedor.innerHTML = "<p>No tenés postulaciones realizadas</p>";
        return;
    }

    let tablaHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID Postulación</th>
                    <th>Título oferta</th>
                    <th>Empresa</th>
                    <th>Nivel requerido</th>
                    <th>Área</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < misPostulaciones.length; i++) {
        let p = misPostulaciones[i];

        // Color según el estado para mejorar la lectura
        let colorEstado = "orange"; // Pendiente
        if (p.estado == "Aceptada") {
            colorEstado = "green";
        } else if (p.estado == "Rechazada") {
            colorEstado = "red";
        }

        tablaHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.oferta.titulo}</td>
                <td>${p.oferta.empresa}</td>
                <td>${p.oferta.nivelRequerido}</td>
                <td>${p.oferta.area}</td>
                <td style="font-weight: bold; color: ${colorEstado};">${p.estado}</td>
            </tr>
        `;
    }

    tablaHTML += "</tbody></table>";
    contenedor.innerHTML = tablaHTML;
}

// --- CATÁLOGO DE DESTACADAS (POSTULANTE) ---
function mostrarOfertasDestacadas() {
    let contenedor = document.querySelector("#contenedor-ofertas-destacadas");
    if (!contenedor) return;

    // 1. Obtenemos todas las destacadas
    let listaCompleta = miSistema.obtenerOfertasDestacadas();

    // 2. Filtramos: solo dejamos las que el usuario NO se haya postulado aún
    let listaFiltrada = listaCompleta.filter(o => !miSistema.yaSePostulo(usuarioLogueado, o));

    if (listaFiltrada.length == 0) {
        contenedor.innerHTML = "<p>No hay más ofertas destacadas disponibles para ti.</p>";
        return;
    }

    let tablaHTML = `<div class="table-responsive"><table>
        <thead><tr><th>ID</th><th>Título</th><th>Empresa</th><th>Nivel</th><th>Área</th><th>Acción</th></tr></thead>
        <tbody>`;

    for (let o of listaFiltrada) {
        tablaHTML += `<tr><td>${o.id}</td><td>${o.titulo}</td><td>${o.empresa}</td><td>${o.nivelRequerido}</td><td>${o.area}</td>
        <td><button onclick="procesarPostulacion('${o.id}')">Postularme</button></td></tr>`;
    }
    tablaHTML += `</tbody></table><p id="lbl-mensaje-postulacion-destacada"></p></div>`;
    contenedor.innerHTML = tablaHTML;
}
// --- POSTULACIONES PENDIENTES (ADMIN) ---
function mostrarPostulacionesAdmin() {
    let contenedor = document.querySelector("#lista-pendientes");
    if (contenedor == null) { return; }

    let lista = miSistema.obtenerPostulacionesPendientes();

    if (lista.length == 0) {
        contenedor.innerHTML = "<p>No hay postulaciones pendientes actualmente.</p>";
        return;
    }

    let html = `<table>
                    <tr>
                        <th>ID Postulación</th>
                        <th>Nombre del postulante</th>
                        <th>Oferta</th>
                        <th>Empresa</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>`;

    for (let i = 0; i < lista.length; i++) {
        let p = lista[i];
        html += `<tr>
                    <td>${p.id}</td>
                    <td>${p.postulante.nombreCompleto}</td>
                    <td>${p.oferta.titulo}</td>
                    <td>${p.oferta.empresa}</td>
                    <td>${p.estado}</td>
                    <td>
                        <div class="acciones-tabla">
                            <button class="btn-success" onclick="procesarAceptacion('${p.id}')">Aceptar</button>
                            <button class="btn-logout" onclick="procesarRechazo('${p.id}')">Rechazar</button>
                        </div>
                    </td>
                 </tr>`;
    }
    html += `</table>`;
    contenedor.innerHTML = html;
}

// Acepta una postulación (con toda la cascada de la Fase 8)
window.procesarAceptacion = function (idPostulacion) {
    let resultado = miSistema.aceptarPostulacion(idPostulacion);
    alert(resultado);
    mostrarPostulacionesAdmin();
};

// Rechazo manual de una postulación
window.procesarRechazo = function (idPostulacion) {
    let resultado = miSistema.modificarEstadoPostulacion(idPostulacion, "Rechazada");
    alert(resultado);
    mostrarPostulacionesAdmin();
};

// =========================================================================
//  LISTADO COMPLETO DE OFERTAS (ADMIN) — Editar / Cerrar
// =========================================================================
function mostrarListadoOfertasAdmin() {
    let contenedor = document.querySelector("#contenedor-listado-ofertas");
    if (contenedor == null) { return; }

    // Limpiamos el formulario de edición si estaba abierto
    let contEditar = document.querySelector("#contenedor-editar-oferta");
    if (contEditar != null) { contEditar.innerHTML = ""; }

    let ofertas = miSistema.obtenerTodasLasOfertas();

    if (ofertas.length == 0) {
        contenedor.innerHTML = "<p>No hay ofertas cargadas.</p>";
        return;
    }

    let html = `<table>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Empresa</th>
                        <th>Nivel</th>
                        <th>Área</th>
                        <th>Límite</th>
                        <th>Vacantes</th>
                        <th>Destacada</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>`;

    for (let i = 0; i < ofertas.length; i++) {
        let o = ofertas[i];
        let textoDestacada = "No";
        if (o.destacada == true) {
            textoDestacada = "Sí";
        }
        html += `<tr>
                    <td>${o.id}</td>
                    <td>${o.titulo}</td>
                    <td>${o.empresa}</td>
                    <td>${o.nivelRequerido}</td>
                    <td>${o.area}</td>
                    <td>${o.limitePostulaciones}</td>
                    <td>${o.cantidadVacantes}</td>
                    <td>${textoDestacada}</td>
                    <td>${o.estado}</td>
                    <td>
                        <div class="acciones-tabla">
                            <button onclick="mostrarFormularioEditar('${o.id}')">Editar</button>
                            <button class="btn-logout" onclick="procesarCerrarOferta('${o.id}')">Cerrar</button>
                        </div>
                    </td>
                 </tr>`;
    }
    html += `</table>`;
    contenedor.innerHTML = html;
}

// Cierre lógico de una oferta (queda en el array con estado "Cerrada")
window.procesarCerrarOferta = function (idOferta) {
    let resultado = miSistema.cerrarOferta(idOferta);
    alert(resultado);
    mostrarListadoOfertasAdmin();
};

// Arma las <option> de un select marcando la opción seleccionada (evita repetir código)
function armarOpciones(opciones, seleccionada) {
    let html = "";
    for (let i = 0; i < opciones.length; i++) {
        let sel = "";
        if (opciones[i] == seleccionada) {
            sel = " selected";
        }
        html += "<option value='" + opciones[i] + "'" + sel + ">" + opciones[i] + "</option>";
    }
    return html;
}

// Muestra un formulario básico para editar la oferta elegida
window.mostrarFormularioEditar = function (idOferta) {
    let o = miSistema.buscarOfertaPorId(idOferta);
    if (o == null) { return; }

    let cont = document.querySelector("#contenedor-editar-oferta");
    if (cont == null) { return; }

    let niveles = ["Junior", "Semi-Senior", "Senior"];
    let areas = ["Tecnología", "Diseño", "Marketing", "Administración", "Otros"];

    let destacadaChecked = "";
    if (o.destacada == true) {
        destacadaChecked = "checked";
    }

    let html = "<div class='contenedor-formulario'>";
    html += "<h4>Editar oferta " + o.id + "</h4>";
    html += "<div class='campo'><label>Título:</label><input type='text' id='edit-titulo' value='" + o.titulo + "'></div>";
    html += "<div class='campo'><label>Empresa:</label><input type='text' id='edit-empresa' value='" + o.empresa + "'></div>";
    html += "<div class='campo'><label>Descripción:</label><input type='text' id='edit-descripcion' value='" + o.descripcion + "'></div>";
    html += "<div class='campo'><label>Nivel:</label><select id='edit-nivel'>" + armarOpciones(niveles, o.nivelRequerido) + "</select></div>";
    html += "<div class='campo'><label>Área:</label><select id='edit-area'>" + armarOpciones(areas, o.area) + "</select></div>";
    html += "<div class='campo'><label>Límite:</label><input type='number' id='edit-limite' value='" + o.limitePostulaciones + "'></div>";
    html += "<div class='campo'><label>Vacantes:</label><input type='number' id='edit-vacantes' value='" + o.cantidadVacantes + "'></div>";
    html += "<label><input type='checkbox' id='edit-destacada' " + destacadaChecked + "> Destacada</label>";
    html += "<button class='btn-success' onclick=\"guardarEdicionOferta('" + o.id + "')\">Guardar</button>";
    html += "<p id='lbl-edit-resultado' class='resultado-msg'></p>";
    html += "</div>";

    cont.innerHTML = html;
};

// Guarda los cambios del formulario de edición
window.guardarEdicionOferta = function (idOferta) {
    let titulo = document.querySelector("#edit-titulo").value.trim();
    let empresa = document.querySelector("#edit-empresa").value.trim();
    let descripcion = document.querySelector("#edit-descripcion").value.trim();
    let nivel = document.querySelector("#edit-nivel").value;
    let area = document.querySelector("#edit-area").value;
    let limite = Number(document.querySelector("#edit-limite").value);
    let vacantes = Number(document.querySelector("#edit-vacantes").value);
    let destacada = document.querySelector("#edit-destacada").checked;

    let resultado = miSistema.editarOferta(idOferta, titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada);

    let lbl = document.querySelector("#lbl-edit-resultado");
    if (lbl != null) {
        lbl.innerText = resultado;
    }

    // Refrescamos el listado (si se guardó bien, el formulario se cierra)
    if (resultado.includes("correctamente")) {
        mostrarListadoOfertasAdmin();
        // También recargamos las "Postulaciones Recibidas" para que reflejen
        // los datos editados de la oferta (título, empresa, etc.) en tiempo real.
        mostrarPostulacionesAdmin();
    }
};

// =========================================================================
//  ESTADÍSTICAS (ADMIN)
// =========================================================================
function mostrarEstadisticas() {
    let contenedor = document.querySelector("#contenedor-estadisticas");
    if (contenedor == null) { return; }

    // Texto del buscador por título (en minúsculas para comparar)
    let filtro = "";
    let filtroEl = document.querySelector("#txt-buscar-estadistica");
    if (filtroEl != null) {
        filtro = filtroEl.value.toLowerCase();
    }

    let lista = miSistema.estadisticasPorOferta();

    let html = `<table>
                    <tr>
                        <th>Título</th>
                        <th>Pendientes</th>
                        <th>Aceptadas</th>
                        <th>Rechazadas</th>
                        <th>Total postulaciones</th>
                    </tr>`;

    for (let i = 0; i < lista.length; i++) {
        let e = lista[i];
        // Solo mostramos las que coinciden con la búsqueda por título
        if (filtro == "" || e.titulo.toLowerCase().indexOf(filtro) != -1) {
            html += `<tr>
                        <td>${e.titulo}</td>
                        <td>${e.pendientes}</td>
                        <td>${e.aceptadas}</td>
                        <td>${e.rechazadas}</td>
                        <td>${e.total}</td>
                     </tr>`;
        }
    }
    html += `</table>`;

    // Totales por estado
    let estados = miSistema.contarOfertasPorEstado();
    html += "<h4>Ofertas por estado</h4>";
    html += "<p>Activas: " + estados.activas + " | Inactivas: " + estados.inactivas + " | Cerradas: " + estados.cerradas + "</p>";

    // Porcentaje de vacantes cubiertas
    let porcentaje = miSistema.porcentajeVacantesCubiertas();
    html += "<p>Porcentaje de vacantes cubiertas: " + porcentaje + "%</p>";

    // Postulante con más postulaciones activas
    let top = miSistema.postulanteConMasPostulacionesActivas();
    if (top != null) {
        html += "<p>Postulante con más postulaciones activas: " + top.nombreCompleto + "</p>";
    } else {
        html += "<p>No hay postulantes cargados.</p>";
    }

    contenedor.innerHTML = html;
}
