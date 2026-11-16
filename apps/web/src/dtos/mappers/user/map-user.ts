import type { SessionUser } from '@/models';
import type { UserDto } from '../../schemas/user/user.schema';

/** Account stored for the shop. */
export function mapUser(dto: UserDto): SessionUser {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role,
  };
}
