import { Injectable } from '@nestjs/common';

@Injectable()
export default class TimerService {
  public static async sleepInMilliseconds(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }
}
