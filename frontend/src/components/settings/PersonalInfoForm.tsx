import React from 'react'
import { Form, Formik } from 'formik'
import { PersonalInfoSchema } from './schemas/personalInfoSchemes'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { SectionTitle } from './SectionTitle'

interface PersonalInfoFormProps {
  userId: string | number
  firstName: string
  lastName: string
  email: string
  address: string
  birthdate: string
  phone: string
}

const InitialValues: PersonalInfoFormProps = {
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  birthdate: '',
  phone: '',
}

const PersonalInfoForm: React.FC = () => {
  const handleSubmit = (values: typeof InitialValues) => {
    console.log(values)
  }

  return (
    <Formik
      initialValues={InitialValues}
      validationSchema={PersonalInfoSchema}
      onSubmit={handleSubmit}
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
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default PersonalInfoForm
