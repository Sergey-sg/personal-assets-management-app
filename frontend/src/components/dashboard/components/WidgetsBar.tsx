import * as React from 'react'
import { ToDoWidget } from 'widgets/todo/ToDoWidget'
import { ExchangeWidget } from '../../../widgets/exchange'

// TODO: user can set wallet as default wallet

const WidgetsBar = () => {
  return (
    <div className="flex-grow flex-shrink-0 flex flex-col gap-2 basis-1/3">
      <ExchangeWidget />
      <div className="flex-1 basis-1/3">
        <ToDoWidget />
      </div>

      <div className="h-2/3">Other Widget</div>
    </div>
  )
}

export default WidgetsBar
