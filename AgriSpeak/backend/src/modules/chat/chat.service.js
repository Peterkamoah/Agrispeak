import translationService from '../translation/translation.service.js';
import aiService from '../ai/ai.service.js';
import AppError from '../../core/errors/AppError.js';

class ChatService {
  async processInteraction(userMessage, language) {
    try {
      let englishMessage = userMessage;

      // 1. Translate Twi -> English if necessary
      if (language === 'tw') {
        englishMessage = await translationService.translateTwiToEnglish(userMessage);
      }

      // 2. Send English text to AI
      const aiEnglishResponse = await aiService.getAdvice(englishMessage);

      // 3. Translate response back to Twi if necessary
      if (language === 'tw') {
        const twiResponse = await translationService.translateEnglishToTwi(aiEnglishResponse);
        return twiResponse;
      }

      return aiEnglishResponse;
    } catch (error) {
      throw new AppError(`Chat Service Pipeline Error: ${error.message}`, 500);
    }
  }
}

export default new ChatService();
