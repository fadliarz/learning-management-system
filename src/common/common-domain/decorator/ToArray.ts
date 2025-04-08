import { Transform } from 'class-transformer';
import DomainException from '../exception/DomainException';

export default function ToSet() {
  return Transform(({ value }) => {
    if (value === undefined) return [];

    if (!(value instanceof Set) && !Array.isArray(value)) {
      throw new DomainException('Value must be a set');
    }

    return Array.from(value) as unknown[];
  });
}
