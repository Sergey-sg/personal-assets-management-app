import React, { useState } from 'react'
import { Field, Form, Formik, FormikProps } from 'formik'
import { Button } from 'components/common/buttons/Button'
import { PasswordInput } from 'components/common/inputs/PasswordInput'
import { changePasswordSchema } from './schemas/changePasswordSchema'
import { SectionTitle } from './SectionTitle'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'

interface ChangePasswordFormProps {
  new_password: string
  confirm_password: string
}

const InitialValues: ChangePasswordFormProps = {
  new_password: '',
  confirm_password: '',
}

const ChangePasswordForm: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const handleSubmit = (values: typeof InitialValues) => {
    console.log(values)
  }
  return (
    <Formik
      initialValues={InitialValues}
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={changePasswordSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<ChangePasswordFormProps>) => {
        const { dirty, isValid, errors, handleBlur, handleChange, values } =
          props
        return (
          <>
            <SectionTitle
              title={'Change Password'}
              subTitle={
                'To change your password, enter your new password and confirm it.'
              }
              icon={<PenIcon />}
              iconLabel={'Edit'}
              onClick={() => setIsVisible(!isVisible)}
            />

            {isVisible && (
              <Form className={'flex flex-col gap-8 mb-5'}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Field
                    label={'New Password'}
                    name={'new_password'}
                    id={'new_password'}
                    placeholder={'e.g. *******'}
                    values={values.new_password}
                    error={errors.new_password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    component={PasswordInput}
                    className="sm:w-1/2"
                  />

                  <Field
                    label={'Confirm Password'}
                    name={'confirm_password'}
                    id={'confirm_password'}
                    placeholder={'e.g. *******'}
                    values={values.confirm_password}
                    error={errors.confirm_password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="sm:w-1/2"
                    component={PasswordInput}
                  />
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full lg:w-1/2">
                    <Button
                      label={'Change Password'}
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

export default ChangePasswordForm
