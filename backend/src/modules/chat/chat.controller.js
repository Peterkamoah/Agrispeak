import chatService from './chat.service.js';

class ChatController {
  async handleChat(req, res, next) {
    try {
      const { message, language } = req.body;
      const response = await chatService.processInteraction(message, language);
      
      res.status(200).json({
        status: 'success',
        data: {
          reply: response
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
