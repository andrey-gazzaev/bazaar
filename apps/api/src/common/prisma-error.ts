import { ConflictException, NotFoundException } from '@nestjs/common';

/** Turns unique and missing-row errors into HTTP exceptions. */
export function rethrowPrisma(
  error: unknown,
  messages: { readonly conflict?: string; readonly missing?: string },
): never {
  const code = prismaCode(error);

  if (code === 'P2002' && messages.conflict) throw new ConflictException(messages.conflict);
  if (code === 'P2025' && messages.missing) throw new NotFoundException(messages.missing);

  throw error;
}

function prismaCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) return null;

  const code = error.code;
  return typeof code === 'string' ? code : null;
}
