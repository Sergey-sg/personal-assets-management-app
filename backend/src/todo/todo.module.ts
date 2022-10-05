import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/task-list.entity';
import { ToDoService } from './todo.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { ToDoController } from './todo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskList, UserEntity])],
  providers: [ToDoService],
  controllers: [ToDoController],
})
export class ToDoModule {}
