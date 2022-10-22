import {
  IconButton,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { deleteTask, updateTask } from 'redux/slice/todo/todo.slice'

interface ToDoItemProps {
  id: number
  description: string
  isDone: boolean
}

export function ToDoItem(props: ToDoItemProps) {
  const labelId = 'toDoItem' + props.id
  const dispatch = useAppDispatch()

  const handleDelete = () => dispatch(deleteTask(props.id))
  const handleMark = () =>
    dispatch(
      updateTask({
        id: props.id,
        description: props.description,
        isDone: true,
      }),
    )

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete task" onClick={handleDelete}>
          <DeleteIcon fontSize="medium" />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton onClick={handleMark} disabled={props.isDone}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={props.isDone}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={props.description} />
      </ListItemButton>
    </ListItem>
  )
}
