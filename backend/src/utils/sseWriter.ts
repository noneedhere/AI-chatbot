import type { Response } from 'express';

export function writeSseChunk(res: Response, text: string): void {
  res.write(`event: chunk\ndata: ${JSON.stringify({ text })}\n\n`);
}

export function writeSseDone(
  res: Response,
  payload: { finishReason: string; usage?: object },
): void {
  res.write(`event: done\ndata: ${JSON.stringify(payload)}\n\n`);
}

export function writeSseError(
  res: Response,
  code: string,
  message: string,
): void {
  res.write(`event: error\ndata: ${JSON.stringify({ code, message })}\n\n`);
}

export function setSseHeaders(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering
  res.flushHeaders();
}
