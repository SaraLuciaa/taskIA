import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
      const useCase = new CreateTaskUseCase(this.tasksService);
      return await useCase.execute({
        userId: req.user.id,
        name: dto.name,
        description: dto.description,
        estimated_duration: dto.estimated_duration,
        due_date: dto.due_date,
        priority: dto.priority,
      });
    } catch (error) {
      throw new HttpException(error.message || 'Error al crear la tarea', HttpStatus.BAD_REQUEST);
    }
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
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    try {
      return await this.tasksService.updateFromDto(id, req.user.id, dto);
    } catch (error) {
      throw new HttpException(error.message || 'Error al actualizar la tarea', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    try {
      return await this.tasksService.delete(id, req.user.id);
    } catch (error) {
      throw new HttpException(error.message || 'Error al eliminar la tarea', HttpStatus.BAD_REQUEST);
    }
  }
} 