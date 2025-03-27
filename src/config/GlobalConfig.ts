import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class GlobalConfig {
  private readonly _SALT_ROUNDS: number;

  constructor(private readonly _configService: ConfigService) {
    this._SALT_ROUNDS = Number(
      this._configService.getOrThrow<string>('SALT_ROUNDS'),
    );
  }

  get SALT_ROUNDS() {
    return this._SALT_ROUNDS;
  }
}
