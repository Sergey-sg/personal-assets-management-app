export function getCorrectDateFormat(dateString: string) {
  const dateNow = new Date(dateString)

  return `${dateNow.getFullYear()}-${String(dateNow.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(dateNow.getDate()).padStart(2, '0')}`
}

export function convertDate(date: string) {
  const convertedDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(new Date(date))

  return convertedDate
}

export const sum = (obj: any) => {
  return Object.keys(obj).reduce(
    (sum, key) => sum + (parseFloat(obj[key] || 0) * 100) / 100,
    0,
  )
}
