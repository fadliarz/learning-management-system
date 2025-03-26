import { Transform } from 'class-transformer';
import DomainException from '../exception/DomainException';

export default function ISO8601ToDate() {
  const ISO8601_REGEX =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

  return Transform(({ value }) => {
    if (value === undefined) return;

    if (typeof value !== 'string') {
      throw new DomainException('The date must be a string');
    }

    if (!ISO8601_REGEX.test(value)) {
      throw new DomainException('The date must be in ISO8601 format');
    }

    return new Date(value);
  });
}
