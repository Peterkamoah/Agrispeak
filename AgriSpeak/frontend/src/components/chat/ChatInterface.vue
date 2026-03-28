<template>
  <div class="flex flex-col h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xl shadow-green-900/5">
    <!-- Messages Area -->
    <div class="flex-1 p-4 overflow-y-auto bg-gray-50/50" ref="messagesContainer">
      <div v-if="chatStore.messages.length === 0" class="h-full flex flex-col items-center justify-center text-center p-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <LeafIcon class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">How can I help you today?</h3>
        <p class="text-gray-500 max-w-sm text-sm">
          Ask me any questions about farming, crops, soil, pests, fertilizers, and livestock in Ghana.
        </p>
      </div>

      <MessageBubble 
        v-for="msg in chatStore.messages" 
        :key="msg.id"
        :is-user="msg.sender === 'user'"
        :is-error="msg.isError"
        :timestamp="msg.timestamp"
      >
        {{ msg.text }}
      </MessageBubble>

      <!-- Loading State -->
      <div v-if="chatStore.isLoading" class="flex justify-start mb-4">
        <div class="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 rounded-bl-sm flex items-center justify-center">
          <div class="flex space-x-1.5 items-center">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t border-gray-100">
      <div class="flex items-center space-x-2 mb-3">
         <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language:</span>
         <select v-model="currentLanguage" @change="handleLanguageChange" class="text-sm border-0 bg-gray-100 text-gray-700 font-medium rounded-md py-1 px-2 focus:ring-2 focus:ring-green-500 outline-none transition-all cursor-pointer">
           <option value="en">English</option>
           <option value="tw">Twi</option>
         </select>
      </div>
      <form @submit.prevent="sendMessage" class="flex space-x-2">
        <Input 
          v-model="newMessage" 
          placeholder="Type your message..." 
          class="flex-1 shadow-sm"
          :disabled="chatStore.isLoading"
        />
        <Button 
          type="submit" 
          :disabled="!newMessage.trim() || chatStore.isLoading"
          class="w-12 px-0 shadow-sm transition-transform active:scale-95"
        >
          <SendIcon class="w-5 h-5" />
          <span class="sr-only">Send</span>
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Leaf as LeafIcon, Send as SendIcon } from 'lucide-vue-next'
import { useChatStore } from '@/store/chat'
import MessageBubble from './MessageBubble.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const chatStore = useChatStore()
const newMessage = ref('')
const messagesContainer = ref(null)
const currentLanguage = ref(chatStore.currentLanguage)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => chatStore.messages.length, scrollToBottom)

const handleLanguageChange = () => {
  chatStore.setLanguage(currentLanguage.value)
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  const text = newMessage.value
  newMessage.value = ''
  
  await chatStore.sendMessage(text)
}
</script>
