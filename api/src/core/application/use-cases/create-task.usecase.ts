import { ITaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(data: {
    userId: string;
    name: string;
    description?: string;
    estimated_duration: number;
    due_date?: string;
    priority?: 'baja' | 'media' | 'alta';
  }): Promise<Task> {
    const task = new Task(
      crypto.randomUUID(),
      data.userId,
      data.name,
      data.description ?? '',
      new Date(),
      data.estimated_duration,
      data.due_date ? new Date(data.due_date) : null,
      null, // actualCompletionDate
      data.priority ?? 'media',
      'pendiente',
      null, // cancellationReason
      null, // cancelledAt
      null  // originalStatus
    );
    return this.taskRepo.create(task);
  }
} 