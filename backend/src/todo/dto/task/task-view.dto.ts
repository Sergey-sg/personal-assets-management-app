import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../../entities/task.entity';

export class TaskViewDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty({
    default: false,
  })
  isDone: boolean;

  static fromEntity(task: Task): TaskViewDto {
    const dto = new TaskViewDto();
    dto.id = task.id;
    dto.description = task.description;
    dto.isDone = task.isDone;
    return dto;
  }
}
