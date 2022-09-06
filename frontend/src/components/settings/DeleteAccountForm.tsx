import React, { useState } from 'react'
import { Button } from 'components/common/buttons/Button'
import { Field, Form, Formik, FormikProps } from 'formik'
import { PasswordInput } from 'components/common/inputs/PasswordInput'
import { deleteAccountSchema } from './schemas/deleteAccountSchema'
import { SectionTitle } from './SectionTitle'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'

interface DeleteAccountProps {
  current_password: string
  confirm_current_password: string
}

const InitialValues: DeleteAccountProps = {
  current_password: '',
  confirm_current_password: '',
}

const DeleteAccountForm = () => {
  const [isVisible, setIsVisible] = useState(false)

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
            <SectionTitle
              title={'Delete Account'}
              subTitle={
                'To delete your account, enter your password and confirm it.'
              }
              icon={<PenIcon />}
              iconLabel={'Edit'}
              onClick={() => setIsVisible(!isVisible)}
            />

            {isVisible && (
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
            )}
          </>
        )
      }}
    </Formik>
  )
}

export default DeleteAccountForm
