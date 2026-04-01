import { transcribeAudio } from '../../providers/khaya.service.js';
import AppError from '../../core/errors/AppError.js';

class AsrController {
  async handleTranscribe(req, res, next) {
    try {
      const language = req.query.language;
      if (!language) {
        throw new AppError('Query parameter "language" is required (e.g. tw, ee, gaa)', 400);
      }

      if (!req.body || req.body.length === 0) {
        throw new AppError('Request body must contain audio data', 400);
      }

      const contentType = req.headers['content-type'] || 'audio/webm';
      const transcript = await transcribeAudio(req.body, language, contentType);

      res.status(200).json({
        status: 'success',
        data: { transcript },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AsrController();
