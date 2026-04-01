import express from 'express';
import asrController from './asr.controller.js';

const router = express.Router();

router.post(
  '/transcribe',
  express.raw({ type: 'audio/*', limit: '10mb' }),
  asrController.handleTranscribe
);

export default router;
