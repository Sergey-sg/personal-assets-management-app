import React from 'react'
import { Typography } from 'components/common/Typography'
import { ReactComponent as GoogleIcon } from 'assets/icons/google.svg'
import clsx from 'clsx'
import { STYLES } from './Button.style'

interface ButtonProps {
  label?: string
  type: 'button' | 'submit' | 'reset'
  btnName: 'primary' | 'secondary' | 'tertiary' | 'tertiary2' | 'google'
  className?: string
  disabled?: boolean
  children?: React.ReactNode | React.ReactNode[]
  icon?: React.ReactNode
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  label,
  type,
  btnName,
  disabled = false,
  icon,
  className,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(STYLES[btnName], className)}
      onClick={onClick}
    >
      {btnName === 'google' && (
        <>
          <GoogleIcon className="w-5 h-5 mr-2" />
          <Typography type={'Ag-16-semibold'}>{label}</Typography>
        </>
      )}
      {btnName !== 'google' && label && icon && (
        <>
          <span className="w-5 h-5 mr-2 fill-current">{icon}</span>
          <Typography type={'Ag-16-semibold'}>{label}</Typography>
        </>
      )}
      {btnName !== 'google' && label && !icon && (
        <Typography type={'Ag-16-semibold'}>{label}</Typography>
      )}
      {btnName !== 'google' && !label && icon && (
        <span className="w-5 h-5 fill-current">{icon}</span>
      )}
    </button>
  )
}
