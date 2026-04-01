import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required'),
    language: z.enum(['en', 'tw']).default('tw')
  })
});
