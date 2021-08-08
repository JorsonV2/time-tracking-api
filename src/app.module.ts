import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TasksModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
