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
          text: response.data.reply,
          sender: 'ai',
          timestamp: new Date()
        });
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Sorry, I am having trouble connecting right now. Please try again later.';
        this.error = errorMessage;
        this.messages.push({
          id: Date.now() + 1,
          text: errorMessage,
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
