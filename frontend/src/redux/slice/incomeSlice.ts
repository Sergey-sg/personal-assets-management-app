import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from 'axios/axios'
import { Currencies } from 'common/enums/currency.enum'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { LoadingStatus } from 'common/enums/loading-status'
import { IWallet } from './walletsSlice'

const incomesLimit = 5

export interface IIncome {
  id: number
  createdAt: Date
  updatedAt: Date
  income_name: string
  category_name: IncomeCategories
  income_sum: number
  is_transaction: boolean
}

export interface ICreateIncomeDto {
  income_name: string
  category_name: IncomeCategories
  income_sum: number
}

export interface IUpdateIncomeDto {
  income_name: string
  category_name: IncomeCategories
  income_sum: number
  createdAt: Date
}

export interface ICreateIncome {
  walletId: number
  limit: number
  data: ICreateIncomeDto
}

interface IUpdateIncome extends ICreateIncome {
  transactionId: number
  data: IUpdateIncomeDto
}

interface IDeleteIncome {
  transactionId: number
  walletId: number
  limit: number
}

export interface IGetWalletIncomes extends IWallet {
  income: IIncome[]
  income_count: number
}

interface IGetIncomesParams {
  walletId: number
  limit: number
}

export interface IGetMoreIncomesParams {
  walletId: number
  limit: number
  offset: number
}

interface IIncomeState {
  incomes: IIncome[]
  loading: LoadingStatus
  errorMessage: string
  successMessage: string | null
  income_count: number
  currency: Currencies
  limit: number
  offset: number
  currentIncome: IIncome | null
}

const initialState: IIncomeState = {
  incomes: [],
  loading: LoadingStatus.SUCCESS,
  errorMessage: '',
  successMessage: null,
  income_count: 0,
  currency: Currencies.UAH,
  limit: incomesLimit,
  offset: incomesLimit,
  currentIncome: null,
}

export const fetchIncomes = createAsyncThunk<
  IGetWalletIncomes,
  IGetIncomesParams,
  { rejectValue: string }
>('incomes/fetchIncomes', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const fetchMoreIncomes = createAsyncThunk<
  IGetWalletIncomes,
  IGetMoreIncomesParams,
  { rejectValue: string }
>('incomes/fetchMoreIncomes', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}&offset=${params.offset}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const addNewIncome = createAsyncThunk<
  IGetWalletIncomes,
  ICreateIncome,
  { rejectValue: string }
>('incomes/addIncome', async (params, { rejectWithValue }) => {
  try {
    await api.post(`/income/wallet/${params.walletId}`, params.data)

    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const updateIncome = createAsyncThunk<
  IGetWalletIncomes,
  IUpdateIncome,
  { rejectValue: string }
>('incomes/updateIncome', async (params, { rejectWithValue }) => {
  try {
    await api.patch(`/income/${params.transactionId}`, params.data)

    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const deleteIncome = createAsyncThunk<
  IGetWalletIncomes,
  IDeleteIncome,
  { rejectValue: string }
>('incomes/deleteIncome', async (params, { rejectWithValue }) => {
  try {
    await api.delete(`/income/${params.transactionId}`)

    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

const isAllLoading = isPending(
  fetchIncomes,
  fetchMoreIncomes,
  addNewIncome,
  updateIncome,
  deleteIncome,
)

const isAllSuccess = isFulfilled(
  fetchIncomes,
  fetchMoreIncomes,
  addNewIncome,
  updateIncome,
  deleteIncome,
)

const isAllError = isRejectedWithValue(
  fetchIncomes,
  fetchMoreIncomes,
  addNewIncome,
  updateIncome,
  deleteIncome,
)

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload
    },
    setCurrentIncome(state, action: PayloadAction<IIncome>) {
      state.currentIncome = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.currency = action.payload.currency
        state.offset = incomesLimit
      })
      .addCase(fetchMoreIncomes.fulfilled, (state, action) => {
        state.incomes = [...state.incomes, ...action.payload.income]
      })
      .addCase(addNewIncome.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.successMessage = 'Added new income'
        state.offset = incomesLimit
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.successMessage = 'Update income successfully'
        state.offset = incomesLimit
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.successMessage = 'Delete income successfully'
        state.offset = incomesLimit
      })
      .addMatcher(isAllSuccess, (state) => {
        state.loading = LoadingStatus.SUCCESS
        state.errorMessage = ''
      })
      .addMatcher(isAllLoading, (state) => {
        state.loading = LoadingStatus.LOADING
        state.successMessage = null
        state.errorMessage = ''
      })
      .addMatcher(isAllError, (state, action: PayloadAction<string>) => {
        state.errorMessage = action.payload
        state.loading = LoadingStatus.ERROR
      })
  },
})

export const { setOffset, setCurrentIncome } = incomeSlice.actions

export default incomeSlice.reducer
