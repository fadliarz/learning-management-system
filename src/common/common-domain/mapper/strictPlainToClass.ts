import { plainToClass } from 'class-transformer';

export default function strictPlainToClass<T>(
  theClass: new () => T,
  obj: object,
): T {
  return plainToClass(theClass, obj, { excludeExtraneousValues: true });
}
