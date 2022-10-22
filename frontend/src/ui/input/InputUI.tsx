import React from 'react'
import style from './InputUi.module.scss'

type inputProps = {
  type?: string
  placeholder?: string
  value?: string
  setValue?: any
  onBlur?: any
  name?: string
  error?: boolean
}

const InputUI: React.FC<inputProps> = ({
  type = 'text',
  placeholder = 'text',
  value,
  setValue = () => 'text',
  onBlur,
  name,
  error = true,
}) => {
  return (
    <div>
      <input
        className={` placeholder:opacity-50 text-sm ${
          error ? style.input : style.inputError
        }`}
        id="password"
        type={type}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        onBlur={onBlur}
        name={name}
      />
    </div>
  )
}

export default InputUI
