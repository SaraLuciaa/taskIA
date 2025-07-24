import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../supabase.service';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ITaskRepository } from '../../../core/domain/repositories/task.repository';
import { Task } from '../../../core/domain/entities/task.entity';
import { UpdateTaskUseCase } from '../../../core/application/use-cases/update-task.usecase';

@Injectable()
export class TasksService implements ITaskRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(task: Task): Promise<Task> {
    // Validación de enums
    const validPriorities = ['alta', 'media', 'baja'];
    const validStatuses = ['pendiente', 'en_progreso', 'finalizada', 'cancelada'];
    if (!validPriorities.includes(task.priority)) {
      throw new Error(`Valor de prioridad inválido: ${task.priority}. Debe ser uno de: ${validPriorities.join(', ')}`);
    }
    if (!validStatuses.includes(task.status)) {
      throw new Error(`Valor de estado inválido: ${task.status}. Debe ser uno de: ${validStatuses.join(', ')}`);
    }
    // Log del objeto a insertar
    const insertObj = {
      id: task.id,
      user_id: task.userId,
      name: task.name,
      description: task.description,
      created_at: task.createdAt.toISOString(),
      estimated_duration: task.estimatedDuration,
      due_date: task.dueDate ? task.dueDate.toISOString() : null,
      actual_completion_date: task.actualCompletionDate ? task.actualCompletionDate.toISOString() : null,
      priority: task.priority,
      status: task.status,
      cancellation_reason: task.cancellationReason ?? null,
      cancelled_at: task.cancelledAt ? task.cancelledAt.toISOString() : null,
      original_status: task.originalStatus ?? null,
    };
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .insert([insertObj], { defaultToNull: true })
      .single();

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message || JSON.stringify(error));
    }

    // Si data existe, retorna la tarea creada normalmente
    if (data) return this.toDomain(data);

    // Si data no existe pero no hubo error, busca la tarea por id y retórnala
    const created = await this.findById(task.id, task.userId);
    if (created) return created;

    // Si no se encuentra, lanza un error
    throw new Error('No se pudo crear la tarea ni encontrarla después de la inserción');
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) return null;
    return data ? this.toDomain(data) : null;
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map(this.toDomain);
  }

  async update(task: Task): Promise<Task> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .update({
        name: task.name,
        description: task.description,
        estimated_duration: task.estimatedDuration,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        actual_completion_date: task.actualCompletionDate ? task.actualCompletionDate.toISOString() : null,
        priority: task.priority,
        status: task.status,
        cancellation_reason: task.cancellationReason ?? null,
        cancelled_at: task.cancelledAt ? task.cancelledAt.toISOString() : null,
        original_status: task.originalStatus ?? null,
      })
      .eq('id', task.id)
      .eq('user_id', task.userId)
      .select()
      .single();
    if (error) throw error;
    return this.toDomain(data);
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await this.findById(id, userId);
    if (!task) throw new Error('Tarea no encontrada');
    if (task.status !== 'pendiente') {
      throw new Error('Solo puedes eliminar tareas en estado pendiente');
    }
    const { error } = await this.supabaseService.client
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  }

  private toDomain(data: any): Task {
    return new Task(
      data.id,
      data.user_id,
      data.name,
      data.description,
      new Date(data.created_at),
      data.estimated_duration,
      data.due_date ? new Date(data.due_date) : null,
      data.actual_completion_date ? new Date(data.actual_completion_date) : null,
      data.priority,
      data.status,
      data.cancellation_reason ?? null,
      data.cancelled_at ? new Date(data.cancelled_at) : null,
      data.original_status ?? null,
    );
  }

  async createFromDto(userId: string, dto: CreateTaskDto) {
    const task = new Task(
      crypto.randomUUID(),
      userId,
      dto.name,
      dto.description ?? '',
      new Date(),
      dto.estimated_duration,
      dto.due_date ? new Date(dto.due_date) : null,
      null, // actualCompletionDate
      dto.priority ?? 'media',
      'pendiente',
      null, // cancellationReason
      null, // cancelledAt
      null  // originalStatus
    );
    return this.create(task);
  }

  async updateFromDto(id: string, userId: string, dto: UpdateTaskDto) {
    const useCase = new UpdateTaskUseCase(this);
    return useCase.execute({
      id,
      userId,
      name: dto.name,
      description: dto.description,
      estimated_duration: dto.estimated_duration,
      due_date: dto.due_date,
      priority: dto.priority,
      status: dto.status,
      cancellation_reason: dto.cancellation_reason,
    });
  }
} 