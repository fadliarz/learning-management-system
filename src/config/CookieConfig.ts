import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class CookieConfig {
  private readonly _COOKIE_SECRET_KEY: string;

  constructor(private readonly _configService: ConfigService) {
    this._COOKIE_SECRET_KEY =
      this._configService.getOrThrow<string>('COOKIE_SECRET_KEY');
  }

  get COOKIE_SECRET_KEY() {
    return this._COOKIE_SECRET_KEY;
  }
}
