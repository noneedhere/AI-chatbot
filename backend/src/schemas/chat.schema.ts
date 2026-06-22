import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  provider: z.enum(['gpt']),
  messages: z
    .array(messageSchema)
    .min(1, 'messages must contain at least one message'),
  options: z
    .object({
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().int().positive().optional(),
    })
    .optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
