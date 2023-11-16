import { SetMetadata } from '@nestjs/common';

/* IS_PUBLIC_KEY: This constant represents the key that is used to mark a
controller or method as publicly accessible. */
export const IS_PUBLIC_KEY = 'isPublic';

/*SetMetadata: This is a function that is used to add metadata to a class, method, or property */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
