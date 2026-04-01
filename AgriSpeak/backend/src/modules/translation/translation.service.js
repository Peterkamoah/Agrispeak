import { translateText } from '../../providers/khaya.service.js';

class TranslationService {
  async translateTwiToEnglish(text) {
    return await translateText(text, 'tw-en');
  }

  async translateEnglishToTwi(text) {
    return await translateText(text, 'en-tw');
  }
}

export default new TranslationService();
