import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../supabase.service';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ITaskRepository } from '../../../core/domain/repositories/task.repository';
import { Task } from '../../../core/domain/entities/task.entity';

@Injectable()
export class TasksService implements ITaskRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(task: Task): Promise<Task> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .insert([{
        id: task.id,
        user_id: task.userId,
        nombre: task.nombre,
        descripcion: task.descripcion,
        fecha_creacion: task.fechaCreacion.toISOString(),
        tiempo_estimado: task.tiempoEstimado,
        fecha_finalizacion: task.fechaFinalizacion ? task.fechaFinalizacion.toISOString() : null,
        prioridad: task.prioridad,
        estado: task.estado,
        motivo_cancelacion: task.motivoCancelacion ?? null,
        fecha_cancelacion: task.fechaCancelacion ? task.fechaCancelacion.toISOString() : null,
      }], { defaultToNull: true })
      .select()
      .single();
    if (error) throw error;
    return this.toDomain(data);
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
        nombre: task.nombre,
        descripcion: task.descripcion,
        tiempo_estimado: task.tiempoEstimado,
        fecha_finalizacion: task.fechaFinalizacion ? task.fechaFinalizacion.toISOString() : null,
        prioridad: task.prioridad,
        estado: task.estado,
        motivo_cancelacion: task.motivoCancelacion ?? null,
        fecha_cancelacion: task.fechaCancelacion ? task.fechaCancelacion.toISOString() : null,
      })
      .eq('id', task.id)
      .eq('user_id', task.userId)
      .select()
      .single();
    if (error) throw error;
    return this.toDomain(data);
  }

  async delete(id: string, userId: string): Promise<void> {
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
      data.nombre,
      data.descripcion,
      new Date(data.fecha_creacion),
      data.tiempo_estimado,
      data.fecha_finalizacion ? new Date(data.fecha_finalizacion) : null,
      data.prioridad,
      data.estado,
      data.motivo_cancelacion ?? null,
      data.fecha_cancelacion ? new Date(data.fecha_cancelacion) : null,
    );
  }

  async createFromDto(userId: string, dto: CreateTaskDto) {
    const task = new Task(
      crypto.randomUUID(),
      userId,
      dto.nombre,
      dto.descripcion ?? '',
      new Date(),
      dto.tiempo_estimado,
      dto.fecha_finalizacion ? new Date(dto.fecha_finalizacion) : null,
      dto.prioridad ?? 'media',
      'pendiente',
      null,
      null
    );
    return this.create(task);
  }

  async updateFromDto(id: string, userId: string, dto: UpdateTaskDto) {
    const existing = await this.findById(id, userId);
    if (!existing) throw new Error('Tarea no encontrada');
    const updated = new Task(
      existing.id,
      existing.userId,
      dto.nombre ?? existing.nombre,
      dto.descripcion ?? existing.descripcion,
      existing.fechaCreacion,
      dto.tiempo_estimado ?? existing.tiempoEstimado,
      dto.fecha_finalizacion ? new Date(dto.fecha_finalizacion) : existing.fechaFinalizacion,
      dto.prioridad ?? existing.prioridad,
      dto.estado ?? existing.estado,
      dto.motivo_cancelacion ?? existing.motivoCancelacion,
      dto.fecha_cancelacion ? new Date(dto.fecha_cancelacion) : existing.fechaCancelacion
    );
    return this.update(updated);
  }
} 