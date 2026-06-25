// instancia global del sistema (también la usa pantallas.js)
const miSistema = new Sistema(); //lo hacemos con const porque no se deberia reasignar esto nunca, osea no varia

// llamo la funcion mi "agregarAdmin" con los argumentos  precargados, deben ser 3
miSistema.agregarAdmin("Luciano", "Luciano", "Admin123");
miSistema.agregarAdmin("Gerónimo", "Gerónimo", "Admin123");
miSistema.agregarAdmin("Surén", "Surén", "Admin123");

// deben ser 15 postulantes
// los argunemtnos a pasar son nombre de usuario, pass, nombre completo, nivel y area
miSistema.registrarPostulante("usuario1", "Postulante123", "Ana Pérez", "Junior", "Tecnología");
miSistema.registrarPostulante("usuario2", "Postulante123", "Bruno Díaz", "Senior", "Diseño");
miSistema.registrarPostulante("usuario3", "Postulante123", "Carla Gómez", "Semi-Senior", "Tecnología");
miSistema.registrarPostulante("usuario4", "Postulante123", "Diego Ruiz", "Junior", "Diseño");
miSistema.registrarPostulante("usuario5", "Postulante123", "Elena Soto", "Senior", "Tecnología");
miSistema.registrarPostulante("usuario6", "Postulante123", "Fabián Mora", "Junior", "Marketing");
miSistema.registrarPostulante("usuario7", "Postulante123", "Gabriela Luna", "Semi-Senior", "Marketing");
miSistema.registrarPostulante("usuario8", "Postulante123", "Hugo Castro", "Junior", "Administración");
miSistema.registrarPostulante("usuario9", "Postulante123", "Irene Vega", "Senior", "Tecnología");
miSistema.registrarPostulante("usuario10", "Postulante123", "Julián Rey", "Junior", "Tecnología");
miSistema.registrarPostulante("usuario11", "Postulante123", "Karina Paz", "Semi-Senior", "Tecnología");
miSistema.registrarPostulante("usuario12", "Postulante123", "Lucas Fern", "Junior", "Otros");
miSistema.registrarPostulante("usuario13", "Postulante123", "Marta Ortiz", "Senior", "Marketing");
miSistema.registrarPostulante("usuario14", "Postulante123", "Nicolás Bru", "Junior", "Tecnología");
miSistema.registrarPostulante("usuario15", "Postulante123", "Olivia Sanz", "Semi-Senior", "Diseño");

// ofertas con distintos niveles, areas y tres destacadas con varias vacantes
miSistema.agregarOferta("Desarrollador Front-end Junior", "Tech Solutions", "Buscamos un dev apasionado por HTML, CSS y JS.", "Junior", "Tecnología", 5, 3, true);          // job_offer_1
miSistema.agregarOferta("Diseñador UX/UI Senior", "Creative Agency", "Diseño de interfaces limpias y prototipado rápido.", "Senior", "Diseño", 3, 2, true);                  // job_offer_2
miSistema.agregarOferta("Backend Developer", "Cloud Services", "Desarrollo de APIs robustas y escalables.", "Semi-Senior", "Tecnología", 6, 2, false);                       // job_offer_3
miSistema.agregarOferta("Analista de Marketing Digital", "Growth Marketing", "Gestión de campañas en redes sociales y SEO.", "Junior", "Marketing", 5, 2, false);            // job_offer_4
miSistema.agregarOferta("Diseñador Gráfico Jr", "Print Studio", "Creación de contenido visual para marcas.", "Junior", "Diseño", 4, 1, false);                               // job_offer_5
miSistema.agregarOferta("Asistente Administrativo", "Global Logistics", "Gestión de documentos y soporte a gerencia.", "Junior", "Administración", 5, 2, false);             // job_offer_6
miSistema.agregarOferta("DevOps Engineer", "DevOps Pro", "Automatización de despliegues y gestión de servidores.", "Senior", "Tecnología", 4, 1, true);                      // job_offer_7
miSistema.agregarOferta("Ejecutivo de Ventas", "Retail Corp", "Atención a clientes y cierre de ventas.", "Junior", "Otros", 8, 3, false);                                    // job_offer_8
miSistema.agregarOferta("Content Manager", "Media Buzz", "Redacción de artículos y estrategia de contenidos.", "Semi-Senior", "Marketing", 5, 1, false);                     // job_offer_9
miSistema.agregarOferta("QA Tester Manual", "Quality First", "Pruebas de software y reporte de bugs.", "Junior", "Tecnología", 6, 3, false);                                 // job_offer_10

// helper para crear una postulación usando usuario y la id de oferta.
function precargarPostulacion(usuario, idOferta) {
    let postulante = miSistema.buscarPostulantePorUsuario(usuario);
    let oferta = miSistema.buscarOfertaPorId(idOferta);
    miSistema.crearPostulacion(postulante, oferta);
}

// acá la ejecuto
precargarPostulacion("usuario1", "JOB_OFFER_1");   // job_1
precargarPostulacion("usuario10", "JOB_OFFER_1");  // job_2
precargarPostulacion("usuario14", "JOB_OFFER_1");  // job_3
precargarPostulacion("usuario2", "JOB_OFFER_2");   // job_4
precargarPostulacion("usuario5", "JOB_OFFER_2");   // job_5
precargarPostulacion("usuario3", "JOB_OFFER_3");   // job_6
precargarPostulacion("usuario11", "JOB_OFFER_3");  // job_7
precargarPostulacion("usuario9", "JOB_OFFER_3");   // job_8
precargarPostulacion("usuario6", "JOB_OFFER_4");   // job_9
precargarPostulacion("usuario13", "JOB_OFFER_4");  // job_10
precargarPostulacion("usuario4", "JOB_OFFER_5");   // job_11
precargarPostulacion("usuario2", "JOB_OFFER_5");   // job_12
precargarPostulacion("usuario8", "JOB_OFFER_6");   // job_13
precargarPostulacion("usuario5", "JOB_OFFER_7");   // job_14
precargarPostulacion("usuario9", "JOB_OFFER_7");   // job_15
precargarPostulacion("usuario12", "JOB_OFFER_8");  // job_16
precargarPostulacion("usuario7", "JOB_OFFER_9");   // job_17
precargarPostulacion("usuario13", "JOB_OFFER_9");  // job_18
precargarPostulacion("usuario1", "JOB_OFFER_10");  // job_19
precargarPostulacion("usuario10", "JOB_OFFER_10"); // job_20

// se pre procesan algunas postulaciones para que haya estados variados
miSistema.aceptarPostulacion("JOB_1");   // job_offer_1: aceptada (1 de 3 vacantes), sigue ACTIVA y destacada
miSistema.aceptarPostulacion("JOB_2");   // job_offer_1: otra aceptada (2 de 3), aún quedan vacantes → sigue ACTIVA
miSistema.aceptarPostulacion("JOB_4");   // job_offer_2: aceptada (1 de 2 vacantes), sigue ACTIVA y destacada
miSistema.aceptarPostulacion("JOB_6");   // job_offer_3: una aceptada, sigue activa con pendientes
miSistema.aceptarPostulacion("JOB_14");  // job_offer_7: cubre su única vacante, se inactiva y rechaza la pendiente

// cierre lógico como mostró el profe en clase, queda en el array con estado cerrada
miSistema.cerrarOferta("JOB_OFFER_8");
