import ghanaNLPProvider from '../../providers/ghananlp.provider.js';

class TranslationService {
  async translateTwiToEnglish(text) {
    return await ghanaNLPProvider.translate(text, 'tw', 'en');
  }

  async translateEnglishToTwi(text) {
    return await ghanaNLPProvider.translate(text, 'en', 'tw');
  }
}

export default new TranslationService();
