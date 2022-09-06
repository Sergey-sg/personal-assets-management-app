import React, { useCallback } from 'react';
import style from './GoogleButton.module.scss';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { authWithGoogle } from '../../../redux/slice/authSlice';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

type Props = {};
const GoogleButton = (props: Props) => {
  const dispatch = useAppDispatch();

  const googleAuth = useCallback(
    (el: any) => {
      dispatch(authWithGoogle(el));
    },
    [dispatch],
  );

  return (
    <>
      <GoogleOAuthProvider clientId="172952986362-6vpj2i89qbfris3ibeq9m6hrcqht2gnn.apps.googleusercontent.com">
        Hello
        <GoogleLogin
          onSuccess={(credentialResponse) =>
            googleAuth(credentialResponse.credential)
          }
          type="icon"
          onError={() => {
            console.log('Login Failed');
          }}
          theme="filled_black"
        />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleButton;
