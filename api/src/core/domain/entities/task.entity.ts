export class Task {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public nombre: string,
    public descripcion: string,
    public fechaCreacion: Date,
    public tiempoEstimado: number,
    public fechaFinalizacion: Date | null,
    public prioridad: 'alta' | 'media' | 'baja',
    public estado: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada',
    public motivoCancelacion: string | null,
    public fechaCancelacion: Date | null,
  ) {}

  finalizar() {
    this.estado = 'finalizada';
    this.fechaFinalizacion = new Date();
  }

  cancelar(motivo: string) {
    this.estado = 'cancelada';
    this.motivoCancelacion = motivo;
    this.fechaCancelacion = new Date();
  }
} 