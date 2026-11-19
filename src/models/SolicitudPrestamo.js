class SolicitudPrestamo {
    constructor(data) {
        this.estudianteId = data.estudianteId;
        this.materiaNombre = data.materiaNombre;
        this.equipos = data.equipos; // Array de IDs
        this.fechaRetiro = new Date(data.fechaRetiro);
        this.fechaDevolucion = new Date(data.fechaDevolucion);
        this.esGrupal = data.esGrupal || false;
        this.estado = 'Iniciado';
    }

    calcularAntelacionHoras() {
        const ahora = new Date();
        const diffMs = this.fechaRetiro - ahora;
        return diffMs / (1000 * 60 * 60);
    }
}

module.exports = SolicitudPrestamo;
