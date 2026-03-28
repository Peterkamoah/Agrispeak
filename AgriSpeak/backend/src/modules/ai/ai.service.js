import openAIProvider from '../../providers/openai.provider.js';

class AIService {
  constructor() {
    this.systemPrompt = `You are a certified Ghanaian agricultural extension officer. 
You ONLY provide advice related to farming, crops, soil, pests, fertilizers, and livestock.
You must give locally relevant advice suitable for Ghana.
You must avoid harmful or unsafe agricultural practices.
If a question is unrelated to agriculture, politely refuse.`;
  }

  async getAdvice(userMessage) {
    const messages = [
      { role: 'user', content: userMessage }
    ];
    return await openAIProvider.generateResponse(this.systemPrompt, messages);
  }
}

export default new AIService();
