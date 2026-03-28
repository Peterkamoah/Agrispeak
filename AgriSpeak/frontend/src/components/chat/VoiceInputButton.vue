<template>
  <div class="relative flex items-center justify-center">
    <button
      type="button"
      @click="toggleListening"
      :class="[
        'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm outline-none focus:ring-2 focus:ring-offset-2',
        !isSupported ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
        isListening ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 animate-pulse' : 
        'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:border-green-300 focus:ring-green-500'
      ]"
      :title="!isSupported ? 'Not supported' : isListening ? 'Stop listening' : 'Start voice input'"
      :disabled="!isSupported"
    >
      <MicIcon v-if="!isListening" class="w-5 h-5" />
      <MicOffIcon v-else class="w-5 h-5" />
      
      <!-- Ripple effect when actively listening -->
      <span v-if="isListening" class="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></span>
    </button>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { Mic as MicIcon, MicOff as MicOffIcon } from 'lucide-vue-next'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'

const props = defineProps({
  language: {
    type: String,
    default: 'tw'
  }
})

const emit = defineProps(['update:transcript', 'error'])
const emits = defineEmits(['update:transcript', 'error'])

const { 
  isSupported, 
  isListening, 
  transcript, 
  error, 
  startListening, 
  stopListening 
} = useSpeechRecognition()

const toggleListening = () => {
  if (isListening.value) {
    stopListening()
  } else {
    startListening(props.language)
  }
}

// Watch for real-time transcript updates and emit them
watch(transcript, (newVal) => {
  if (newVal) {
    emits('update:transcript', newVal)
  }
})

// Watch for errors and bubble them up
watch(error, (newErr) => {
  if (newErr) {
    emits('error', newErr)
    // Auto-reset state for retry cleanly after small delay
    setTimeout(() => {
      if (isListening.value) stopListening()
    }, 1000)
  }
})
</script>
