import { z } from 'zod';

export function zodEnum<T extends z.EnumLike>(enumObj: T, message: string) {
  return z.nativeEnum(enumObj, { errorMap: () => ({ message }) });
}

export function optionalNumber(params?: {
  min?: number;
  max?: number;
  message?: string;
  integer?: boolean;
}) {
  const { min, max, message, integer = true } = params ?? {};
  return z.preprocess(
    (value) => {
      if (value === '' || value === undefined || value === null) {
        return undefined;
      }
      if (typeof value === 'string') {
        return integer ? Number.parseInt(value, 10) : Number.parseFloat(value);
      }
      return value;
    },
    z
      .number()
      .min(min ?? Number.NEGATIVE_INFINITY, { message })
      .max(max ?? Number.POSITIVE_INFINITY, { message })
      .optional(),
  );
}
