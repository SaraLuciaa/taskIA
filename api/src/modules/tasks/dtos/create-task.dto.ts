export class CreateTaskDto {
  name: string;
  description?: string;
  estimated_duration: number; // minutos
  due_date?: string; // fecha estimada de finalización
  priority?: 'alta' | 'media' | 'baja';
} 