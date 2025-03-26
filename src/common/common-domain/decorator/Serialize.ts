import { Transform } from 'class-transformer';

export default function Serialize() {
  return Transform(({ value }) => {
    if (value === undefined) return;

    return JSON.stringify(value);
  });
}
