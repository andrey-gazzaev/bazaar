'use client';

import { memo } from 'react';
import { SignUp } from '@/feature';

/** Registration screen. */
const SignUpPageComponent = function() {
  return <SignUp />;
}

SignUpPageComponent.displayName = 'SignUpPage';
export const SignUpPage = memo(SignUpPageComponent);
