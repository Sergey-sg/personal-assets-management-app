import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/task-list.entity';
import { ToDoService } from './todo.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { ToDoController } from './todo.controller';
import { AuthMiddleware } from 'src/auth/middleware/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskList, UserEntity])],
  providers: [ToDoService],
  controllers: [ToDoController],
})
export class ToDoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ToDoController);
  }
}
