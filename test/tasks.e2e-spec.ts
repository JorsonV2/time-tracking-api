import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TasksModule } from '../src/tasks/tasks.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../src/tasks/entities/task.entity';
import { FindManyOptions } from 'typeorm';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
    }).overrideProvider(getRepositoryToken(Task))
      .useValue(mockTasksRepository)
      .compile();
    
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
  });

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        name: 'test2',
        start_date: new Date(dateRef.getTime() + 200).toISOString()
      })
      .set('Accept', 'application/json')
      .expect(201)
  });

  it('/tasks (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/tasks')
      .send({
        end_date: new Date(dateRef.getTime() + 200).toISOString()
      })
      .set('Accept', 'application/json')
      .expect(200)
  });
});
