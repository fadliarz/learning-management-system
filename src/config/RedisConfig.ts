import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class RedisConfig {
  private readonly _REDIS_HOST: string;
  private readonly _REDIS_PORT: number;
  private readonly _REDIS_PASSWORD: string;

  constructor(private readonly _configService: ConfigService) {
    this._REDIS_HOST = this._configService.getOrThrow<string>('REDIS_HOST');
    this._REDIS_PORT = Number(
      this._configService.getOrThrow<string>('REDIS_PORT'),
    );
    this._REDIS_PASSWORD =
      this._configService.getOrThrow<string>('REDIS_PASSWORD');
  }

  get REDIS_HOST(): string {
    return this._REDIS_HOST;
  }

  get REDIS_PORT(): number {
    return this._REDIS_PORT;
  }

  get REDIS_PASSWORD(): string {
    return this._REDIS_PASSWORD;
  }
}
