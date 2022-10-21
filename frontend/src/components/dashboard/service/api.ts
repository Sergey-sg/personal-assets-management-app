import api from 'axios/axios'

export const fetchWallets = async () => {
  const data = await api.get(`/wallets`)

  return data?.data
}

export const fetchReportForPeriod = async (
  walletId: string | number,
  startDate: string,
  endDate: string,
) => {
  const res = await api.get(
    `/overview/search?walletId=${walletId}&startDate=${startDate}&endDate=${endDate}`,
  )

  return res?.data
}
