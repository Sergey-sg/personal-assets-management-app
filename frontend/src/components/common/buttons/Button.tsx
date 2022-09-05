import React from 'react';
import { Typography } from 'components/common/Typography';
import { ReactComponent as GoogleIcon } from 'assets/icons/google.svg';
import clsx from 'clsx';

interface ButtonProps {
  label?: string;
  type: 'button' | 'submit' | 'reset';
  btnName: 'primary' | 'secondary' | 'tertiary' | 'google';
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode;
  onClick?: () => void;
}

const STYLES = {
  primary:
    'p-4 border-none rounded-lg text-text bg-green-light hover:bg-green-hover focus:bg-green-hover hover:text-white focus:text-white disabled:bg-gray-ultralight disabled:text-gray-light w-full',

  secondary:
    'p-4 rounded text-green bg-green-ultralight hover:bg-green focus:bg-green hover:text-white focus:text-white disabled:bg-gray-ultralight disabled:text-gray-light w-full',

  tertiary:
    'p-4 rounded-lg text-green bg-gray-ultralight hover:bg-green focus:bg-green hover:text-white focus:text-white w-full',

  google:
    'p-4 rounded-lg border text-text-light hover:bg-gray-ultralight w-full',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  type,
  btnName,
  disabled = false,
  icon,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'flex justify-center items-center  text-center text-base box-border transition  duration-200 cursor-pointer',
        STYLES[btnName],
        className,
      )}
    >
      {btnName === 'google' ? (
        <GoogleIcon className="w-5 h-5 mr-2" />
      ) : label ? (
        <span className="w-5 h-5 mr-2 fill-current">{icon}</span>
      ) : (
        <span className="w-5 h-5 fill-current">{icon}</span>
      )}
      <Typography type={'Ag-16-semibold'} children={label} />
    </button>
  );
};
