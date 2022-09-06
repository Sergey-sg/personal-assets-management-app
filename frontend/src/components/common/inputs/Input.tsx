import React from 'react'
import { Typography } from 'components/common/Typography'
import { InputProps } from './types/input-props.interface'
import clsx from 'clsx'

export const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  error,
  isInvalid,
  className,
  ...inputProps
}) => {
  const borderStyle = isInvalid ? 'border-error' : 'border-green-light'
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={name}>
        <Typography type={'Ag-14-regular'}>{label}</Typography>
      </label>

      <input
        className={`form-input rounded-lg min-w-full text-sm opacity-70  focus:border-2 focus:border-lime-500 focus:ring-0 ${borderStyle}`}
        type={type}
        name={name}
        {...inputProps}
      />

      {isInvalid && error && (
        <div className="text-sm text-error">
          <Typography type={'Ag-14-regular'}>{error}</Typography>
        </div>
      )}
    </div>
  )
}
