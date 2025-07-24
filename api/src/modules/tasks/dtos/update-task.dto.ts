export class UpdateTaskDto {
  nombre?: string;
  descripcion?: string;
  tiempo_estimado?: number;
  fecha_finalizacion?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  estado?: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada';
  motivo_cancelacion?: string;
  fecha_cancelacion?: string;
} 