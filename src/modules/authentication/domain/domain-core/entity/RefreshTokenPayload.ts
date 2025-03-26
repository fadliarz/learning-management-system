import { UUID } from 'node:crypto';

export type RefreshTokenPayload = {
  deviceId: UUID;
  userId: number;
  expiredAt: number;
};
