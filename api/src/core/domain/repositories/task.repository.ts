import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string, userId: string): Promise<Task | null>;
  findAllByUser(userId: string): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  delete(id: string, userId: string): Promise<void>;
} 