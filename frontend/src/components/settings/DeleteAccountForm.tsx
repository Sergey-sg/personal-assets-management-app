import React from 'react';
import { Input } from 'components/common/inputs/Input';
import { Typography } from 'components/common/Typography';

const DeleteAccountForm = () => {
  return (
    <>
      <div>
        <Typography type={'h4'} children={'Delete Account'} />
        <Typography
          type={'Ag-14-regular'}
          children={
            'To delete your profile, enter your current password and confirm it.'
          }
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="sm:w-1/2">
          <Input
            label={'Current password'}
            type={'password'}
            name={'cur-password-input'}
            placeholder={'e.g. *******'}
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="sm:w-1/2">
          <Input
            label={'Confirm current password'}
            type={'password'}
            name={'confirm-cur-password-input'}
            placeholder={'e.g. *******'}
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default DeleteAccountForm;
