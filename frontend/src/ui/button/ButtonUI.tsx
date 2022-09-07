import React from 'react'
import style from './ButtonUI.module.scss'

type buttonProps = {
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined
  children: any
}

const ButtonUI: React.FC<buttonProps> = ({ onClick, children }) => {
  return (
    <div>
      <div onClick={onClick} className={style.button}>
        {children}
      </div>
    </div>
  )
}

export default ButtonUI
