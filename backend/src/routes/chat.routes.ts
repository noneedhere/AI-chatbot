import { Router } from 'express';
import { postChat } from '../controllers/chat.controller.js';
import { validateBody } from '../middlewares/validateRequest.middleware.js';
import { chatRequestSchema } from '../schemas/chat.schema.js';
import { chatRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/', chatRateLimiter, validateBody(chatRequestSchema), postChat);

export default router;
