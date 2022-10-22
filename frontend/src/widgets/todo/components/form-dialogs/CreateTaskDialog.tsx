import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { addTask } from 'redux/slice/todo/todo.slice'
import { Button } from '@mui/material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import { FormikErrors } from 'formik'

interface FormValues {
  description: string
}

export default function CreateTaskDialog() {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()

  const openClickHandler = () => setOpen(true)
  const closeHandler = () => setOpen(false)

  const list = useAppSelector((state) => state.todo.lists[state.todo.cursor])

  const handleSubmit = (values: FormValues) => {
    dispatch(addTask({ ...values, listId: list.id }))
    setOpen(false)
  }

  const initialValues: FormValues = { description: 'To do' }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={!list}
        onClick={openClickHandler}
      >
        Add task
      </Button>
      <Dialog open={open} onClose={closeHandler}>
        <DialogTitle>
          Add new task to &apos;{list?.title}&apos; list
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: FormikErrors<FormValues> = {}

            if (!values.description) {
              errors.description = 'Required'
            } else if (values.description.length > 150) {
              errors.description = 'Max length 150 chars'
            }

            return errors
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <DialogContentText>
                  Please set description of task
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Task description"
                  type="text"
                  fullWidth
                  variant="standard"
                  size="small"
                  value={values.description}
                  name="description"
                  onChange={handleChange}
                />
                <div className="text-red-500">{errors.description}</div>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" onClick={closeHandler}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  ADD TASK
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  )
}
