import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { TaskListState } from 'redux/slice/todo/todo.slice'
import { ToDoItem } from './ToDoItem'
import IconButton from '@mui/material/IconButton'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { deleteTaskList } from 'redux/slice/todo/todo.slice'
import { List } from '@mui/material'

interface ToDoListProps {
  onDeleteCallback?(): void
}

export function ToDoList(props: ToDoListProps) {
  const dispatch = useAppDispatch()
  const list = useAppSelector(
    (state) => state.todo.lists[state.todo.cursor],
  ) as TaskListState

  const deleteShowedList = () => {
    props.onDeleteCallback && props.onDeleteCallback()
    dispatch(deleteTaskList(list.id))
  }

  return !list ? null : (
    <>
      <div className="flex items-center justify-between">
        <h5 className="text-h5 font-bold capitalize text-center">
          {list.title}
        </h5>
        <IconButton onClick={deleteShowedList}>
          <DeleteSweepIcon fontSize="medium" color="error" />
        </IconButton>
      </div>
      <List
        sx={{
          width: '100%',
          height: 200,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
      >
        {list.tasks.map((t) => (
          <ToDoItem
            key={t.id}
            id={t.id}
            description={t.description}
            isDone={t.isDone}
          />
        ))}
      </List>
    </>
  )
}
