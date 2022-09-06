import * as Yup from 'yup'

export const deleteAccountSchema = Yup.object().shape({
  current_password: Yup.string().required('Current password cannot be empty'),

  confirm_current_password: Yup.string()
    .required('Please, enter your password')
    .oneOf([Yup.ref('current_password')], "Passwords aren't the same"),
})
