import { UUID } from 'node:crypto';

export type RefreshToken = {
  deviceId: UUID;
  token: string;
  expiredAt: number;
};
