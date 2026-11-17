'use client';

import { memo } from 'react';
import { SignIn } from '@/feature';

/** Sign-in screen. */
const SignInPageComponent = function() {
  return <SignIn />;
}

SignInPageComponent.displayName = 'SignInPage';
export const SignInPage = memo(SignInPageComponent);
