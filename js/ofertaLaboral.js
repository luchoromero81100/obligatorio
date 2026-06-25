// clase de una oferta laboral.
class OfertaLaboral {
    constructor(id, titulo, empresa, descripcion, nivelRequerido, area, limitePostulaciones, cantidadVacantes, destacada) {
        this.id = id;
        this.titulo = titulo;
        this.empresa = empresa;
        this.descripcion = descripcion;
        this.nivelRequerido = nivelRequerido;
        this.area = area;
        this.limitePostulaciones = limitePostulaciones; // cuántos pueden potularce
        this.cantidadVacantes = cantidadVacantes;       // cuántos se contratan 
        this.destacada = destacada;
        // el estado arranca siempre en activa
        this.estado = "Activa";
    }
}
