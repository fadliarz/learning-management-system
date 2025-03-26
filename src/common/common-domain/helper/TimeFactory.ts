export default class TimeFactory {
  public static generate(): Date {
    return new Date();
  }

  public static dateToRandomMicroseconds(date: Date): number {
    return date.getTime() * 1000 + Math.floor(Math.random() * 999);
  }
}
