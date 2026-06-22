import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  PROVIDER_TIMEOUT_MS: z.string().default('60000').transform(Number),
  RATE_LIMIT_PER_MINUTE: z.string().default('30').transform(Number),

  // OpenRouter
  OPENROUTER_BASE_URL: z.string().default('https://openrouter.ai/api/v1'),

  // GPT (OpenAI via OpenRouter)
  GPT_API_KEY: z.string().optional().default(''),
  GPT_DEFAULT_MODEL: z.string().default('openai/gpt-oss-120b'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
