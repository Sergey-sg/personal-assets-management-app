import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';
import { TaskList } from './task-list.entity';

@Entity('task')
export class Task extends Base {
  @Column({
    type: 'varchar',
    length: 150,
    default: 'My task to do',
  })
  description: string;

  @Column({
    name: 'is_done',
    type: 'boolean',
    default: false,
  })
  isDone: boolean;

  @ManyToOne((type) => TaskList, (list) => list.tasks, { onDelete: 'CASCADE' })
  list: TaskList;
}
