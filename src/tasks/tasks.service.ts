import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { StopTaskDto } from './dto/stop-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>
  ){}

  async create(
    createTaskDto: CreateTaskDto
  ) {

    const new_task = new Task();

    new_task.name = createTaskDto.name;
    new_task.start_date = new Date(createTaskDto.start_date);

    

    // check for previous not ended task
    const active_task = await this.getActive();

    if (active_task) {

      //throw error when new tasks start time is before start time of active task
      if (new_task.start_date <= active_task.start_date)
        throw new Error(`New task can't start before or at the same time as active task.`)
      
      active_task.end_date = new_task.start_date;

      await this.tasksRepository.save(active_task);
    }

    const created_task = this.tasksRepository.create(new_task);

    return await this.tasksRepository.save(created_task);
  }

  async getActive() {
    const lastTask = await this.tasksRepository.find({
      order: {
        start_date: "DESC"
      },
      take: 1
    });

    // check for the last startet task. If there is none or it has ended return null. Otherwhise return that task.
    if (lastTask[0])
      if (lastTask[0].end_date == null)
        return lastTask[0];
      else
        return null;
    
    return null;
  }

  async stopTask(
    stopTaskDto: StopTaskDto
  ) {
    const active_task = await this.getActive();

    if (active_task) {
      active_task.end_date = new Date(stopTaskDto.end_date);

      //throw error when new tasks start time is before start time of active task
      if (active_task.start_date >= active_task.end_date)
        throw new Error(`Tasks end date can't be before or at the same time as the start date.`)

      return await this.tasksRepository.save(active_task)

    }
      
    return null;
  }
}
