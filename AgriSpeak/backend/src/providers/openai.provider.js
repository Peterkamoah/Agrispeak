import config from '../config/index.js';
import AppError from '../core/errors/AppError.js';

class OpenAIProvider {
  /**
   * Mock implementation if no API key is present
   */
  async generateResponse(systemPrompt, userMessages) {
    if (config.openaiApiKey === 'mock_openai_key' || !config.openaiApiKey) {
      console.log('[OpenAIProvider] Using MOCK response');
      return "This is a mock response from the agricultural assistant. You should apply NPK fertilizer when the rains start.";
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...userMessages
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new AppError(`Failed to fetch from OpenAI: ${error.message}`, 502);
    }
  }
}

export default new OpenAIProvider();
