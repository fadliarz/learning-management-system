import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class CookieConfig {
  private readonly _COOKIE_SECRET_KEY: string;
  private readonly _ACCESS_TOKEN_KEY: string;
  private readonly _REFRESH_TOKEN_KEY: string;

  constructor(private readonly _configService: ConfigService) {
    this._COOKIE_SECRET_KEY =
      this._configService.getOrThrow<string>('COOKIE_SECRET_KEY');
    this._ACCESS_TOKEN_KEY =
      this._configService.getOrThrow<string>('ACCESS_TOKEN_KEY');
    this._REFRESH_TOKEN_KEY =
      this._configService.getOrThrow<string>('REFRESH_TOKEN_KEY');
  }

  get COOKIE_SECRET_KEY() {
    return this._COOKIE_SECRET_KEY;
  }

  get ACCESS_TOKEN_KEY(): string {
    return this._ACCESS_TOKEN_KEY;
  }

  get REFRESH_TOKEN_KEY(): string {
    return this._REFRESH_TOKEN_KEY;
  }
}
