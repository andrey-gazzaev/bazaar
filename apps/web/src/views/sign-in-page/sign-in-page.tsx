'use client';

import { memo } from 'react';
import { SignIn } from '@/feature';

const signInPageComponent = function SignInPageComponent() {
  return <SignIn />;
};
signInPageComponent.displayName = 'SignInPage';
/** Sign-in screen. */
export const SignInPage = memo(signInPageComponent);
