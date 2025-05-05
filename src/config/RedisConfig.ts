import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class RedisConfig {
  private readonly _REDIS_PORT: number;
  private readonly _REDIS_PASSWORD: string;

  constructor(private readonly _configService: ConfigService) {
    this._REDIS_PORT = this._configService.getOrThrow<number>('REDIS_PORT');
    this._REDIS_PASSWORD =
      this._configService.getOrThrow<string>('REDIS_PASSWORD');
  }

  get REDIS_PORT(): number {
    return this._REDIS_PORT;
  }

  get REDIS_PASSWORD(): string {
    return this._REDIS_PASSWORD;
  }
}
