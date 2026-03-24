import { z } from 'zod';

export function zodEnum<T extends z.EnumLike>(enumObj: T, message: string) {
  return z.nativeEnum(enumObj, { errorMap: () => ({ message }) });
}
