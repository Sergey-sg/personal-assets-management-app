import React from 'react'
import { Typography } from 'components/common/Typography'
import {
  PersonalInfoForm,
  ChangePasswordForm,
  DeleteAccountForm,
} from 'components/settings'

const Settings = () => {
  return (
    <>
      <Typography type={'h2'}>Settings</Typography>
      <Typography type={'Ag-14-regular'}>
        Update your account information
      </Typography>
      <div className="flex flex-col sm:p-10 gap-5">
        <PersonalInfoForm />
        <ChangePasswordForm />
        <DeleteAccountForm />
      </div>
    </>
  )
}

export default Settings
