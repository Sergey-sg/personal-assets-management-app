import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
// import './input.css'

export type PasswordInputProps = {
  id: string
  label: string
  placeholder: string
  value?: string
  error?: string
  className?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  error,
  className,
  ...inputProps
}) => {
  const [visible, setVisible] = useState(false)
  const borderStyle = error ? 'border-error' : 'border-green-light'

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 z-10">
          {visible === true ? (
            <FaEye
              className="Icon opacity-60"
              size={27}
              onClick={() => setVisible(false)}
            />
          ) : (
            <FaEyeSlash
              className="Icon opacity-60"
              size={27}
              onClick={() => setVisible(true)}
            />
          )}
        </span>
        <input
          className={`form-input rounded-lg min-w-full text-sm opacity-70 focus:border-2 focus:border-lime-500 focus:ring-0 ${borderStyle}`}
          name={id}
          type={visible ? 'text' : 'password'}
          {...inputProps}
        />
      </div>
      {!!error && <div className="text-sm text-error">{error}</div>}
    </div>
  )
}
