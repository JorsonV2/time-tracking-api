import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { StopTaskDto } from './dto/stop-task.dto';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn((dto: CreateTaskDto) : Task => {
      return {
        id: Date.now(),
        name: dto.name,
        start_date: dto.start_date,
        end_date: null
      }
    }),

    getActive: jest.fn(() : Task => {
      return {
        id: Date.now(),
        name: 'test',
        start_date: new Date(),
        end_date: null
      }
    }),

    stopTask: jest.fn((dto: StopTaskDto): Task => {
      return {
        id: Date.now(),
        name: 'test',
        start_date: new Date(),
        end_date: dto.end_date
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new task', () => {
    const new_task: CreateTaskDto = {
      name: 'test',
      start_date: new Date()
    } 

    expect(controller.create(new_task))
      .toEqual<Task>({
        id: expect.any(Number),
        end_date: null,
        ...new_task 
      })
  })

  it('should get active task', () => {
    expect(controller.getActive())
      .toEqual<Task>({
        id: expect.any(Number),
        name: 'test',
        start_date: expect.any(Date),
        end_date: null
    })
  })

  it('should stop active task', () => {
    const stop_task: StopTaskDto = {
      end_date: new Date()
    }

    expect(controller.stopTask(stop_task))
      .toEqual<Task>({
        id: expect.any(Number),
        name: 'test',
        start_date: expect.any(Date),
        end_date: stop_task.end_date
      })
  })
});
