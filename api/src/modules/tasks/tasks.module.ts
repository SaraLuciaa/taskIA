import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { SupabaseService } from '../../supabase.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, SupabaseService],
  exports: [TasksService],
})
export class TasksModule {} 