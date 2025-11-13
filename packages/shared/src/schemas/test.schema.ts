import z from 'zod';

export const zodTestSchema = z.string();

export type ZodTest = z.infer<typeof zodTestSchema>;
