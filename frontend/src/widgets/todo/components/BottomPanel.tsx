import React from 'react'
import CreateTaskDialog from './form-dialogs/CreateTaskDialog'

export function BottomPanel() {
  return (
    <footer className="border-t text-center p-2 mt-auto">
      <CreateTaskDialog />
    </footer>
  )
}
