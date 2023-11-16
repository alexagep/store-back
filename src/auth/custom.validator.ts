import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const passRegEx =
            /^(?!.*(.).*\1.*\1.*\1)(?=.*[0-9])(?=.*[a-z]).{6,}$/;
          return typeof value === 'string' && passRegEx.test(value);
        },
      },
    });
  };
}
