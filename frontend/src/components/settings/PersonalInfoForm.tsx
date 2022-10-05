import React, { useEffect } from 'react'
import { Form, Formik } from 'formik'
import { PersonalInfoSchema } from './schemas/personalInfoSchemes'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { SectionTitle } from './SectionTitle'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { updateUserProfile } from 'redux/slice/userProfile/actionCreators'
import { IUserProfile } from 'redux/slice/userProfile/userProfile.slice'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { resetError } from 'redux/slice/error/error.slice'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PersonalInfoForm: React.FC = () => {
  const dispatch = useAppDispatch()

  const userProfile = useAppSelector((state) => state.userProfile)
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)

  useEffect(() => {
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error, success])

  const InitialValues: IUserProfile = {
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    email: userProfile.email || '',
    address: userProfile.address || '',
    birthdate: userProfile.birthdate || '',
    phone: userProfile.phone || '',
  }

  const handleSubmit = (values: typeof InitialValues) => {
    dispatch(updateUserProfile(values))
  }

  return (
    <Formik
      initialValues={InitialValues}
      validationSchema={PersonalInfoSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ dirty, isValid }) => {
        return (
          <>
            <SectionTitle title={'Personal Information'} />

            <Form className="flex flex-col gap-8 mb-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <InputField
                    label={'First Name'}
                    type={'text'}
                    name={'firstName'}
                    placeholder={'e.g. John'}
                    className="sm:w-1/2"
                  />
                  <InputField
                    label={'Last Name'}
                    type={'text'}
                    name={'lastName'}
                    placeholder={'e.g. Doe'}
                    className="sm:w-1/2"
                  />
                </div>

                <div className="flex flex-col gap-5 sm:flex-row">
                  <InputField
                    label={'Email'}
                    type={'email'}
                    name={'email'}
                    placeholder={'e.g. jhons@mail.com'}
                    className="sm:w-1/2"
                  />
                  <InputField
                    label={'Address'}
                    type={'text'}
                    name={'address'}
                    placeholder={'e.g. Ukraine, Kyiv, Vesneva St., 37'}
                    className="sm:w-1/2"
                  />
                </div>

                <div className="flex flex-col gap-5 sm:flex-row">
                  <InputField
                    label={'Date of Birth'}
                    type={'date'}
                    name={'birthdate'}
                    placeholder={'e.g. 22.05.2000'}
                    className="sm:w-1/2"
                  />
                  <InputField
                    label={'Mobile Number'}
                    type={'tel'}
                    name={'phone'}
                    placeholder={'e.g.+380 99 999 99 99'}
                    className="sm:w-1/2"
                  />
                </div>
              </div>
              <Button
                label={'Edit Personal Information'}
                type={'submit'}
                btnName={'primary'}
                disabled={!(isValid && dirty)}
              />
              <ToastContainer transition={Zoom} />
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default PersonalInfoForm
