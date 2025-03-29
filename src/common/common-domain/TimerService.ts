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

  public static async sleepWithExponentialBackoff(
    baseDelay: number,
    attempt: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        baseDelay +
          Math.pow(2, attempt) +
          Math.floor(Math.random() * baseDelay),
      );
    });
  }
}
