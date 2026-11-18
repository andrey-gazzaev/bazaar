import type { Credentials, RegisterInput, SessionUser } from '@/models';
import { api } from '../../http';
import { mapUser } from '../../mappers/user/map-user';
import { userResponseSchema } from '../../schemas/user/user-response.schema';

/** Sign-in, registration, and sign-out. */
export class SessionApi {
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
