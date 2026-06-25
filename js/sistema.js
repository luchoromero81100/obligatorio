// clase sistema para prevenir modificaciones externas
class Sistema {
    // arrays privados
    #postulantes = [];
    #admins = [];
    #ofertas = [];
    #postulaciones = [];

    // contadores para armar los ids autoincrementales
    #contadorOferta = 0;        // genera job_offer_1, job_offer_2... esto es para las ofertas creadas por los admins
    #contadorPostulacion = 0;   // genera job_1, job_2... esto es para las postulaciones de los aplicantes
    #contadorAdmin = 0;         // para el id del admin
    
    // pushea postulantes ya normalizados en otra funcion
    agregarPostulante(postulante) {
        this.#postulantes.push(postulante);
    }

    // crea un admin con id autoincremental y lo guarda
    agregarAdmin(nombre, usuario, password) {
        this.#contadorAdmin = this.#contadorAdmin + 1;
        let admin = new Admin(this.#contadorAdmin, nombre, usuario, password);
        this.#admins.push(admin);
    }

    // busca un postulante por su usuario; devuelve el objeto o null. Para loguearse
    buscarPostulantePorUsuario(usuario) {
        for (let i = 0; i < this.#postulantes.length; i++) {
            // insensitive
            if (this.#postulantes[i].usuario.toLowerCase() == usuario.toLowerCase()) {
                return this.#postulantes[i];
            }
        }
        return null;
    }

    // busca un admin por su usuario; devuelve el objeto o null
    buscarAdminPorUsuario(usuario) {
        for (let i = 0; i < this.#admins.length; i++) {
            // insensitive tambien
            if (this.#admins[i].usuario.toLowerCase() == usuario.toLowerCase()) {
                return this.#admins[i];
            }
        }
        return null;
    }

    // busca una oferta por su id; devuelve el objeto o null, esto se va a usar en funciones futuras para cerrar ofertas y editar ofertas
    buscarOfertaPorId(id) {        for (let i = 0; i < this.#ofertas.length; i++) {
            if (this.#ofertas[i].id == id) {
                return this.#ofertas[i];
            }
        }
        return null;
    }

    // el spread devuelve una copia del array de ofertas (no el original, para protegerlo) y que no se pueda modificar desde afuera, si no, es como si le bloqueara el acceso con la propiedad privada pero le entrego el array
    obtenerTodasLasOfertas() {
        return [...this.#ofertas];
    }

    // devuelve true si ya existe un postulante con ese usuario
    existeUsuario(usuario) {
        return this.buscarPostulantePorUsuario(usuario) != null;
    }

    // valida la contraseña: mínimo 5 caracteres, con mayúscula, minúscula y numero
    validarPassword(password) {
        if (password.length < 5) {
            return false;
        }
        let tieneMayus = false;
        let tieneMinus = false;
        let tieneNumero = false;
        for (let i = 0; i < password.length; i++) {
            // se usa el codigo ASCII del carácter para clasificarlo
            let codigo = password.charCodeAt(i);
            if (codigo >= 65 && codigo <= 90) { tieneMayus = true; }
            if (codigo >= 97 && codigo <= 122) { tieneMinus = true; }
            if (codigo >= 48 && codigo <= 57) { tieneNumero = true; }
        }
        return tieneMayus && tieneMinus && tieneNumero;
    }

    // registra un postulante validando paso a paso; devuelve un mensaje de resultado
    registrarPostulante(usuario, password, nombreCompleto, nivel, area) {
        // ningún campo puede estar vacío
        if (usuario.trim() == "" || password.trim() == "" || nombreCompleto.trim() == "") {
            return "Debe completar todos los campos";
        }
        // el usuario debe tener al menos 5 caracteres
        if (usuario.length < 5) {
            return "El nombre de usuario debe tener al menos 5 caracteres";
        }
        // el usuario no puede estar repetido (funcion de arriba)
        if (this.existeUsuario(usuario)) {
            return "El nombre de usuario ya existe";
        }
        // la contraseña debe tener al menos 5 caracteres
        if (password.length < 5) {
            return "La contraseña debe tener al menos 5 caracteres";
        }
        // la contraseña debe contener mayúscula, minúscula y número
        if (!this.validarPassword(password)) {
            return "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
        }
        let nuevo = new Postulante(usuario, password, nombreCompleto, nivel, area);
        this.agregarPostulante(nuevo);
        return "Registro exitoso";
    }

    // login de postulante: devuelve el objeto si usuario y contraseña coinciden, si no null
    loginPostulante(usuario, password) {
        let postulante = this.buscarPostulantePorUsuario(usuario);
        if (postulante != null && postulante.password == password) {
            return postulante;
        }
        return null;
    }

    // login de admin: recorre los admins y devuelve el que coincide, si no null
    loginAdmin(usuario, password) {
        for (let i = 0; i < this.#admins.length; i++) {
            if (this.#admins[i].usuario.toLowerCase() == usuario.toLowerCase() && this.#admins[i].password == password) {
                return this.#admins[i];
            }
        }
        return null;
    }

    // crea una oferta validando los datos; devuelve un mensaje de resultado
    agregarOferta(titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada) {
        if (titulo.trim() == "" || empresa.trim() == "" || descripcion.trim() == "") {
            return "Debe completar todos los campos";
        }
        // las vacantes deben ser mayores que cero
        if (vacantes <= 0) {
            return "La cantidad de vacantes debe ser mayor a 0";
        }
        // el límite debe ser mayor que cero
        if (limite <= 0) {
            return "El límite de postulaciones debe ser mayor a 0";
        }
        // no se puede contratar a más gente de la que se puede anotar
        if (limite < vacantes) {
            return "El límite de postulaciones debe ser mayor o igual a la cantidad de vacantes";
        }
        this.#contadorOferta = this.#contadorOferta + 1;
        let id = "JOB_OFFER_" + this.#contadorOferta;
        let oferta = new OfertaLaboral(id, titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada);
        this.#ofertas.push(oferta);
        return "Oferta creada correctamente";
    }

    // cierre lógico: cambia el estado a cerrada pero no borra la oferta del array
    cerrarOferta(idOferta) {
        let oferta = this.buscarOfertaPorId(idOferta);
        if (oferta == null) {
            return "No se encontró la oferta";
        }
        // solo se cierran ofertas que no estaban cerradas previamente
        if (oferta.estado == "Cerrada") {
            return "La oferta ya se encontraba cerrada";
        }
        oferta.estado = "Cerrada";
        return "Oferta cerrada correctamente";
    }

    // actualiza las propiedades de una oferta existente, revalidando los datos
    editarOferta(idOferta, titulo, empresa, descripcion, nivel, area, limite, vacantes, destacada) {
        let oferta = this.buscarOfertaPorId(idOferta);
        if (oferta == null) {
            return "No se encontró la oferta";
        }
        if (titulo.trim() == "" || empresa.trim() == "" || descripcion.trim() == "") {
            return "Debe completar todos los campos";
        }
        if (vacantes <= 0) {
            return "La cantidad de vacantes debe ser mayor a 0";
        }
        if (limite <= 0) {
            return "El límite de postulaciones debe ser mayor a 0";
        }
        if (limite < vacantes) {
            return "El límite de postulaciones debe ser mayor o igual a la cantidad de vacantes";
        }
        oferta.titulo = titulo;
        oferta.empresa = empresa;
        oferta.descripcion = descripcion;
        oferta.nivelRequerido = nivel;
        oferta.area = area;
        oferta.limitePostulaciones = limite;
        oferta.cantidadVacantes = vacantes;
        oferta.destacada = destacada;
        return "Oferta actualizada correctamente";
    }

    // regla de compatibilidad de nivel entre postulante y oferta.
    // supuesto: el postulante solo puede a ofertas de su mismo nivel,
    // salvo el senior que puede a cualquier nivel.
    esCompatibleNivel(nivelPostulante, nivelOferta) {
        if (nivelPostulante == "Senior") {
            return true;
        }
        return nivelPostulante == nivelOferta;
    }

    // devuelve true si el postulante ya tiene una postulación a esa oferta
    yaSePostulo(postulante, oferta) {
        for (let i = 0; i < this.#postulaciones.length; i++) {
            let pos = this.#postulaciones[i];
            if (pos.postulante == postulante && pos.oferta == oferta) {
                return true;
            }
        }
        return false;
    }

    // arma la lista de ofertas a las que el postulante se puede postular.
    // una oferta entra si: está activa, es compatible de nivel y todavía no se postuló.
    // si soloAreaInteres es true, además debe coincidir el área de interés.
    obtenerOfertasParaPostulante(postulante, soloAreaInteres) {
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
    }

    // crea una postulación pendiente para el postulante en la oferta dada
    crearPostulacion(postulante, oferta) {
        // no se permite postularse dos veces a la misma oferta
        if (this.yaSePostulo(postulante, oferta)) {
            return "Ya te postulaste a esta oferta";
        }
        // solo se puede postular a ofertas activas
        if (oferta.estado != "Activa") {
            return "No es posible postularse: la oferta no está disponible actualmente.";
        }
        // se arma el id con el formato job_n
        this.#contadorPostulacion = this.#contadorPostulacion + 1;
        let id = "JOB_" + this.#contadorPostulacion;
        let nuevaPostulacion = new Postulacion(id, oferta, postulante, "Pendiente");
        this.#postulaciones.push(nuevaPostulacion);
        // si se alcanzó el límite de anotados, la oferta se inactiva
        let totalAnotados = this.contarTotalPostulacionesDeOferta(oferta);
        if (totalAnotados >= oferta.limitePostulaciones) {
            oferta.estado = "Inactiva";
        }
        return "Postulación realizada correctamente";
    }

    // devuelve todas las postulaciones de un postulante
    obtenerPostulacionesDePostulante(postulante) {
        let resultado = [];
        for (let i = 0; i < this.#postulaciones.length; i++) {
            let p = this.#postulaciones[i];
            if (p.postulante == postulante) {
                resultado.push(p);
            }
        }
        return resultado;
    }

    // devuelve las ofertas destacadas que además están activas
    obtenerOfertasDestacadas() {
        let resultado = [];
        for (let i = 0; i < this.#ofertas.length; i++) {
            let o = this.#ofertas[i];
            if (o.destacada == true && o.estado == "Activa") {
                resultado.push(o);
            }
        }
        return resultado;
    }

    // devuelve una copia de todas las postulaciones
    obtenerTodasLasPostulaciones() {
        return [...this.#postulaciones];
    }

    // cambia el estado de una postulación a mano (rechazo manual del admin)
    modificarEstadoPostulacion(idPostulacion, nuevoEstado) {
        for (let i = 0; i < this.#postulaciones.length; i++) {
            let p = this.#postulaciones[i];
            if (p.id == idPostulacion) {
                p.estado = nuevoEstado;
                return "Estado de postulación actualizado a " + nuevoEstado;
            }
        }
        return "No se encontró la postulación";
    }

    // devuelve solo las postulaciones que siguen pendientes
    obtenerPostulacionesPendientes() {
        let pendientes = [];
        for (let i = 0; i < this.#postulaciones.length; i++) {
            if (this.#postulaciones[i].estado == "Pendiente") {
                pendientes.push(this.#postulaciones[i]);
            }
        }
        return pendientes;
    }

    // cuenta cuántas postulaciones de una oferta están en un estado dado
    contarPostulacionesDeOferta(oferta, estado) {
        let contador = 0;
        for (let i = 0; i < this.#postulaciones.length; i++) {
            let p = this.#postulaciones[i];
            if (p.oferta == oferta && p.estado == estado) {
                contador++;
            }
        }
        return contador;
    }

    // cuenta todas las postulaciones de una oferta sin importar el estado.
    // sirve para controlar el tope de anotados (límite de postulaciones).
    contarTotalPostulacionesDeOferta(oferta) {
        let contador = 0;
        for (let i = 0; i < this.#postulaciones.length; i++) {
            if (this.#postulaciones[i].oferta == oferta) {
                contador++;
            }
        }
        return contador;
    }

    // acepta una postulación y aplica los efectos en cascada sobre la oferta.
    // devuelve un mensaje explicando qué pasó.
    aceptarPostulacion(idPostulacion) {
        // se busca la postulación por id
        let postulacion = null;
        for (let i = 0; i < this.#postulaciones.length; i++) {
            if (this.#postulaciones[i].id == idPostulacion) {
                postulacion = this.#postulaciones[i];
            }
        }

        if (postulacion == null) {
            return "No se encontró la postulación especificada.";
        }
        if (postulacion.estado != "Pendiente") {
            return "La postulación ya ha sido procesada.";
        }

        // se marca como aceptada
        postulacion.estado = "Aceptada";
        let oferta = postulacion.oferta;

        let aceptadas = this.contarPostulacionesDeOferta(oferta, "Aceptada");
        let rechazadasAutomaticas = 0;
        let motivo = "";

        // si se cubrieron todas las vacantes: se rechazan las pendientes y la oferta se inactiva
        if (aceptadas >= oferta.cantidadVacantes) {
            for (let i = 0; i < this.#postulaciones.length; i++) {
                let p = this.#postulaciones[i];
                if (p.oferta == oferta && p.estado == "Pendiente") {
                    p.estado = "Rechazada";
                    rechazadasAutomaticas++;
                }
            }
            oferta.estado = "Inactiva";
            motivo = "vacantes cubiertas";
        } else {
            // si no, se controla si se alcanzó el límite de anotados
            let total = this.contarTotalPostulacionesDeOferta(oferta);
            if (total >= oferta.limitePostulaciones) {
                oferta.estado = "Inactiva";
                motivo = "límite de postulaciones alcanzado";
            }
        }

        // mensaje final con el resultado del procesamiento
        let mensaje = "Postulación aprobada. ";
        if (oferta.estado == "Inactiva") {
            mensaje = mensaje + "La oferta pasó a Inactiva (" + motivo + "). ";
        } else {
            mensaje = mensaje + "La oferta sigue activa. ";
        }
        mensaje = mensaje + "Pendientes rechazadas automáticamente: " + rechazadasAutomaticas + ".";
        return mensaje;
    }

    // arma una lista con el conteo de postulaciones por estado de cada oferta
    estadisticasPorOferta() {
        let listaEstadisticas = [];
        for (let i = 0; i < this.#ofertas.length; i++) {
            let o = this.#ofertas[i];
            let pend = this.contarPostulacionesDeOferta(o, "Pendiente");
            let acep = this.contarPostulacionesDeOferta(o, "Aceptada");
            let rech = this.contarPostulacionesDeOferta(o, "Rechazada");
            let tot = pend + acep + rech;
            let infoOferta = {
                titulo: o.titulo,
                empresa: o.empresa,
                pendientes: pend,
                aceptadas: acep,
                rechazadas: rech,
                total: tot
            };
            listaEstadisticas.push(infoOferta);
        }
        return listaEstadisticas;
    }

    // cuenta cuántas ofertas hay en cada estado y devuelve un objeto con los totales
    contarOfertasPorEstado() {
        let activas = 0;
        let inactivas = 0;
        let cerradas = 0;
        for (let i = 0; i < this.#ofertas.length; i++) {
            let estado = this.#ofertas[i].estado;
            if (estado == "Activa") {
                activas++;
            } else if (estado == "Inactiva") {
                inactivas++;
            } else if (estado == "Cerrada") {
                cerradas++;
            }
        }
        return {
            activas: activas,
            inactivas: inactivas,
            cerradas: cerradas
        };
    }

    // calcula el porcentaje de vacantes ya cubiertas sobre el total ofrecido
    porcentajeVacantesCubiertas() {
        let totalVacantes = 0;
        let vacantesCubiertas = 0;
        for (let i = 0; i < this.#ofertas.length; i++) {
            let o = this.#ofertas[i];
            totalVacantes = totalVacantes + o.cantidadVacantes;
            // las vacantes cubiertas son las postulaciones aceptadas de cada oferta
            vacantesCubiertas = vacantesCubiertas + this.contarPostulacionesDeOferta(o, "Aceptada");
        }
        // se evita dividir por cero cuando no hay vacantes
        if (totalVacantes == 0) {
            return 0;
        }
        return (vacantesCubiertas / totalVacantes) * 100;
    }

    // busca el postulante con más postulaciones activas usando el patrón de máximo.
    // supuesto: activas = pendientes + aceptadas (no cuenta las rechazadas).
    postulanteConMasPostulacionesActivas() {
        if (this.#postulantes.length == 0) {
            return null;
        }

        let maxPostulante = null;
        let maxActivas = -1; // arranca en -1 para que cualquiera con 0 o más lo supere

        for (let i = 0; i < this.#postulantes.length; i++) {
            let post = this.#postulantes[i];
            let susPostulaciones = this.obtenerPostulacionesDePostulante(post);
            let contadorActivas = 0;

            // se cuentan a mano las pendientes y aceptadas
            for (let j = 0; j < susPostulaciones.length; j++) {
                let p = susPostulaciones[j];
                if (p.estado == "Pendiente" || p.estado == "Aceptada") {
                    contadorActivas++;
                }
            }

            // se guarda el que tenga más activas hasta el momento
            if (contadorActivas > maxActivas) {
                maxActivas = contadorActivas;
                maxPostulante = post;
            }
        }

        return maxPostulante;
    }
}
