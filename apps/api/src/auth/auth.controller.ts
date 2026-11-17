import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PublicUser } from '../common/public-user';
import { SESSION_COOKIE, SESSION_MAX_AGE, USER_COOKIE } from '../common/session';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/** Sign-up, sign-in, the current person, and sign-out. */
@Controller('auth')
export class AuthController {
  /** Opens and reads sessions. */
  public constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  /** Creates a client or seller and sets the session cookies. */
  @Post('register')
  public async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.auth.register(dto);
    this.attach(response, session.token, session.user);
    return { user: session.user };
  }

  /** Sets the session cookies when the password matches. */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.auth.login(dto);
    this.attach(response, session.token, session.user);
    return { user: session.user };
  }

  /** Person for the current cookie. The user is null when nobody is signed in. */
  @Get('session')
  public async session(@Req() request: Request): Promise<{ user: PublicUser | null }> {
    const raw: unknown = request.cookies?.[SESSION_COOKIE];
    const token = typeof raw === 'string' ? raw : null;
    return { user: await this.auth.userFromToken(token) };
  }

  /** Clears the session cookies. */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public logout(@Res({ passthrough: true }) response: Response): { ok: true } {
    response.clearCookie(SESSION_COOKIE, { path: '/' });
    response.clearCookie(USER_COOKIE, { path: '/' });
    return { ok: true };
  }

  private attach(response: Response, token: string, user: PublicUser): void {
    const options = {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: SESSION_MAX_AGE,
    };

    response.cookie(SESSION_COOKIE, token, options);
    response.cookie(USER_COOKIE, JSON.stringify(user), options);
  }
}
