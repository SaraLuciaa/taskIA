export class CreateTaskDto {
  nombre: string;
  descripcion?: string;
  tiempo_estimado: number;
  fecha_finalizacion?: string; 
  prioridad?: 'alta' | 'media' | 'baja';
} 