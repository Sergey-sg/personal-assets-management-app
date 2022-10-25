import { SkipThrottle } from '@nestjs/throttler';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { AddTaskDto } from './dto/task/add-task.dto';
import { TaskViewDto } from './dto/task/task-view.dto';
import { TaskListViewDto } from './dto/task-list/task-list-view.dto';
import { ToDoService } from './todo.service';
import { ApiResponse } from '@nestjs/swagger';
import { CreateTaskListDto } from './dto/task-list/create-task-list.dto';
import { UpdateTaskListDto } from './dto/task-list/update-task-list.dto';
import { UpdateTaskDto } from './dto/task/update-task.dto';
import { EntityNotFoundError } from 'typeorm';
import { User } from 'src/user/decorators/user.decorator';

@SkipThrottle()
@Controller('todo-lists')
export class ToDoController {
  constructor(private readonly todoService: ToDoService) {}

  @Get()
  @ApiResponse({ type: [TaskListViewDto] })
  async getAllLists(@User('id') userId: number): Promise<TaskListViewDto[]> {
    return (await this.todoService.getLists(userId)).map((list) =>
      TaskListViewDto.fromEntity(list),
    );
  }

  @Post()
  @ApiResponse({ type: TaskListViewDto })
  async createList(
    @User('id') userId: number,
    @Body() dto: CreateTaskListDto,
  ): Promise<TaskListViewDto> {
    const newList = await this.todoService.createList(dto.title, userId);
    return TaskListViewDto.fromEntity(newList);
  }

  @Put(':id')
  @ApiResponse({ type: TaskListViewDto })
  async updateList(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskListDto,
  ): Promise<TaskListViewDto> {
    if (await this.todoService.doesListBelongToUser(userId, id)) {
      const list = await this.todoService.updateList(dto.title, id);
      return TaskListViewDto.fromEntity(list);
    }
    throw new ForbiddenException(
      'It is forbidden to update a task list that does not belong to the current user.',
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async removeList(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (await this.todoService.doesListBelongToUser(userId, id)) {
      await this.todoService.removeList(id);
      return;
    }
    throw new ForbiddenException(
      'It is forbidden to delete a task list that does not belong to the current user.',
    );
  }

  @Post(':listId/tasks')
  @ApiResponse({ type: TaskViewDto })
  async addTask(
    @User('id') userId: number,
    @Body() dto: AddTaskDto,
    @Param('listId', ParseIntPipe) listId: number,
  ): Promise<TaskViewDto> {
    if (await this.todoService.doesListBelongToUser(userId, listId)) {
      const newTask = await this.todoService.addTask(listId, dto.description);
      return TaskViewDto.fromEntity(newTask);
    }
    throw new ForbiddenException(
      'It is forbidden to add a task to the list that do not belong to the current user.',
    );
  }

  @Put('tasks/:id')
  @ApiResponse({ type: TaskViewDto })
  async updateTask(
    @User('id') userId: number,
    @Body() dto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskViewDto> {
    if (await this.todoService.doesTaskBelongToUser(userId, id)) {
      const task = await this.todoService.updateTask(
        id,
        dto.description,
        dto.isDone,
      );
      return TaskViewDto.fromEntity(task);
    }
    throw new ForbiddenException(
      'It is forbidden to update tasks from the list that does not belong to the current user.',
    );
  }

  @Delete('tasks/:id')
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  async removeTask(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (await this.todoService.doesTaskBelongToUser(userId, id)) {
      await this.todoService.removeTask(id);
      return;
    }
    throw new ForbiddenException(
      'It is forbidden to remove tasks from the list that do not belong to the current user.',
    );
  }
}
