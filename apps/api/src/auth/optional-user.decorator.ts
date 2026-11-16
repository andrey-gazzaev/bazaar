import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { PublicUser } from '../common/public-user';
import { AuthenticatedRequest } from './auth.guard';

/** Signed-in person when the optional auth guard found a session. Null for a guest. */
export const OptionalUser = createParamDecorator((_data: unknown, context: ExecutionContext): PublicUser | null => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  return request.user ?? null;
});
