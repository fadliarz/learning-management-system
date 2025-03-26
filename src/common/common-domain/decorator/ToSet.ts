import { Transform } from 'class-transformer';
import DomainException from '../exception/DomainException';

export default function ToSet() {
  return Transform(({ value }) => {
    if (value === undefined) return;

    if (!Array.isArray(value)) {
      throw new DomainException('Value must be an array');
    }

    return new Set(value);
  });
}
