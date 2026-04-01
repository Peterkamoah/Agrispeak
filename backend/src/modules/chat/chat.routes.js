import express from 'express';
import chatController from './chat.controller.js';
import { validate } from '../../core/middleware/validate.middleware.js';
import { chatSchema } from './chat.schema.js';

const router = express.Router();

router.post('/', validate(chatSchema), chatController.handleChat);

export default router;
