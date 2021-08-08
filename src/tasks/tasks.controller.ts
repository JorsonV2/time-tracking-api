import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { StopTaskDto } from './dto/stop-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto
  ) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch()
  stopTask(
    @Body() stopTaskDto: StopTaskDto
  ) {
    return this.tasksService.stopTask(stopTaskDto);
  }

  @Get()
  getActive() {
    return this.tasksService.getActive();
  }

}
