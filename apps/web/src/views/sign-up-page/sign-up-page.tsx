'use client';

import { memo } from 'react';
import { SignUp } from '@/feature';

const signUpPageComponent = function SignUpPageComponent() {
  return <SignUp />;
};
signUpPageComponent.displayName = 'SignUpPage';
/** Registration screen. */
export const SignUpPage = memo(signUpPageComponent);
