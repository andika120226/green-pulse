import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('ADMIN_BPBD' | 'MANGGALA_AGNI' | 'CITIZEN')[]) =>
  SetMetadata(ROLES_KEY, roles);

