import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class CacheConfig {
  private readonly _DEFAULT_TTL_IN_SEC: number;
  private readonly _DEFAULT_INDEX_TTL_IN_SEC: number;

  constructor(private readonly _configService: ConfigService) {
    this._DEFAULT_TTL_IN_SEC =
      this._configService.getOrThrow<number>('DEFAULT_TTL_IN_SEC');
    this._DEFAULT_INDEX_TTL_IN_SEC = this._configService.getOrThrow<number>(
      'DEFAULT_INDEX_TTL_IN_SEC',
    );
  }

  get DEFAULT_TTL_IN_SEC(): number {
    return this._DEFAULT_TTL_IN_SEC;
  }

  get DEFAULT_INDEX_TTL_IN_SEC(): number {
    return this._DEFAULT_INDEX_TTL_IN_SEC;
  }
}
