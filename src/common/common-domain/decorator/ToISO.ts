import { Transform } from 'class-transformer';
import DomainException from '../exception/DomainException';

export default function ToISO() {
  return Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (value === undefined || typeof value === 'string') return value;

    if (typeof value !== 'object')
      throw new DomainException('The date must be an object');

    return (value as Date).toISOString();
  });
}
