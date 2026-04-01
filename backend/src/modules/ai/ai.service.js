import config from '../../config/index.js';
import geminiProvider from '../../providers/gemini.provider.js';

class AIService {
  constructor() {
    const name = config.projectName;
    this.systemPrompt = `You are a certified Ghanaian agricultural extension officer for ${name}.
You ONLY provide advice related to farming, crops, soil, pests, fertilizers, and livestock.
You must give locally relevant advice suitable for Ghana.
You must avoid harmful or unsafe agricultural practices.
If a question is unrelated to agriculture, politely refuse.
Keep answers concise, actionable, and easy to read on a basic phone (short paragraphs; SMS/USSD-friendly when possible).`;
  }

  async getAdvice(userMessage) {
    const messages = [{ role: 'user', content: userMessage }];
    return await geminiProvider.generateResponse(this.systemPrompt, messages);
  }
}

export default new AIService();
