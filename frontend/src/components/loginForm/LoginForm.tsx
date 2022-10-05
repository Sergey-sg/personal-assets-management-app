import { Button } from 'components/common/buttons/Button'
import React, { useCallback } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { fetchLogin, Registration } from '../../redux/slice/authSlice'
import InputUI from '../../ui/input/InputUI'
import GoogleButton from './googleButton/GoogleButton'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { validationsSchemaLogin } from 'components/registerForm/schemasAuth/ValidationSchemaAuth'

type PropsLoginForm = {
  toggleFunction: React.MouseEventHandler<HTMLButtonElement>
}

const LoginForm: React.FC<PropsLoginForm> = ({ toggleFunction }: any) => {
  const dispatch = useAppDispatch()

  const clickButton = useCallback((loginData: any) => {
    try {
      dispatch(fetchLogin(loginData))
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <div className="p-4" style={{ margin: 'auto', width: '100%' }}>
      <h1 className="text-3xl font-semibold text-center mb-10">Sing in</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validateOnBlur
        onSubmit={(loginData) => clickButton(loginData)}
        validationSchema={validationsSchemaLogin}
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

              <div className="flex items-center justify-between">
                <Button
                  onClick={toggleFunction}
                  type={'button'}
                  btnName={'primary'}
                  label={"Don't have an account?"}
                >
                  Register
                </Button>

                <Button type={'submit'} btnName={'primary'} label={'Sing in'}>
                  Login
                </Button>
              </div>
              <hr className="m-2" />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleButton></GoogleButton>
              </div>

              <a
                className="inline-block align-baseline font-bold text-sm mt-4 text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
              <hr className="m-2" />
            </Form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default LoginForm
