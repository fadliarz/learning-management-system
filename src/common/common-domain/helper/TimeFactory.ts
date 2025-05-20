export default class TimeFactory {
  public static generate(): Date {
    return new Date();
  }

  public static dateToRandomMicroseconds(date: Date): number {
    return date.getTime() * 1000 + Math.floor(Math.random() * 999);
  }

  public static getGMT7StartAndEndOfTodayInMillis(): {
    start: number;
    end: number;
  } {
    const now: Date = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(-7, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(16, 59, 59, 999);
    return {
      start: startOfDay.getTime(),
      end: endOfDay.getTime(),
    };
  }

  public static getGMT7UpcomingMillis(): {
    start: number;
    end: number;
  } {
    const now: Date = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(-7, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(48 - 7, 59, 59, 999);
    return {
      start: startOfDay.getTime(),
      end: endOfDay.getTime(),
    };
  }
}
