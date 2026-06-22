import type { Request, Response, NextFunction } from 'express';
import { providerService } from '../services/provider.service.js';

export function getProviders(req: Request, res: Response, next: NextFunction): void {
  try {
    const providers = providerService.getAll();
    res.json({ providers });
  } catch (err) {
    next(err);
  }
}
