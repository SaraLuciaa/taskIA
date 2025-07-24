export class UpdateTaskDto {
  name?: string;
  description?: string;
  estimated_duration?: number;
  due_date?: string;
  priority?: 'alta' | 'media' | 'baja';
  status?: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada';
  cancellation_reason?: string;
  cancelled_at?: string;
  original_status?: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada';
} 