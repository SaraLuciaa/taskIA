import { ITaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(data: {
    id: string;
    userId: string;
    name?: string;
    description?: string;
    estimated_duration?: number;
    due_date?: string;
    priority?: 'baja' | 'media' | 'alta';
    status?: 'pendiente' | 'en_progreso' | 'finalizada' | 'cancelada';
    cancellation_reason?: string;
  }): Promise<Task> {
    const existing = await this.taskRepo.findById(data.id, data.userId);
    if (!existing) throw new Error('Tarea no encontrada');

    if (data.status && data.status !== existing.status) {
      existing.cambiarEstado(data.status, data.cancellation_reason);
    }
    if (data.name !== undefined) existing.name = data.name;
    if (data.description !== undefined) existing.description = data.description;
    if (data.estimated_duration !== undefined) existing.estimatedDuration = data.estimated_duration;
    if (data.due_date !== undefined) existing.dueDate = data.due_date ? new Date(data.due_date) : null;
    if (data.priority !== undefined) existing.priority = data.priority;

    return this.taskRepo.update(existing);
  }
} 