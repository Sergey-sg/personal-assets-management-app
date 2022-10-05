import { Button } from 'components/common/buttons/Button'
import React, { useCallback } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import InputUI from '../../ui/input/InputUI'
import { Form, Formik } from 'formik'
import { validationsSchemaRegister } from './schemasAuth/ValidationSchemaAuth'
import { Registration } from 'redux/slice/authSlice'

type PropsRegisterForm = {
  toggleFunction: React.MouseEventHandler<HTMLButtonElement>
}

const RegisterForm: React.FC<PropsRegisterForm> = ({ toggleFunction }: any) => {
  const dispatch = useAppDispatch()

  const clickButton = useCallback(
    ({ firstName, lastName, email, password }: any) => {
      const params = { firstName, lastName, email, password }

      dispatch(Registration(params))
      toggleFunction()
    },
    [],
  )

  return (
    <div className="p-4" style={{ margin: 'auto', width: '100%' }}>
      <h1 className="text-3xl font-semibold text-center mb-10">
        Sing up for an account
      </h1>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validateOnBlur
        onSubmit={(registerData) => clickButton(registerData)}
        validationSchema={validationsSchemaRegister}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          dirty,
        }) => (
          <div>
            <Form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-2"
                  htmlFor="username"
                >
                  First name
                </label>
                <InputUI
                  type={'text'}
                  name={'firstName'}
                  placeholder={'First name'}
                  value={values.firstName}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && errors.firstName ? false : true}
                ></InputUI>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-2"
                  htmlFor="username"
                >
                  Last name
                </label>
                <InputUI
                  type={'text'}
                  name={'lastName'}
                  placeholder={'Last name'}
                  value={values.lastName}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && errors.lastName ? false : true}
                ></InputUI>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-2"
                  htmlFor="username"
                >
                  Email
                </label>
                <InputUI
                  type={'email'}
                  name={'email'}
                  placeholder={'Email'}
                  value={values.email}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email ? false : true}
                ></InputUI>
              </div>
              {touched.email && errors.email && (
                <p
                  className="text-red-600 italic text-sm"
                  style={{ margin: '0', position: 'relative', bottom: '12px' }}
                >
                  {errors.email}
                </p>
              )}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-2"
                  htmlFor="username"
                >
                  Password
                </label>
                <InputUI
                  type={'password'}
                  name={'password'}
                  placeholder={'Password'}
                  value={values.password}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? false : true}
                ></InputUI>
              </div>
              {touched.password && errors.password && (
                <p
                  className="text-red-600 italic text-sm"
                  style={{ margin: '0', position: 'relative', bottom: '12px' }}
                >
                  {errors.password}
                </p>
              )}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-2"
                  htmlFor="username"
                >
                  Confirm password
                </label>
                <InputUI
                  type={'password'}
                  name={'confirmPassword'}
                  placeholder={'Confirm password'}
                  value={values.confirmPassword}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? false
                      : true
                  }
                ></InputUI>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span
                  className="text-red-600 italic text-sm"
                  style={{ margin: '0', position: 'relative', bottom: '12px' }}
                >
                  {errors.confirmPassword}
                </span>
              )}
              <Button
                disabled={!isValid && !dirty}
                type={'submit'}
                btnName={'primary'}
                label={'Register'}
              >
                Register
              </Button>
              <hr className="m-2" />
            </Form>
          </div>
        )}
      </Formik>
      <div
        onClick={toggleFunction}
        className="italic cursor-pointer hover: text-slate-500"
      >
        You already have an account?
      </div>
    </div>
  )
}

export default RegisterForm
