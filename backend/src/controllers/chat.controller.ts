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
  _next: NextFunction,
): Promise<void> {
  const body = req.body as ChatRequestInput;

  // Abort controller driven by client disconnect.
  // When the user clicks "Stop", the browser closes the SSE connection,
  // which fires the 'close' event here, allowing us to cancel the
  // in-flight fetch to OpenRouter instead of wasting tokens.
  const disconnectController = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) {
      logger.debug({ provider: body.provider }, 'Client disconnected — aborting upstream request');
      disconnectController.abort('client_disconnect');
    }
  });

  setSseHeaders(res);

  try {
    const result = await chatService.streamChat(
      body.provider,
      {
        messages: body.messages,
        temperature: body.options?.temperature,
        maxTokens: body.options?.maxTokens,
      },
      (chunk) => writeSseChunk(res, chunk),
      disconnectController.signal,
    );

    // Only write the done event if the client is still connected
    if (!disconnectController.signal.aborted) {
      writeSseDone(res, {
        finishReason: result.finishReason,
        usage: result.usage,
      });
    }
  } catch (err) {
    // Don't write errors to a disconnected client
    if (disconnectController.signal.aborted) return;

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
