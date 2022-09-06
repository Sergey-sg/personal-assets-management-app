import React from 'react'
import { Typography } from 'components/common/Typography'
import { Button } from 'components/common/buttons/Button'
import { Field, Form, Formik, FormikProps } from 'formik'
import { PasswordInput } from 'components/common/inputs/PasswordInput'
import { deleteAccountSchema } from './schemas/deleteAccountSchema'

interface DeleteAccountProps {
  current_password: string
  confirm_current_password: string
}

const InitialValues: DeleteAccountProps = {
  current_password: '',
  confirm_current_password: '',
}

const DeleteAccountForm = () => {
  const handleSubmit = (values: typeof InitialValues) => {
    console.log(values)
  }
  return (
    <Formik
      initialValues={InitialValues}
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={deleteAccountSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<DeleteAccountProps>) => {
        const { dirty, isValid, errors, handleBlur, handleChange, values } =
          props
        return (
          <>
            <div>
              <Typography type={'h4'}>{'Delete Account'}</Typography>
              <Typography type={'Ag-14-regular'}>
                {
                  'To delete your profile, enter your current password and confirm it.'
                }
              </Typography>
            </div>
            <Form className="flex flex-col gap-8 mb-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <Field
                  label={'New Password'}
                  name={'current_password'}
                  id={'current_password'}
                  placeholder={'e.g. *******'}
                  values={values.current_password}
                  error={errors.current_password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  component={PasswordInput}
                  className="sm:w-1/2"
                />

                <Field
                  label={'Confirm Password'}
                  name={'confirm_current_password'}
                  id={'confirm_current_password'}
                  placeholder={'e.g. *******'}
                  values={values.confirm_current_password}
                  error={errors.confirm_current_password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="sm:w-1/2"
                  component={PasswordInput}
                />
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="w-full lg:w-1/2">
                  <Button
                    label={'Delete Account'}
                    type={'submit'}
                    btnName={'primary'}
                    disabled={!(isValid && dirty)}
                  />
                </div>
              </div>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default DeleteAccountForm

//  <div>
//         <Typography type={'h4'} children={'Delete Account'} />
//         <Typography
//           type={'Ag-14-regular'}
//           children={
//             'To delete your profile, enter your current password and confirm it.'
//           }
//         />
//       </div>
//       <div className="flex flex-col sm:flex-row gap-5">
//         <div className="sm:w-1/2">
//           <Input
//             label={'Current password'}
//             type={'password'}
//             name={'cur-password-input'}
//             placeholder={'e.g. *******'}
//             // onChange={(e) => console.log(e.target.value)}
//           />
//         </div>
//         <div className="sm:w-1/2">
//           <Input
//             label={'Confirm current password'}
//             type={'password'}
//             name={'confirm-cur-password-input'}
//             placeholder={'e.g. *******'}
//             // onChange={(e) => console.log(e.target.value)}
//           />
//         </div>
//       </div>
