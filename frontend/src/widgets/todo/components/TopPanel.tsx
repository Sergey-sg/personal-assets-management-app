import React from 'react'
import CreateTaskListDialog from './form-dialogs/CreateTaskListDialog'
import IconButton from '@mui/material/IconButton'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'hooks/useAppDispatch'
import { setCursor } from 'redux/slice/todo/todo.slice'

export function TopPanel() {
  const dispatch = useDispatch()

  const listCount = useAppSelector((state) => state.todo.lists.length)
  const cursor = useAppSelector((state) => state.todo.cursor)

  const showNextList = () => {
    const next = (cursor + 1) % listCount

    dispatch(setCursor(next))
  }
  const showPrevList = () => {
    const prev = cursor - 1 < 0 ? listCount - 1 : cursor - 1

    dispatch(setCursor(prev))
  }

  return (
    <header className="flex items-center justify-between border-b p-2">
      <h4 className="text-h4 font-bold capitalize">Task lists</h4>
      <div>
        <IconButton
          color="primary"
          aria-label="show prev list"
          component="label"
          disabled={listCount < 2}
          onClick={showPrevList}
        >
          <ArrowCircleLeftIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="show next list"
          component="label"
          disabled={listCount < 2}
          onClick={showNextList}
        >
          <ArrowCircleRightIcon />
        </IconButton>
        <CreateTaskListDialog />
      </div>
    </header>
  )
}
