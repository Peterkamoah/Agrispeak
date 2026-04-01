import config from '../config/index.js';
import AppError from '../core/errors/AppError.js';

const GEMINI_API_ROOT = 'https://generativelanguage.googleapis.com/v1beta';

function isMockKey() {
  const k = config.googleApiKey;
  return !k || k === 'mock_openai_key' || k === 'mock_gemini_key';
}

class GeminiProvider {
  async generateResponse(systemPrompt, userMessages) {
    if (isMockKey()) {
      console.log('[GeminiProvider] Using MOCK response');
      return 'This is a mock response from the agricultural assistant. You should apply NPK fertilizer when the rains start.';
    }

    const model = encodeURIComponent(config.geminiModel);
    const url = `${GEMINI_API_ROOT}/models/${model}:generateContent?key=${encodeURIComponent(config.googleApiKey)}`;

    const contents = userMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7 },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.error?.message || response.statusText;
        throw new Error(msg || `HTTP ${response.status}`);
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';

      if (!text) {
        const reason = data?.candidates?.[0]?.finishReason;
        throw new Error(reason ? `Gemini finished: ${reason}` : 'Empty model response');
      }

      return text;
    } catch (error) {
      throw new AppError(`Failed to fetch from Gemini: ${error.message}`, 502);
    }
  }
}

export default new GeminiProvider();
