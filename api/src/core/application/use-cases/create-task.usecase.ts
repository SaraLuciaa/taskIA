import { ITaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(data: {
    userId: string;
    nombre: string;
    descripcion?: string;
    tiempo_estimado: number;
    fecha_finalizacion?: string;
    prioridad?: 'baja' | 'media' | 'alta' | 'alta';
  }): Promise<Task> {
    const task = new Task(
      crypto.randomUUID(),
      data.userId,
      data.nombre,
      data.descripcion ?? '',
      new Date(),
      data.tiempo_estimado, // minutos
      data.fecha_finalizacion ? new Date(data.fecha_finalizacion) : null,
      data.prioridad ?? 'media',
      'pendiente',
      null, // motivoCancelacion
      null  // fechaCancelacion
    );
    return this.taskRepo.create(task);
  }
} 