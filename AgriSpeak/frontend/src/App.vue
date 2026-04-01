<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 transition-all shadow-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3 group cursor-pointer">
          <div class="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 group-hover:scale-105 transition-transform duration-300">
            <LeafIcon class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">{{ projectName }}</span>
        </div>
        <div>
          <Button variant="ghost" size="sm" @click="clearChat" class="text-gray-500 hover:text-gray-900 font-medium transition-colors">
            Clear Chat
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col md:flex-row gap-12 items-center md:items-start">
      
      <!-- Hero Section (Left Col on Desktop) -->
      <div class="flex-1 md:pt-14 w-full">
        <div class="inline-flex items-center space-x-2 bg-green-50 border border-green-100 text-green-700 px-3.5 py-1.5 rounded-full text-sm font-semibold mb-8 shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>AI Agricultural Assistant for Ghana</span>
        </div>
        
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          Expert Farming Advice, <br class="hidden sm:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">In Your Language.</span>
        </h1>
        
        <p class="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed font-light">
          AgriSpeak bridges the gap between modern agricultural expertise and local farmers in Ghana. Ask questions in English or Twi and get instant, locally-relevant advice.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4 group">
            <div class="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
              <LanguagesIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Bilingual Support</h3>
              <p class="text-sm text-gray-500 leading-relaxed">Fluent in both Twi and English translation seamlessly.</p>
            </div>
          </div>
          
          <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4 group">
            <div class="bg-amber-50 p-3 rounded-xl group-hover:bg-amber-100 transition-colors">
              <SunIcon class="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Local Context</h3>
              <p class="text-sm text-gray-500 leading-relaxed">Advice tailored specifically for Ghanaian soil and climate.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Interface (Right Col on Desktop) -->
      <div class="flex-1 w-full max-w-lg relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative">
          <ChatInterface />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { Leaf as LeafIcon, Languages as LanguagesIcon, Sun as SunIcon } from 'lucide-vue-next'
import { useChatStore } from '@/store/chat'
import { getProjectDisplayName } from '@/lib/env'
import Button from '@/components/ui/Button.vue'
import ChatInterface from '@/components/chat/ChatInterface.vue'

const chatStore = useChatStore()
const projectName = getProjectDisplayName()

const clearChat = () => {
  chatStore.clearMessages()
}
</script>
