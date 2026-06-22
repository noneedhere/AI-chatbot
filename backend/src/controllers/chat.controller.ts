import type { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service.js';
import type { ChatRequestInput } from '../schemas/chat.schema.js';
import {
  setSseHeaders,
  writeSseChunk,
  writeSseDone,
  writeSseError,
} from '../utils/sseWriter.js';
import { ProviderError } from '../types/chat.types.js';
import { logger } from '../utils/logger.js';

export async function postChat(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const body = req.body as ChatRequestInput;

  setSseHeaders(res);

  try {
    const result = await chatService.streamChat(
      body.provider,
      {
        messages: body.messages,
        temperature: body.options?.temperature,
        maxTokens: body.options?.maxTokens,
      },
      (chunk) => {
        writeSseChunk(res, chunk);
      },
    );

    writeSseDone(res, {
      finishReason: result.finishReason,
      usage: result.usage,
    });
  } catch (err) {
    if (err instanceof ProviderError) {
      writeSseError(res, err.code, err.message);
    } else {
      logger.error({ err }, 'Unexpected chat error');
      writeSseError(res, 'INTERNAL_ERROR', 'An unexpected error occurred.');
    }
  } finally {
    res.end();
  }
}
