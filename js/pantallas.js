//  acá creo el html, llamando a las fucniones de sistema para recibir las tablas y crearlas segun lo que retronen

// creo las variables para luego asignarle nuevos valores segun el login
let usuarioLogueado = null;
let rolLogueado = "";

// 
window.addEventListener("load", function () { //window es un objeto que representa la pagina, y espera a "load"
    // Botón de LOG IN
    let btnIngresar = document.querySelector("#btn-login-ingresar");
    btnIngresar.addEventListener("click", procesarLogin);

    // Botón de CREAR OFERTA (ADMIN)
    let btnCrearOferta = document.querySelector("#btn-admin-crear-oferta");
    btnCrearOferta.addEventListener("click", procesarAltaOferta);

    // Botón de REGISTRO DE POSTULANTE
    let btnRegistro = document.querySelector("#btn-registrar-usuario");
    btnRegistro.addEventListener("click", procesarRegistro);
});

//LOGEO:
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

    // y despues intento como admin
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

// REGISTRO COMO POSTULANTE
function procesarRegistro() {
    let u = document.querySelector("#reg-usuario").value; //nombre de usuario
    let p = document.querySelector("#reg-password").value; // contraseña
    let n = document.querySelector("#reg-nombre").value; // nombre completo
    let niv = document.querySelector("#reg-nivel").value; //nivel
    let area = document.querySelector("#reg-area").value; //area de interes

    let resultado = miSistema.registrarPostulante(u, p, n, niv, area); //llamo a la funcion del sistema

    let labelResultado = document.querySelector("#lbl-registro-resultado"); // le muestro si fue exitoso o no
    labelResultado.innerText = resultado;

    // Si fue exitoso, volvemos al login, idealmente tenemos que poner un timer
    if (resultado == "Registro exitoso") {
        mostrarSeccion("seccion-login");
    }
}

// Navecion entre secciones
function mostrarSeccion(idSeccionAMostrar) {
    // Si vamos al login, limpiamos la sesión y los inputs
    if (idSeccionAMostrar == "seccion-login") {
        usuarioLogueado = null; //volvemos a arrancar de 0
        rolLogueado = "";

        let inputUser = document.querySelector("#txt-login-usuario");
        let inputPass = document.querySelector("#txt-login-password");
        let lblError = document.querySelector("#lbl-login-error");

        inputUser.value = "";
        inputPass.value = "";
        lblError.innerText = ""; //vaciamos todos los inputs
    }

    let secciones = ["seccion-login", "seccion-postulante", "seccion-admin", "seccion-registro", "seccion-destacadas", "seccion-mis-postulaciones", "seccion-admin-ofertas", "seccion-admin-estadisticas"];
    // creo un array de secciones

    // le sacamos la clase "activa" a todas y se la pongo solo a la que quiero mostrar.
    for (let i = 0; i < secciones.length; i++) {
        let elemento = document.querySelector("#" + secciones[i]);
        elemento.classList.remove("activa");
    }
    document.querySelector("#" + idSeccionAMostrar).classList.add("activa"); // las clases activas tienen display block
    //por defecto si no, son display none
}

// VISUALIZAR OFERTAS COMO POSTULANTE
function mostrarOfertasPostulante() {
    let contenedor = document.querySelector("#contenedor-ofertas-postulante");

    let chkFiltro = document.querySelector("#chk-ver-todas"); 
    let soloArea = chkFiltro.checked; // se revisa el estado del checkbox

    let listaOfertas = miSistema.obtenerOfertasParaPostulante(usuarioLogueado, soloArea); // llamo a la funcion para crear las 
    //ofertas segun postulante y el estado del checkbox

    // buscador por puesto o empresa
    let inputBusqueda = document.querySelector("#txt-buscar-oferta");
    let textoBusqueda = inputBusqueda.value.toLowerCase();

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

//DAR DE ALTA DE OFERTAS NUEVAS (ADMINISTRADOR)
function procesarAltaOferta() {
    let titulo = document.querySelector("#txt-admin-titulo").value.trim();
    let empresa = document.querySelector("#txt-admin-empresa").value.trim();
    let descripcion = document.querySelector("#txt-admin-descripcion").value.trim();
    let nivel = document.querySelector("#sel-admin-nivel").value;
    let area = document.querySelector("#sel-admin-area").value;
    let limite = Number(document.querySelector("#num-admin-limite").value);
    let vacantes = Number(document.querySelector("#num-admin-vacantes").value);
    let destacada = document.querySelector("#chk-admin-destacada").checked;
    let lbl = document.querySelector("#lbl-admin-oferta-resultado");

    if (isNaN(limite)) { limite = 0; } 
    if (isNaN(vacantes)) { vacantes = 0; } // si es true lo forzamos y despues lo validamos

    // llamamos a ssitema hace todas las validaciones y retorne el mensaje 
    let respuesta = miSistema.agregarOferta(titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada);

    lbl.innerText = respuesta;
    if (respuesta.includes("correctamente")) {
        lbl.style.color = "green";
        document.querySelector("#txt-admin-titulo").value = "";
        document.querySelector("#txt-admin-empresa").value = "";
        document.querySelector("#txt-admin-descripcion").value = "";
        document.querySelector("#num-admin-limite").value = "";
        document.querySelector("#num-admin-vacantes").value = "";
        document.querySelector("#chk-admin-destacada").checked = false;
    } else {
        lbl.style.color = "red";
    }
}

// PROCESAR LA POSTULACIÓN (POSTULANTE) 
function procesarPostulacion(idOferta) {
    // Detectamos en que pantalla estamos para mostrar el mensaje en el label correcto
    let seccionDestacadas = document.querySelector("#seccion-destacadas");
    let lblMensaje = null;

    if (seccionDestacadas.classList.contains("activa")) {
        lblMensaje = document.querySelector("#lbl-mensaje-postulacion-destacada");
    } else {
        lblMensaje = document.querySelector("#lbl-mensaje-postulacion");
    }

    let ofertaEncontrada = miSistema.buscarOfertaPorId(idOferta);
    let mensajeResultado = miSistema.crearPostulacion(usuarioLogueado, ofertaEncontrada);

    if (mensajeResultado == "Postulación realizada correctamente") {
        // Refrescamos la tabla (pero me rompe el label luego entonces lo buscamos de nuevo y escribimos)
        if (seccionDestacadas.classList.contains("activa")) {
            mostrarOfertasDestacadas(); 
            let lbl = document.querySelector("#lbl-mensaje-postulacion-destacada");
            lbl.innerText = "Postulación exitosa!"; lbl.style.color = "green";
        } else {
            mostrarOfertasPostulante();
            let lbl = document.querySelector("#lbl-mensaje-postulacion");
            lbl.innerText = "Postulación exitosa!"; lbl.style.color = "green";
        }
    } else {
        lblMensaje.innerText = mensajeResultado;
        lblMensaje.style.color = "red";
    }
}

// HISTORIAL DE POSTULACIONES (POSTULANTE)
function mostrarMisPostulaciones() {
    let contenedor = document.querySelector("#contenedor-mis-postulaciones");

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

        // Color segun el estado para mejorar la lectura
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

// CATÁLOGO DE DESTACADAS (POSTULANTE)
function mostrarOfertasDestacadas() {
    let contenedor = document.querySelector("#contenedor-ofertas-destacadas");

    // Obtenemos todas las destacadas
    let listaCompleta = miSistema.obtenerOfertasDestacadas();

    // 2. Filtramos: solo dejamos las que el usuario NO se haya postulado aún
    let listaFiltrada = [];
    for (let i = 0; i < listaCompleta.length; i++) {
        if (miSistema.yaSePostulo(usuarioLogueado, listaCompleta[i]) == false) {
            listaFiltrada.push(listaCompleta[i]);
        }
    }

    if (listaFiltrada.length == 0) {
        contenedor.innerHTML = "<p>No hay más ofertas destacadas disponibles para ti.</p>";
        return;
    }

    let tablaHTML = `<div class="table-responsive"><table>
        <thead><tr><th>ID</th><th>Título</th><th>Empresa</th><th>Nivel</th><th>Área</th><th>Acción</th></tr></thead>
        <tbody>`;

    for (let o of listaFiltrada) {
        tablaHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.titulo}</td>
                <td>${o.empresa}</td>
                <td>${o.nivelRequerido}</td>
                <td>${o.area}</td>
                <td><button onclick="procesarPostulacion('${o.id}')">Postularme</button></td>
            </tr>`;
    }
    tablaHTML += `</tbody></table><p id="lbl-mensaje-postulacion-destacada"></p></div>`;
    contenedor.innerHTML = tablaHTML;
}
// POSTULACIONES PENDIENTES (ADMIN) 
function mostrarPostulacionesAdmin() {
    let contenedor = document.querySelector("#lista-pendientes");

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

// Acepta una postulación 
function procesarAceptacion(idPostulacion) {
    let resultado = miSistema.aceptarPostulacion(idPostulacion);
    alert(resultado);
    mostrarPostulacionesAdmin();
};

// Rechazo manual de una postulación
function procesarRechazo(idPostulacion) {
    let resultado = miSistema.modificarEstadoPostulacion(idPostulacion, "Rechazada");
    alert(resultado);
    mostrarPostulacionesAdmin();
};

//  LISTADO COMPLETO DE OFERTAS (ADMIN) 
function mostrarListadoOfertasAdmin() {
    let contenedor = document.querySelector("#contenedor-listado-ofertas");

    // Limpiamos el formulario de edición si estaba abierto
    let contEditar = document.querySelector("#contenedor-editar-oferta");
    contEditar.innerHTML = "";

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
function procesarCerrarOferta(idOferta) {
    let resultado = miSistema.cerrarOferta(idOferta);
    alert(resultado);
    mostrarListadoOfertasAdmin();
};

// Armamos las option del select marcando la opción seleccionada y evitamos repetir cod
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

// Muestra un formulario medio basico para editar la oferta elegida
function mostrarFormularioEditar(idOferta) {
    let o = miSistema.buscarOfertaPorId(idOferta);

    let cont = document.querySelector("#contenedor-editar-oferta");

    let niveles = ["Junior", "Semi-Senior", "Senior"];
    let areas = ["Tecnología", "Diseño", "Marketing", "Administración", "Otros"];

    let destacadaChecked = "";
    if (o.destacada == true) {
        destacadaChecked = "checked";
    }

    let html = `
        <div class='contenedor-formulario'>
            <h4>Editar oferta ${o.id}</h4>
            <div class='campo'><label>Título:</label><input type='text' id='edit-titulo' value='${o.titulo}'></div>
            <div class='campo'><label>Empresa:</label><input type='text' id='edit-empresa' value='${o.empresa}'></div>
            <div class='campo'><label>Descripción:</label><input type='text' id='edit-descripcion' value='${o.descripcion}'></div>
            <div class='campo'><label>Nivel:</label><select id='edit-nivel'>${armarOpciones(niveles, o.nivelRequerido)}</select></div>
            <div class='campo'><label>Área:</label><select id='edit-area'>${armarOpciones(areas, o.area)}</select></div>
            <div class='campo'><label>Límite:</label><input type='number' id='edit-limite' value='${o.limitePostulaciones}'></div>
            <div class='campo'><label>Vacantes:</label><input type='number' id='edit-vacantes' value='${o.cantidadVacantes}'></div>
            <label><input type='checkbox' id='edit-destacada' ${destacadaChecked}> Destacada</label>
            <button class='btn-success' onclick="guardarEdicionOferta('${o.id}')">Guardar</button>
            <p id='lbl-edit-resultado' class='resultado-msg'></p>
        </div>`;

    cont.innerHTML = html;
};

// guardar los cambios del formulario de edición
function guardarEdicionOferta(idOferta) {
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
    lbl.innerText = resultado;

    // actualizamos el listado (si se guardó bien, el formulario se cierra)
    if (resultado.includes("correctamente")) {
        mostrarListadoOfertasAdmin();
        // recargamos  postulaciones y destacadas para reflejar los datos editados en tiempo real
        mostrarPostulacionesAdmin();
        mostrarOfertasDestacadas();
    }
};

//  ESTADÍSTICAS (ADMIN)
function mostrarEstadisticas() {
    let contenedor = document.querySelector("#contenedor-estadisticas");

    // texto del buscador por título (en minúsculas para comparar)
    let filtro = document.querySelector("#txt-buscar-estadistica").value.toLowerCase();

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
        html += "<p>No hay postulantes con postulaciones activas.</p>";
    }

    contenedor.innerHTML = html;
}
