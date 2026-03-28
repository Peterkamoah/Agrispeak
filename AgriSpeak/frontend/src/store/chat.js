import { defineStore } from 'pinia';
import { chatApi } from '../api/chat.js';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    isLoading: false,
    error: null,
    currentLanguage: 'tw', // Default to Twi as per requirements
  }),
  actions: {
    setLanguage(lang) {
      this.currentLanguage = lang;
    },
    async sendMessage(text) {
      if (!text.trim()) return;
      
      // Add user message immediately
      this.messages.push({
        id: Date.now(),
        text: text,
        sender: 'user',
        timestamp: new Date()
      });
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await chatApi.sendMessage(text, this.currentLanguage);
        
        this.messages.push({
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'ai',
          timestamp: new Date()
        });
      } catch (err) {
        this.error = err.message || 'Failed to send message';
        this.messages.push({
          id: Date.now() + 1,
          text: 'Sorry, I am having trouble connecting right now. Please try again later.',
          sender: 'system',
          isError: true,
          timestamp: new Date()
        });
      } finally {
        this.isLoading = false;
      }
    },
    clearMessages() {
      this.messages = [];
      this.error = null;
    }
  }
});
