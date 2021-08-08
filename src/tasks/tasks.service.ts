import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { Connection, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { StopTaskDto } from './dto/stop-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private connection: Connection
  ){}

  async create(
    createTaskDto: CreateTaskDto
  ) {

    const new_task = new Task();

    new_task.name = createTaskDto.name;
    new_task.start_date = new Date(createTaskDto.start_date);

    const queryRunner = this.connection.createQueryRunner()

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // check for previous not ended task
      const active_task = await this.getActive();

      if (active_task) {

        //throw error when new tasks start time is before start time of active task
        if (new_task.start_date <= active_task.start_date)
          throw new Error(`New task can't start before or at the same time as active task.`)
        
        active_task.end_date = createTaskDto.start_date;

        await queryRunner.manager.save(active_task);
      }

      await queryRunner.manager.save(new_task)

      await queryRunner.commitTransaction();
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
    }
    finally {
      await queryRunner.release();
    }
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
      const queryRunner = this.connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      active_task.end_date = new Date(stopTaskDto.end_date);

      try {

        //throw error when new tasks start time is before start time of active task
        if (active_task.start_date >= active_task.end_date)
          throw new Error(`End date can't end before or at the same time as it starts.`)

        await queryRunner.manager.save(active_task)

        await queryRunner.commitTransaction();
      }
      catch (err) {
        await queryRunner.rollbackTransaction();
        console.log(err);
      }
      finally {
        await queryRunner.release();
      }
    }
  }
}
