import type { User as UserRow } from '@prisma/client';
import { UserDto } from './dto/user.dto';

/** Database row → API shape (snake_case, no password hash). */
export function toUserResponse(user: UserRow): UserDto {
  return {
    id: user.id,
    email: user.email,
    display_name: user.displayName,
    created_at: user.createdAt.toISOString(),
  };
}
