export class Task {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public description: string,
    public createdAt: Date,
    public estimatedDuration: number, // minutos
    public dueDate: Date | null,
    public actualCompletionDate: Date | null,
    public priority: 'alta' | 'media' | 'baja',
    public status: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada',
    public cancellationReason: string | null,
    public cancelledAt: Date | null,
    public originalStatus: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada' | null,
  ) {
    if (this.dueDate && this.dueDate < new Date()) {
      throw new Error('La fecha de finalización estimada no puede ser menor a la fecha actual');
    }
  }

  finalizar() {
    this.status = 'finalizada';
    this.actualCompletionDate = new Date();
    this.cancellationReason = null;
    this.cancelledAt = null;
  }

  cancelar(motivo: string) {
    this.status = 'cancelada';
    this.cancellationReason = motivo;
    this.cancelledAt = new Date();
  }

  public cambiarEstado(nuevoEstado: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada', motivoCancelacion?: string) {
    if (this.status === 'pendiente') {
      if (nuevoEstado !== 'en_progreso') {
        throw new Error('Solo puedes cambiar de pendiente a en_progreso');
      }
      this.status = 'en_progreso';
      return;
    }
    if (this.status === 'en_progreso') {
      if (nuevoEstado === 'pendiente') {
        this.status = 'pendiente';
        return;
      }
      if (nuevoEstado === 'finalizada') {
        this.finalizar();
        return;
      }
      if (nuevoEstado === 'cancelada') {
        if (!motivoCancelacion) {
          throw new Error('Debes proporcionar un motivo de cancelación');
        }
        this.cancelar(motivoCancelacion);
        return;
      }
      throw new Error('Solo puedes cambiar de en_progreso a pendiente, finalizada o cancelada');
    }
    if (this.status === 'cancelada') {
      if (nuevoEstado === 'pendiente') {
        this.status = 'pendiente';
        return;
      }
      throw new Error('No puedes cambiar el estado de una tarea cancelada excepto a pendiente');
    }
    if (this.status === 'finalizada') {
      throw new Error('No puedes cambiar el estado de una tarea finalizada');
    }
  }
} 