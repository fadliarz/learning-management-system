import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidMechEngEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMahasiswaEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^131\d{5}@mahasiswa\.itb\.ac\.id$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage() {
          return 'The email must follow the format 131XXXXX@mahasiswa.itb.ac.id';
        },
      },
    });
  };
}
