import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { StopTaskDto } from './dto/stop-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  let tasks: Task[];

  const dateRef = new Date();

  const mockTasksRepository = {
    find: jest.fn((options: FindManyOptions<Task>) =>
      Promise.resolve([...tasks].sort((t1, t2) => t2.start_date.getTime() - t1.start_date.getTime()))
    ),

    create: jest.fn((task: Task) => {
      return {
        id: Date.now(),
        end_date: null,
        ...task
      }
    }),

    save: jest.fn(async (task: Task) => {
      let found = false;
      let index = 0;
      for (; index < tasks.length; index++) {
        if (tasks[index].id == task.id) {
          found = true;
          break;
        }
      }

      if (found) {
        tasks[index] = task;
        return Promise.resolve(tasks[index])
      }
        
      return tasks[await Promise.resolve(tasks.push(task)) - 1]
    })

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository
        }
      ],
    }).compile();

    tasks = [
        {
          id: 0,
          name: 'test0',
          start_date: dateRef,
          end_date: new Date(dateRef.getTime() + 100)
        },
        {
          id: 1,
          name: 'test1',
          start_date: new Date(dateRef.getTime() + 101),
          end_date: null
        }
      ]

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return active task', async () => {
    expect(await service.getActive()).toEqual<Task>(tasks[1]);
  })

  it('should create and return new task', async () => {
    const new_task: CreateTaskDto = {
      name: 'task2',
      start_date: new Date(dateRef.getTime() + 120)
    }

    expect(await service.create(new_task)).toEqual<Task>({
      id: expect.any(Number),
      end_date: null,
      ...new_task
    })

    expect(await service.getActive()).toEqual<Task>({
      id: expect.any(Number),
      end_date: null,
      ...new_task
    })
  })

  it('should stop active task and return null for active task', async () => {
    const stop_task: StopTaskDto = {
      end_date: new Date(dateRef.getTime() + 130)
    }

    expect(await service.stopTask(stop_task)).toEqual({
      ...tasks[1],
      ...stop_task
    });

    expect(await service.getActive()).toBeNull();
  })

});
