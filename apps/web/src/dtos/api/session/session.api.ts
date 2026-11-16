import type { Credentials, RegisterInput, SessionUser } from '@/models';
import { api } from '../../http';
import { mapUser } from '../../mappers/user/map-user';
import { sessionSchema } from '../../schemas/session/session.schema';
import { userResponseSchema } from '../../schemas/user/user-response.schema';

/** Sign-in, registration, the current person, and sign-out. */
export class SessionApi {
  /** Person for the current cookie. Empty when nobody is signed in. */
  public async current(): Promise<SessionUser | null> {
    const { data } = await api.get('/api/auth/session');
    const user = sessionSchema.parse(data).user;
    return user ? mapUser(user) : null;
  }

  /** Opens a session. */
  public async login(input: Credentials): Promise<SessionUser> {
    const { data } = await api.post('/api/auth/login', input);
    return mapUser(userResponseSchema.parse(data).user);
  }

  /** Creates a client or seller and opens a session. */
  public async register(input: RegisterInput): Promise<SessionUser> {
    const { data } = await api.post('/api/auth/register', input);
    return mapUser(userResponseSchema.parse(data).user);
  }

  /** Drops the current session. */
  public async leave(): Promise<void> {
    await api.post('/api/auth/logout');
  }
}

/** Shared session client. */
export const sessionApi = new SessionApi();
