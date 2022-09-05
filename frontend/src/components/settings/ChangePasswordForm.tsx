import React from 'react';
import { Input } from 'components/common/inputs/Input';
import { Typography } from 'components/common/Typography';

const ChangePasswordForm: React.FC = () => {
  return (
    <>
      <Typography type={'h4'} children={'Change Password'} />
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="sm:w-1/2">
          <Input
            label={'New Password'}
            type={'password'}
            name={'new-password-input'}
            placeholder={'e.g. *******'}
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="sm:w-1/2">
          <Input
            label={'Confirm Password'}
            type={'password'}
            name={'confirm-password-input'}
            placeholder={'e.g. *******'}
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
