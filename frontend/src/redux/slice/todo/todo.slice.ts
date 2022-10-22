import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'axios/axios'

export interface TaskState {
  id: number
  description: string
  isDone: boolean
}

export interface TaskListState {
  id: number
  title: string
  tasks: TaskState[]
}

export interface TodoState {
  status: string
  lists: TaskListState[]
  cursor: number
}

const initialState: TodoState = {
  status: 'idle',
  lists: [],
  cursor: 0,
}

export const fetchLists = createAsyncThunk('todo/fetchTodo', async () => {
  const response = await api.get('/todo-lists')

  return response.data
})

export const createTaskList = createAsyncThunk(
  'todo/createTaskList',
  async (title: string) => {
    const response = await api.post('/todo-lists', { title })

    return response.data
  },
)

export const deleteTaskList = createAsyncThunk(
  'todo/deleteTaskList',
  async (listId: number) => {
    const response = await api.delete(`/todo-lists/${listId}`)

    if (response.status === 204) return listId

    return -1
  },
)

export const addTask = createAsyncThunk(
  'todo/addTask',
  async (params: { description: string; listId: number }) => {
    const response = await api.post(`/todo-lists/${params.listId}/tasks`, {
      description: params.description,
    })

    return response.data
  },
)

export const updateTask = createAsyncThunk(
  'todo/updateTask',
  async (params: { id: number; description: string; isDone: boolean }) => {
    const response = await api.put(`/todo-lists/tasks/${params.id}`, {
      description: params.description,
      isDone: params.isDone,
    })

    return response.data
  },
)

export const deleteTask = createAsyncThunk(
  'todo/deleteTask',
  async (id: number) => {
    const response = await api.delete(`/todo-lists/tasks/${id}`)

    if (response.status === 204) return id

    return -1
  },
)

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setCursor(state, action) {
      state.cursor = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.lists = action.payload
        state.status = 'idle'
      })
      .addCase(createTaskList.fulfilled, (state, action) => {
        state.lists.push(action.payload)
        state.cursor = state.lists.length - 1
      })
      .addCase(deleteTaskList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.id !== action.payload)
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.id === action.payload.listId)

        if (!list) throw Error('List not found')
        list.tasks.push({ ...action.payload })
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.id === action.payload.listId)

        if (list) {
          for (const task of list.tasks) {
            if (task.id === action.payload.id) {
              task.description = action.payload.description
              task.isDone = action.payload.isDone
            }
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const deletedTaskId: number = action.payload

        for (const l of state.lists) {
          const task = l.tasks.find((t) => t.id == deletedTaskId)

          if (!task) continue
          l.tasks = l.tasks.filter((t) => t.id !== deletedTaskId)
          break
        }
      })
  },
})

export default todoSlice.reducer

export const { setCursor } = todoSlice.actions
