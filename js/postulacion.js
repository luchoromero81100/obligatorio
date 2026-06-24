// molde simple de una postulación: vincula un postulante con una oferta.
// el estado puede ser "pendiente", "aceptada" o "rechazada".
class Postulacion {
    constructor(id, oferta, postulante, estado) {
        this.id = id;
        this.oferta = oferta;
        this.postulante = postulante;
        this.estado = estado;
    }
}
