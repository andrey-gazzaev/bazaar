import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { PublicUser } from '../common/public-user';
import { AuthenticatedRequest } from './auth.guard';

/** Signed-in person attached by the auth guard. */
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): PublicUser => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  if (!request.user) throw new UnauthorizedException('Войдите, чтобы продолжить');

  return request.user;
});
