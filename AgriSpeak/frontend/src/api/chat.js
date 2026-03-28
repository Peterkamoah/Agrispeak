import apiClient from './client';

export const chatApi = {
  sendMessage: async (message, language = 'en') => {
    const response = await apiClient.post('/chat/message', {
      message,
      language
    });
    return response.data;
  }
};
