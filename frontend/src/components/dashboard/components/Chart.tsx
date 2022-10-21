import * as React from 'react'
import { Transaction } from '../interfaces'

// interface ChartItem {
//   sum: number
//   name: number | string
//   percent: number
// }
// { transactions }: { transactions: Transaction[] }

const Chart = ({ transactions }: { transactions: Transaction[] }) => {
  // const [pickedCat, setPickedCat] = React.useState<ChartItem>({} as ChartItem)

  // console.log('Chart component - ', transactions)

  return (
    <div className="p-1 flex-1 border">
      <h3 className="text-center p-2">Incomes and Outcomes</h3>
      <div className="w-full h-full p-2"></div>
    </div>
  )
}

export default Chart
