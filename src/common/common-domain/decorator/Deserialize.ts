import { Transform } from 'class-transformer';

export default function Deserialize() {
  return Transform(({ obj, key, value }) => {
    if (value === undefined) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (typeof value !== 'string') return value;

    let result = JSON.parse(value);
    while (typeof result !== 'object') {
      result = JSON.parse(result);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  });
}
