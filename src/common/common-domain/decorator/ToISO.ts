import { Transform } from 'class-transformer';
import DomainException from '../exception/DomainException';

export default function ToISO() {
  return Transform(({ value }) => {
    if (value === undefined) return;

    if (typeof value !== 'object') {
      throw new DomainException('The date must be an object');
    }

    return (value as Date).toISOString();
  });
}
