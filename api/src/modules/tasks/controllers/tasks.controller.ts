import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { CreateTaskUseCase } from '../../../core/application/use-cases/create-task.usecase';

@Controller('tasks')
@UseGuards(SupabaseJwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req) {
    const useCase = new CreateTaskUseCase(this.tasksService);
    return useCase.execute({ userId: req.user.id, ...dto });
  }

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findById(id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    return this.tasksService.updateFromDto(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.tasksService.delete(id, req.user.id);
  }
} 