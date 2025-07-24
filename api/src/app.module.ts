import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/controllers/auth.controller';
import { AuthService } from './modules/auth/services/auth.service';
import { SupabaseService } from './supabase.service';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService],
})
export class AppModule {}