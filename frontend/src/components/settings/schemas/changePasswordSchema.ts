import * as Yup from 'yup'

export const changePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Please, enter your password')
    .matches(/[0-9]/g, 'Password should contain numbers')
    .matches(/[A-Za-z]/g, 'Password should contain letters')
    .matches(
      /[*.!@#$%^&(){}\[\]:;<>,?\/~_+=|]/g,
      'Password should contain special characters',
    )
    .min(8, 'Password should contain minimum 8 symbols')
    .max(64, 'Password should contain maximum 64 symbols'),

  confirmPassword: Yup.string()
    .required('Please, enter your password')
    .oneOf([Yup.ref('newPassword')], "Passwords aren't the same"),
})
