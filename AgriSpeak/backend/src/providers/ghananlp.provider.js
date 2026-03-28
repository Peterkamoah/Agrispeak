import config from '../config/index.js';
import AppError from '../core/errors/AppError.js';

class GhanaNLPProvider {
  async translate(text, fromLang, toLang) {
    if (config.ghanaNlpApiKey === 'mock_ghananlp_key' || !config.ghanaNlpApiKey) {
      console.log(`[GhanaNLPProvider] Using MOCK translation: ${fromLang} -> ${toLang}`);
      // Simple mock behavior: Just append a tag to show translation occurred
      if (fromLang === 'tw' && toLang === 'en') {
        return `[Translated to English] ${text}`;
      } else {
        return `[Translated to Twi] ${text}`;
      }
    }

    try {
      // Theoretical GhanaNLP API Implementation
      // Refer to GhanaNLP Khaya API documentation.
      const response = await fetch('https://translation-api.ghananlp.org/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ghanaNlpApiKey}`
        },
        body: JSON.stringify({
          text: text,
          source_language: fromLang,
          target_language: toLang
        })
      });

      if (!response.ok) {
        throw new Error(`GhanaNLP API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.translated_text;
    } catch (error) {
      throw new AppError(`Failed to fetch from GhanaNLP: ${error.message}`, 502);
    }
  }
}

export default new GhanaNLPProvider();
