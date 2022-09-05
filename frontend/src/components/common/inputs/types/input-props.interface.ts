export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string;
  label?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  name: string;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  error?: string;
}

export interface PersonalInfoFormProps {
  user_id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  birthdate: string;
  phone: string;
}
