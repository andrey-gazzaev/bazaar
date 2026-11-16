import type { SessionUser, UserDraft, UserPatch } from '@/models';
import { api } from '../../http';
import { mapUser } from '../../mappers/user/map-user';
import { userListSchema } from '../../schemas/user/user-list.schema';
import { userResponseSchema } from '../../schemas/user/user-response.schema';

/** Admin accounts. */
export class UserApi {
  /** Every account. */
  public async list(): Promise<readonly SessionUser[]> {
    const { data } = await api.get('/api/users');
    return userListSchema.parse(data).users.map(mapUser);
  }

  /** Creates an account of any role. */
  public async create(input: UserDraft): Promise<SessionUser> {
    const { data } = await api.post('/api/users', input);
    return mapUser(userResponseSchema.parse(data).user);
  }

  /** Changes one account. */
  public async update(id: string, input: UserPatch): Promise<SessionUser> {
    const { data } = await api.patch(`/api/users/${id}`, input);
    return mapUser(userResponseSchema.parse(data).user);
  }

  /** Removes an account. */
  public async remove(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  }
}

/** Shared account client. */
export const userApi = new UserApi();
